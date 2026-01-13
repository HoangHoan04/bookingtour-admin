import { useSocket } from "@/context/SocketContext";
import { useUserOnlineStatus } from "@/hooks/layout/useChat";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  chatRoomId: string;
  currentUserId: string;
  onCallInitiate: (callType: "AUDIO" | "VIDEO") => void;
  isPopupMode?: boolean;
  onClose?: () => void;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    isAdmin?: boolean;
    employee?: {
      fullName: string;
      avatar?: string;
    };
  };
  createdAt: string;
  messageType: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatRoomId,
  currentUserId,
  onCallInitiate,
  isPopupMode = false,
  onClose,
}) => {
  const { socket } = useSocket();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerName, setPartnerName] = useState("Đang tải...");
  const [partnerAvatar, setPartnerAvatar] = useState<string | undefined>();
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isOnline: partnerOnline, lastActive: partnerLastActive } =
    useUserOnlineStatus(partnerId);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const msgRes: any = await rootApiService.post(
        API_ENDPOINTS.CHAT.MESSAGES,
        {
          roomId: chatRoomId,
          limit: 50,
        }
      );
      setMessages(msgRes.data?.reverse() || []);
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  }, [chatRoomId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchMessages();
      try {
        const roomRes: any = await rootApiService.post(
          API_ENDPOINTS.CHAT.ROOM_DETAIL,
          {
            roomId: chatRoomId,
          }
        );
        const recipient = roomRes.data?.members?.find(
          (m: any) => m.userId !== currentUserId
        );
        const recipientEmployee = recipient?.user?.employee;
        const displayName =
          recipientEmployee?.fullName || roomRes.data?.name || "Hội thoại";
        setPartnerName(displayName);
        setPartnerAvatar(recipientEmployee?.avatar);
        setPartnerId(recipient?.userId || null);
      } catch (error) {
        setPartnerName("Hội thoại");
      }
    };
    if (chatRoomId) {
      fetchInitialData();
    }
  }, [chatRoomId, currentUserId, fetchMessages]);

  useEffect(() => {
    if (!socket || !chatRoomId) return;
    const handleNewMessage = (payload: any) => {
      if (payload.message?.chatRoomId === chatRoomId) {
        fetchMessages();
      }
    };
    const handleReadMessage = (payload: any) => {
      if (payload.roomId === chatRoomId) {
        fetchMessages();
      }
    };
    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleReadMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleReadMessage);
    };
  }, [socket, chatRoomId, fetchMessages]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(
      "user:typing",
      ({ userId, isTyping: typing, chatRoomId: targetId }) => {
        if (targetId === chatRoomId && userId !== currentUserId) {
          setIsTyping(typing);
        }
      }
    );
    return () => {
      socket.off("user:typing");
    };
  }, [socket, chatRoomId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const queryClient = useQueryClient();
  const handleSendMessage = () => {
    if (!inputText.trim() || !socket) {
      return;
    }
    socket.emit("message:send", {
      chatRoomId,
      content: inputText,
      messageType: "TEXT",
    });

    setInputText("");
    socket.emit("message:typing", { chatRoomId, isTyping: false });
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.CHAT.ROOM_PAGINATION],
    });
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.CHAT.UNREAD_COUNT],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!socket) return;

    socket.emit("message:typing", { chatRoomId, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("message:typing", { chatRoomId, isTyping: false });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1e1e1e]">
      {!isPopupMode && (
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Avatar
              label={partnerName[0]}
              image={partnerAvatar}
              shape="circle"
              className="bg-blue-500 text-white font-bold"
              style={{ width: "40px", height: "40px" }}
            />
            <div>
              <h3 className="font-bold  dark:text-white m-0">{partnerName}</h3>
              {partnerOnline ? (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Đang hoạt động
                </span>
              ) : partnerLastActive ? (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Hoạt động{" "}
                  {formatDistanceToNow(partnerLastActive, {
                    addSuffix: true,
                    locale: undefined,
                  })}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Ngoại tuyến
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              icon="pi pi-phone"
              className="p-button-text p-button-rounded p-button-plain dark:text-gray-300"
              onClick={() => onCallInitiate("AUDIO")}
              tooltip="Cuộc gọi thoại"
              text
              tooltipOptions={{ position: "bottom" }}
            />
            <Button
              icon="pi pi-video"
              className="p-button-text p-button-rounded p-button-plain dark:text-gray-300"
              onClick={() => onCallInitiate("VIDEO")}
              tooltip="Gọi Video"
              text
              tooltipOptions={{ position: "bottom" }}
            />
            {!isPopupMode && onClose && (
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-rounded p-button-plain dark:text-gray-300"
                onClick={onClose}
                tooltip="Đóng (chuyển sang popup)"
                text
                tooltipOptions={{ position: "left" }}
              />
            )}
            <Button
              icon="pi pi-info-circle"
              className="p-button-text p-button-rounded p-button-plain dark:text-gray-300"
              text
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4   custom-scroll">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
            <ProgressSpinner
              style={{ width: "30px", height: "30px" }}
              strokeWidth="4"
            />
            <p className="text-sm">Đang tải tin nhắn...</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMine = msg.senderId === currentUserId;
              let senderName = "Unknown";
              let senderAvatar = undefined;
              if (msg.sender?.isAdmin) {
                senderName = "Quản trị viên";
              } else if (msg.sender?.employee?.fullName) {
                senderName = msg.sender.employee.fullName;
              }
              if (msg.sender?.employee?.avatar) {
                senderAvatar = msg.sender.employee.avatar;
              }

              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-2 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMine && (
                    <Avatar
                      label={senderName[0]}
                      image={senderAvatar}
                      shape="circle"
                      size="normal"
                      className={`font-bold self-end ${
                        msg.sender?.isAdmin
                          ? "bg-red-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                      style={{ width: "28px", height: "28px", flexShrink: 0 }}
                    />
                  )}

                  <div
                    className={`flex flex-col ${
                      isMine ? "items-end" : "items-start"
                    } max-w-[65%]`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                        isMine
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : msg.sender?.isAdmin
                          ? "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-100 rounded-bl-sm border border-red-300 dark:border-red-700"
                          : "bg-gray-100 dark:bg-[#2d2d2d] text-gray-900 dark:text-gray-100 rounded-bl-sm"
                      }`}
                    >
                      {!isMine && (
                        <span className="text-xs font-semibold block mb-0.5 opacity-80">
                          {senderName}
                        </span>
                      )}
                      <span className="text-sm whitespace-pre-wrap wrap-break-word">
                        {msg.content}
                      </span>
                    </div>
                    <span className="text-[10px] mt-1 text-gray-400 px-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {isMine && <div style={{ width: "28px", flexShrink: 0 }} />}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <Avatar
                  label={partnerName[0]}
                  image={partnerAvatar}
                  shape="circle"
                  size="normal"
                  className="bg-gray-400 text-white font-bold self-end"
                  style={{ width: "28px", height: "28px", flexShrink: 0 }}
                />
                <div className="bg-gray-100 dark:bg-[#2d2d2d] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-[#1e1e1e] border-t dark:border-gray-700">
        <div className="flex items-end gap-2 bg-gray-100 dark:bg-[#2d2d2d] p-2 rounded-2xl transition-all border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-[#252525]">
          <Button
            icon="pi pi-plus-circle"
            className="p-button-text p-button-rounded p-button-plain shrink-0 dark:text-gray-400"
          />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none py-2 px-1 text-sm dark:text-white placeholder-gray-400"
            placeholder="Viết tin nhắn của bạn..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            icon="pi pi-send"
            disabled={!inputText.trim()}
            className={`p-button-rounded p-button-text shrink-0 ${
              inputText.trim() ? "text-blue-500" : "text-gray-300"
            }`}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};
