import { ChatWindow } from "@/components/ui/chat/ChatWindow";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useRef, useState } from "react";

interface ChatPopupProps {
  chatRoomId: string;
  currentUserId: string;
  partnerName: string;
  partnerAvatar?: string;
  isMinimized?: boolean;
  stackIndex?: number;
  onCallInitiate: (callType: "AUDIO" | "VIDEO") => void;
  onMaximize: () => void;
  onMinimize: () => void;
  onRestore: () => void;
  onClose: () => void;
}

export const ChatPopup: React.FC<ChatPopupProps> = ({
  chatRoomId,
  currentUserId,
  partnerName,
  partnerAvatar,
  isMinimized = false,
  stackIndex = 0,
  onCallInitiate,
  onMaximize,
  onMinimize,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const menuRef = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: "Mở toàn màn hình",
      icon: "pi pi-window-maximize",
      command: () => onMaximize(),
    },
    {
      label: "Thu nhỏ",
      icon: "pi pi-window-minimize",
      command: () => onMinimize(),
    },
    {
      separator: true,
    },
    {
      label: "Đóng chat",
      icon: "pi pi-times",
      command: () => onClose(),
    },
  ];

  if (isMinimized) {
    return null;
  }

  const rightPosition = 110 + stackIndex * 360;

  return (
    <div
      className="fixed shadow-2xl rounded-xl flex flex-col bg-white dark:bg-[#1e1e1e] border dark:border-gray-700"
      style={{
        bottom: "20px",
        right: `${rightPosition}px`,
        width: "340px",
        height: isExpanded ? "500px" : "56px",
        zIndex: 9000 + stackIndex,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow:
          "0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        overflow: isExpanded ? "hidden" : "visible",
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white">
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer hover:opacity-90 transition-opacity min-w-0"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          <Avatar
            label={partnerName[0]}
            image={partnerAvatar}
            shape="circle"
            size="normal"
            className="bg-white text-blue-500 font-bold shrink-0"
            style={{ width: "32px", height: "32px" }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{partnerName}</div>
            <span className="text-xs opacity-90">Đang hoạt động</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            icon="pi pi-phone"
            className="p-button-text p-button-rounded"
            style={{
              color: "white",
              width: "28px",
              height: "28px",
              padding: 0,
            }}
            onClick={() => onCallInitiate("AUDIO")}
            tooltip="Gọi thoại"
            tooltipOptions={{ position: "bottom" }}
            text
          />
          <Button
            icon="pi pi-video"
            className="p-button-text p-button-rounded"
            style={{
              color: "white",
              width: "28px",
              height: "28px",
              padding: 0,
            }}
            onClick={() => onCallInitiate("VIDEO")}
            tooltip="Gọi video"
            tooltipOptions={{ position: "bottom" }}
            text
          />
          <Button
            icon={isExpanded ? "pi pi-minus" : "pi pi-plus"}
            className="p-button-text p-button-rounded"
            style={{
              color: "white",
              width: "28px",
              height: "28px",
              padding: 0,
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            tooltip={isExpanded ? "Thu gọn" : "Mở rộng"}
            tooltipOptions={{ position: "bottom" }}
            text
          />
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-text p-button-rounded"
            style={{
              color: "white",
              width: "28px",
              height: "28px",
              padding: 0,
            }}
            onClick={(e) => {
              e.stopPropagation();
              menuRef.current?.toggle(e);
            }}
            tooltip="Tùy chọn"
            tooltipOptions={{ position: "right" }}
            text
          />
        </div>
      </div>
      <Menu
        model={menuItems}
        popup
        ref={menuRef}
        appendTo={document.body}
        autoZIndex
        baseZIndex={99999}
      />

      {isExpanded && (
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            chatRoomId={chatRoomId}
            currentUserId={currentUserId}
            onCallInitiate={onCallInitiate}
            isPopupMode={true}
          />
        </div>
      )}
    </div>
  );
};
