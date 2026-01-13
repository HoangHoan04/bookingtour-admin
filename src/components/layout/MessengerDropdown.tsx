import { formatTimeAgo } from "@/common/helpers/format";
import { useChatRooms, useMarkRoomRead } from "@/hooks/layout/useChat";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { type FC, useRef } from "react";

interface MessengerDropdownProps {
  unreadCount: number;
  currentUserId: string;
  onChatSelect?: (roomId: string) => void;
}

const MessengerDropdown: FC<MessengerDropdownProps> = ({
  unreadCount,
  currentUserId,
  onChatSelect,
}) => {
  const op = useRef<OverlayPanel>(null);
  const router = useRouter();
  const { data: rooms, isLoading, refetch } = useChatRooms();
  const { mutate: markRoomRead } = useMarkRoomRead();

  const handleChatClick = (roomId: string) => {
    op.current?.hide();
    markRoomRead(roomId, {
      onSuccess: () => {
        refetch();
        if (onChatSelect) {
          onChatSelect(roomId);
        }
      },
    });
  };

  const handleViewAll = () => {
    op.current?.hide();
    router.push("/other/chat");
  };

  const [roomDetails, setRoomDetails] = React.useState<
    Record<string, { name: string; avatar?: string }>
  >({});
  React.useEffect(() => {
    const fetchDetails = async () => {
      if (!rooms) return;
      const promises = rooms.map(async (room: any) => {
        if (!room.id) return;
        try {
          const res: any = await rootApiService.post(
            API_ENDPOINTS.CHAT.ROOM_DETAIL,
            { roomId: room.id }
          );
          if (res && typeof res === "object" && res.data) {
            const recipient = res.data?.members?.find(
              (m: any) => m.userId !== currentUserId
            );
            const recipientEmployee = recipient?.user?.employee;
            setRoomDetails((prev) => ({
              ...prev,
              [room.id]: {
                name:
                  recipientEmployee?.fullName || res.data?.name || "Người dùng",
                avatar: recipientEmployee?.avatar,
              },
            }));
          } else {
            setRoomDetails((prev) => ({
              ...prev,
              [room.id]: { name: room.name || "Người dùng", avatar: undefined },
            }));
          }
        } catch {
          setRoomDetails((prev) => ({
            ...prev,
            [room.id]: { name: room.name || "Người dùng", avatar: undefined },
          }));
        }
      });
      await Promise.all(promises);
    };
    fetchDetails();
  }, [rooms, currentUserId]);

  const getRecipientInfo = (room: any) => {
    if (roomDetails[room.id]) return roomDetails[room.id];
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

  return (
    <>
      <div className="relative inline-block">
        <Button
          icon="pi pi-comment"
          rounded
          text
          onClick={(e) => {
            refetch();
            op.current?.toggle(e);
          }}
          tooltip="Tin nhắn"
          tooltipOptions={{ position: "bottom" }}
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? "99+" : unreadCount}
            severity="danger"
            className="absolute top-0 right-0 pointer-events-none origin-center scale-75"
          />
        )}
      </div>

      <OverlayPanel ref={op} className="w-96 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-3 border-b">
            <h3 className="text-lg font-semibold m-0">Tin nhắn</h3>
            <div className="flex gap-1">
              <Button
                icon={`pi ${isLoading ? "pi-spin pi-spinner" : "pi-refresh"}`}
                rounded
                text
                severity="secondary"
                size="small"
                onClick={() => refetch()}
                tooltip="Làm mới"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <ProgressSpinner style={{ width: "30px", height: "30px" }} />
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <i className="pi pi-comments text-4xl mb-3 opacity-30" />
                <p className="m-0 text-sm">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              rooms.map((room: any) => {
                const recipientInfo = getRecipientInfo(room);
                const hasUnread = room.unreadCount > 0;
                const lastMessage =
                  room.lastMessage || "Nhấn để xem chi tiết...";
                const lastMessageTime = room.lastMessageTime
                  ? formatTimeAgo(room.lastMessageTime)
                  : "";

                return (
                  <div
                    key={room.id}
                    onClick={() => handleChatClick(room.id)}
                    className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all group hover:bg-blue-50 dark:hover:bg-gray-800 ${
                      hasUnread ? "bg-blue-50/50 dark:bg-gray-800/50" : ""
                    }`}
                  >
                    <div className="shrink-0 relative">
                      <Avatar
                        label={recipientInfo.name[0]}
                        image={recipientInfo.avatar}
                        shape="circle"
                        size="large"
                        className="bg-blue-500 text-white font-bold"
                      />
                      {hasUnread && (
                        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={`font-semibold text-sm m-0 truncate ${
                            hasUnread
                              ? "text-blue-700 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {recipientInfo.name}
                        </h4>
                        {lastMessageTime && (
                          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                            {lastMessageTime}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm m-0 truncate flex-1 ${
                            hasUnread
                              ? "font-semibold text-gray-900 dark:text-gray-100"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {lastMessage}
                        </p>
                        {hasUnread && (
                          <Badge
                            value={
                              room.unreadCount > 9 ? "9+" : room.unreadCount
                            }
                            severity="info"
                            className="shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 mt-3 border-t">
            <Button
              label="Xem tất cả tin nhắn"
              className="w-full"
              text
              onClick={handleViewAll}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

export default MessengerDropdown;
