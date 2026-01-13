import { ChatPopup } from "@/components/ui/chat/ChatPopup";
import { ChatWindow } from "@/components/ui/chat/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import { usePaginationEmployee } from "@/hooks/employee";
import { useChatRooms, useCreateDirectChat } from "@/hooks/layout/useChat";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const ChatPage = () => {
  const { setActiveCall } = useOutletContext<{ setActiveCall: any }>();
  const { socket } = useSocket();
  useAuth();
  const { showToast } = useToast();
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
  const {
    data: rooms,
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  } = useChatRooms();
  const { onCreateDirectChat } = useCreateDirectChat();

  const { data: employeeData, isLoading: isLoadingEmployees } =
    usePaginationEmployee({
      take: 100,
      skip: 0,
      where: { isDeleted: false },
    });

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomSearchTerm, setRoomSearchTerm] = useState("");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [chatMode, setChatMode] = useState<"fullscreen" | "popup">("popup");
  useEffect(() => {
    if (!selectedRoomId && rooms && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  useEffect(() => {
    if (selectedRoomId) {
      refetchRooms();
    }
  }, [selectedRoomId, refetchRooms]);

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
        setSelectedRoomId(res.data.id);
        setShowEmployeeModal(false);
        refetchRooms();
      },
    });
  };

  const handleInitiateCall = async (callType: "AUDIO" | "VIDEO") => {
    if (!selectedRoomId || !socket) return;
    try {
      const res: any = await rootApiService.post(
        API_ENDPOINTS.CHAT.ROOM_DETAIL,
        { roomId: selectedRoomId }
      );
      const recipient = res.data.members.find(
        (m: any) => m.userId !== currentUserId
      );
      if (!recipient) return;

      socket.emit(
        "call:initiate",
        {
          chatRoomId: selectedRoomId,
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

  const getRecipientInfo = (room: any) => {
    if (room.type === "DIRECT") {
      const recipient = room.members?.find(
        (m: any) => m.userId !== currentUserId
      );

      const recipientEmployee = recipient?.user?.employee;
      const displayName =
        recipientEmployee?.fullName || room.name || "Người dùng";

      return {
        name: displayName,
        avatar: recipientEmployee?.avatar,
      };
    }
    return { name: room.name || "Nhóm chat", avatar: null };
  };

  const filteredRooms = rooms.filter((r: any) => {
    const info = getRecipientInfo(r);
    return info.name.toLowerCase().includes(roomSearchTerm.toLowerCase());
  });

  const getCurrentRoomInfo = () => {
    if (!selectedRoomId) return null;
    const room = rooms.find((r: any) => r.id === selectedRoomId);
    if (!room) return null;
    return getRecipientInfo(room);
  };

  const currentRoomInfo = getCurrentRoomInfo();

  return (
    <div className="flex h-full bg-white dark:bg-[#121212] overflow-hidden border-t dark:border-gray-800">
      {chatMode === "fullscreen" && (
        <div className="w-80 md:w-96 border-r dark:border-gray-800 flex flex-col bg-gray-50/20 dark:bg-[#181818]">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold dark:text-white m-0">
                Tin nhắn
              </h1>
              <Button
                icon="pi pi-user-plus"
                className="p-button-rounded p-button-info p-button-text"
                onClick={() => setShowEmployeeModal(true)}
              />
            </div>
            <span className="w-full">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search"></InputIcon>
                <InputText
                  value={roomSearchTerm}
                  onChange={(e) => setRoomSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  className="pl-10"
                  style={{
                    paddingLeft: "2.5rem",
                  }}
                />
              </IconField>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {isLoadingRooms ? (
              <div className="text-center p-5">
                <ProgressSpinner style={{ width: "30px" }} />
              </div>
            ) : (
              filteredRooms.map((room: any) => {
                const recipientInfo = getRecipientInfo(room);
                const hasUnread = room.unreadCount > 0;
                const lastMessage = room.lastMessage || "Nhấn để chat...";

                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                    }}
                    className={`p-3 mb-1 flex items-center gap-3 cursor-pointer rounded-xl transition-all relative ${
                      selectedRoomId === room.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                        : "hover:bg-gray-100 dark:hover:bg-[#252525]"
                    }`}
                  >
                    <div className="relative">
                      <Avatar
                        label={recipientInfo.name[0]}
                        image={recipientInfo.avatar}
                        shape="circle"
                        size="large"
                        className="bg-blue-500 text-white font-bold"
                      />
                      {hasUnread && (
                        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate dark:text-gray-200">
                        {recipientInfo.name}
                      </div>
                      <p
                        className={`text-sm truncate m-0 ${
                          hasUnread
                            ? "font-semibold text-gray-900 dark:text-gray-100"
                            : "text-gray-500"
                        }`}
                      >
                        {lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <div
        style={{
          display: chatMode === "fullscreen" ? "block" : "none",
          flex: 1,
        }}
      >
        {selectedRoomId ? (
          <ChatWindow
            chatRoomId={selectedRoomId}
            currentUserId={currentUserId}
            onCallInitiate={handleInitiateCall}
            onClose={() => setChatMode("popup")}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30">
            <i className="pi pi-comments text-[10rem] mb-4"></i>
            <h2 className="text-3xl font-bold">HRM CHAT</h2>
            <p>Chọn một nhân viên để bắt đầu trao đổi</p>
          </div>
        )}
      </div>
      {chatMode === "popup" && selectedRoomId && currentRoomInfo && (
        <ChatPopup
          chatRoomId={selectedRoomId}
          currentUserId={currentUserId}
          partnerName={currentRoomInfo.name}
          partnerAvatar={currentRoomInfo.avatar}
          onCallInitiate={handleInitiateCall}
          onMaximize={() => setChatMode("fullscreen")}
          onClose={() => {
            setSelectedRoomId(null);
            setChatMode("popup");
          }}
          onMinimize={function (): void {
            throw new Error("Function not implemented.");
          }}
          onRestore={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      {chatMode === "popup" && !selectedRoomId && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl transition-all"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
          onClick={() => setShowEmployeeModal(true)}
          title="Mở chat"
        >
          <i className="pi pi-comments"></i>
        </button>
      )}

      <Dialog
        header="Bắt đầu chat với đồng nghiệp"
        visible={showEmployeeModal}
        onHide={() => setShowEmployeeModal(false)}
        style={{ width: "450px" }}
        modal
      >
        <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-auto">
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
                  className="p-3 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-[#252525] cursor-pointer rounded-xl border dark:border-gray-800 transition-all mb-1"
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      label={emp.fullName?.[0]}
                      shape="circle"
                      className="bg-orange-100 text-orange-600 font-bold"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold dark:text-gray-100 text-sm truncate">
                        {emp.fullName}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {emp.code} • {dept?.name || "N/A"}
                      </div>
                    </div>
                  </div>
                  <i className="pi pi-comment text-blue-500"></i>
                </div>
              );
            })
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ChatPage;
