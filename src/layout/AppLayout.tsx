import { ROUTES } from "@/common/constants/routes";
import BackToTop from "@/components/layout/BackToTop";
import ConfigSetting from "@/components/layout/ConfigSetting";
import AppTabHeader from "@/components/layout/TabHeader";
import { ChangePasswordModal } from "@/components/ui/change-password/ChangePassword";
import HRMChatbot from "@/components/ui/chat-bot/ChatBotAI";
import { ChatPopup } from "@/components/ui/chat/ChatPopup";
import { VideoCallModal } from "@/components/ui/chat/VideoCallModal";
import { useAuth } from "@/context/AuthContext";
import { ConfigProvider, useConfig } from "@/context/ConfigContext";
import { useFloatingButton } from "@/context/FloatingButtonContext";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/context/TranslationContext";
import { usePaginationEmployee } from "@/hooks/employee";
import { useChatRooms, useCreateDirectChat } from "@/hooks/layout/useChat";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppFooter from "./AppFooter";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

interface ActiveChat {
  id: string;
  chatRoomId: string;
  partnerName: string;
  partnerAvatar?: string;
  isMinimized: boolean;
}

function AppLayoutContent() {
  const { settings, footerSettings } = useConfig();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);
  const { socket } = useSocket();
  const [activeCall, setActiveCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const router = useRouter();
  const location = useLocation();
  const { showToast } = useToast();
  const { position } = useFloatingButton("chat-button", 3);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const { data: rooms, refetch: refetchRooms } = useChatRooms();
  const { onCreateDirectChat } = useCreateDirectChat();
  const { data: employeeData, isLoading: isLoadingEmployees } =
    usePaginationEmployee({
      take: 100,
      skip: 0,
      where: { isDeleted: false },
    });

  const getUserId = (): string => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.uid || payload.sub || payload.id || "";
    } catch (error) {
      return "";
    }
  };
  const currentUserId = getUserId();

  const handleLogout = async () => {
    await logout();
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    if (!socket) return;
    socket.on("call:incoming", (data: any) => {
      setIncomingCall(data);
    });

    socket.on("call:ended", () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:ended");
    };
  }, [socket]);

  const handleAnswer = () => {
    socket?.emit("call:answer", { callLogId: incomingCall.callLogId });
    setActiveCall({
      ...incomingCall,
      isInitiator: false,
      recipientId: incomingCall.callerId,
    });
    setIncomingCall(null);
  };

  const handleReject = () => {
    socket?.emit("call:reject", { callLogId: incomingCall.callLogId });
    setIncomingCall(null);
  };

  const handleSelectEmployee = (employee: any) => {
    const userAccount = employee.user || employee.__user__;
    const targetUserId = userAccount?.id;

    if (!targetUserId) {
      showToast({
        type: "error",
        title: "Không thể chat",
        message: `Nhân viên ${employee.fullName} chưa được cấp tài khoản login.`,
      });
      return;
    }

    onCreateDirectChat(targetUserId, {
      onSuccess: (res: any) => {
        const newChatRoomId = res.data.id;
        const existingChat = activeChats.find(
          (chat) => chat.chatRoomId === newChatRoomId
        );

        if (existingChat) {
          if (existingChat.isMinimized) {
            setActiveChats((prev) =>
              prev.map((chat) =>
                chat.id === existingChat.id
                  ? { ...chat, isMinimized: false }
                  : chat
              )
            );
          }
        } else {
          const newChat: ActiveChat = {
            id: `chat-${Date.now()}`,
            chatRoomId: newChatRoomId,
            partnerName: employee.fullName,
            partnerAvatar: employee.avatar,
            isMinimized: false,
          };
          setActiveChats((prev) => [...prev, newChat]);
        }

        setShowEmployeeModal(false);
        refetchRooms();
      },
    });
  };

  const handleInitiateCall = async (
    callType: "AUDIO" | "VIDEO",
    chatRoomId: string
  ) => {
    if (!chatRoomId || !socket) return;
    try {
      const res: any = await rootApiService.post(
        API_ENDPOINTS.CHAT.ROOM_DETAIL,
        { roomId: chatRoomId }
      );
      const recipient = res.data.members.find(
        (m: any) => m.userId !== currentUserId
      );
      if (!recipient) return;

      socket.emit(
        "call:initiate",
        {
          chatRoomId: chatRoomId,
          callType,
          recipientIds: [recipient.userId],
        },
        (response: any) => {
          if (response.success) {
            setActiveCall({
              callLogId: response.callLogId,
              recipientId: recipient.userId,
              isInitiator: true,
              callType,
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseChat = (chatId: string) => {
    setActiveChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const handleMinimizeChat = (chatId: string) => {
    setActiveChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isMinimized: true } : chat
      )
    );
  };

  const handleRestoreChat = (chatId: string) => {
    setActiveChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isMinimized: false } : chat
      )
    );
  };

  const handleOpenChat = () => {
    setShowEmployeeModal(true);
  };

  const getMinimizedChatPosition = (index: number) => {
    const basePosition = position + 70;
    return basePosition + index * 65;
  };

  useEffect(() => {
    const appLayout = document.querySelector(".app-layout");
    if (appLayout) {
      if (settings.sidebarPosition === "right") {
        appLayout.classList.add("flex-row-reverse");
      } else {
        appLayout.classList.remove("flex-row-reverse");
      }
    }
  }, [settings.sidebarPosition]);

  useEffect(() => {
    const root = document.documentElement;
    if (!settings.showTabHeader) {
      root.classList.add("tab-header-hidden");
    } else {
      root.classList.remove("tab-header-hidden");
    }
  }, [settings.showTabHeader]);

  return (
    <div
      className={`flex h-lvh overflow-hidden app-layout ${
        settings.sidebarPosition === "right" ? "flex-row-reverse" : ""
      }`}
    >
      <div className={`${collapsed ? "overflow-visible" : ""} z-50`}>
        <AppSidebar collapsed={collapsed} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <AppNavbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onChangePassword={() => setChangePassVisible(true)}
          onLogout={handleLogout}
          onOpenSettings={() => setSettingsVisible(true)}
          showNotification={settings.notifications}
          onChatOpen={(roomId: string) => {
            const room = rooms?.find((r: any) => r.id === roomId);
            if (room) {
              const recipient = room.members?.find(
                (m: any) => m.userId !== currentUserId
              );
              const recipientEmployee = recipient?.user?.employee;

              const existingChat = activeChats.find(
                (chat) => chat.chatRoomId === roomId
              );

              if (existingChat) {
                if (existingChat.isMinimized) {
                  handleRestoreChat(existingChat.id);
                }
              } else {
                const newChat: ActiveChat = {
                  id: `chat-${Date.now()}`,
                  chatRoomId: roomId,
                  partnerName:
                    recipientEmployee?.fullName || room.name || "Người dùng",
                  partnerAvatar: recipientEmployee?.avatar,
                  isMinimized: false,
                };
                setActiveChats((prev) => [...prev, newChat]);
              }
            }
          }}
        />

        {settings.showTabHeader && <AppTabHeader routes={ROUTES.MAIN} />}

        <main className="main-layout flex-1 overflow-hidden">
          <Outlet context={{ setActiveCall }} />
        </main>

        <AppFooter
          visible={footerSettings.showFooter}
          content={footerSettings.footerContent}
          showVersion={footerSettings.showVersion}
          showCopyright={footerSettings.showCopyright}
        />

        {incomingCall && (
          <div className="fixed top-5 right-5 z-10000 bg-white p-5 shadow-2xl rounded-lg border-2 border-blue-500 animate-bounce">
            <p className="font-bold">
              Cuộc gọi đến từ: {incomingCall.callerName || "Đồng nghiệp"}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAnswer}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Trả lời
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Từ chối
              </button>
            </div>
          </div>
        )}

        {activeCall && (
          <VideoCallModal
            callLogId={activeCall.callLogId}
            recipientId={activeCall.recipientId}
            isInitiator={activeCall.isInitiator}
            callType={activeCall.callType}
            onClose={() => setActiveCall(null)}
          />
        )}
      </div>

      <ChangePasswordModal
        visible={changePassVisible}
        onHide={() => setChangePassVisible(false)}
      />

      <ConfigSetting
        visible={settingsVisible}
        onHide={() => setSettingsVisible(false)}
      />

      {location.pathname !== "/chat" &&
        activeChats.map((chat, index) => (
          <ChatPopup
            key={chat.id}
            chatRoomId={chat.chatRoomId}
            currentUserId={currentUserId}
            partnerName={chat.partnerName}
            partnerAvatar={chat.partnerAvatar}
            isMinimized={chat.isMinimized}
            stackIndex={activeChats.length - index - 1}
            onCallInitiate={(callType) =>
              handleInitiateCall(callType, chat.chatRoomId)
            }
            onMaximize={() => {
              handleCloseChat(chat.id);
              router.push("/chat");
            }}
            onMinimize={() => handleMinimizeChat(chat.id)}
            onRestore={() => handleRestoreChat(chat.id)}
            onClose={() => handleCloseChat(chat.id)}
          />
        ))}

      {location.pathname !== "/chat" &&
        activeChats
          .filter((chat) => chat.isMinimized)
          .map((chat, index) => (
            <div
              key={`minimized-${chat.id}`}
              className="fixed cursor-pointer group"
              style={{
                zIndex: 9999,
                bottom: `${getMinimizedChatPosition(index)}px`,
                right: 24,
              }}
              onClick={() => handleRestoreChat(chat.id)}
            >
              <div className="relative transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Avatar
                  label={chat.partnerName[0]}
                  image={chat.partnerAvatar}
                  shape="circle"
                  size="large"
                  className="bg-blue-500 text-white font-bold border-3 border-white dark:border-gray-800 relative"
                  style={{
                    width: "52px",
                    height: "52px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {chat.partnerName}
                  <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          ))}

      {location.pathname !== "/chat" && (
        <Button
          icon="pi pi-comments"
          className="p-button-rounded shadow-lg"
          onClick={handleOpenChat}
          style={{
            position: "fixed",
            bottom: `${position}px`,
            right: "25px",
            width: "52px",
            height: "52px",
            background: "linear-gradient(135deg, #007bff, #00c6ff)",
            border: "none",
            zIndex: 9999,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(0, 123, 255, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(0, 123, 255, 0.3)";
          }}
        />
      )}

      <Dialog
        header="Bắt đầu chat với đồng nghiệp"
        visible={showEmployeeModal}
        onHide={() => setShowEmployeeModal(false)}
        style={{ width: "420px" }}
        modal
        blockScroll={false}
        appendTo={document.body}
        baseZIndex={10000}
      >
        <div className="flex flex-col gap-1.5 mt-2 max-h-[380px] overflow-y-auto custom-scroll">
          {isLoadingEmployees ? (
            <div className="p-8 text-center">
              <ProgressSpinner style={{ width: "30px" }} />
            </div>
          ) : (
            employeeData?.map((emp: any) => {
              const dept = emp.department || emp.__department__;
              const account = emp.user || emp.__user__;

              if (account?.id === currentUserId) return null;

              return (
                <div
                  key={emp.id}
                  className="p-2.5 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-[#252525] cursor-pointer rounded-lg border dark:border-gray-800 transition-all"
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                    <Avatar
                      label={emp.fullName?.[0]}
                      image={emp.avatar}
                      shape="circle"
                      className="bg-orange-100 text-orange-600 font-bold shrink-0"
                      style={{ width: "36px", height: "36px" }}
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="font-semibold dark:text-gray-100 text-sm truncate">
                        {emp.fullName}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {emp.code} • {dept?.name || "N/A"}
                      </div>
                    </div>
                  </div>
                  <i className="pi pi-comment text-blue-500 shrink-0 ml-2"></i>
                </div>
              );
            })
          )}
        </div>
      </Dialog>

      <HRMChatbot />
      <BackToTop />
    </div>
  );
}

export default function AppLayout() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleAutoLogout = async () => {
    showToast({
      type: "warn",
      title: t("settings.auto_logout_title") || "Tự động đăng xuất",
      message:
        t("settings.auto_logout_message") ||
        "Bạn đã bị đăng xuất do không hoạt động",
      timeout: 3000,
    });

    await logout();
  };

  return (
    <ConfigProvider onAutoLogout={handleAutoLogout}>
      <AppLayoutContent />
    </ConfigProvider>
  );
}
