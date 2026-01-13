import { formatDateTime } from "@/common/helpers/format";
import { useFloatingButton } from "@/context/FloatingButtonContext";
import { useTheme } from "@/context/ThemeContext";
import {
  useChatbotStream,
  useChatHistory,
  useClearAllChatHistory,
  useDeleteChatHistoryItem,
} from "@/hooks/layout/useChatBot";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useRef, useState } from "react";

const HRMChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isFocused, setIsFocused] = useState(false);
  const { position } = useFloatingButton("hrm-chatbot", 2);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, onSendMessage, isTyping } = useChatbotStream();

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: fetchHistory,
  } = useChatHistory({
    skip: 0,
    take: 0,
    where: {},
  });

  const { onDeleteItem } = useDeleteChatHistoryItem();
  const { onClearAll } = useClearAllChatHistory(setMessages);

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const onSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userQ = inputValue;
    setInputValue("");
    setMessages((prev: any) => [
      ...prev,
      { type: "user", content: userQ, id: Date.now() },
    ]);
    onSendMessage(userQ);
  };
  const renderContent = (msg: any) => (
    <div
      key={msg.id}
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        flexDirection: msg.type === "user" ? "row-reverse" : "row",
      }}
    >
      <Avatar
        icon={msg.type === "user" ? "pi pi-user" : "pi pi-sparkles"}
        style={{
          background:
            msg.type === "user"
              ? isDark
                ? "#3b3b3b"
                : "#cfe2ff"
              : "linear-gradient(135deg, #4285f4, #9b72cb)",
          color: msg.type === "user" ? "#1967d2" : "#fff",
          flexShrink: 0,
        }}
        shape="circle"
      />
      <div
        className={`
          ${msg.type === "user" ? "msg-user" : "msg-bot"}
          max-w-[85%] leading-relaxed text-[0.95rem] p-3 rounded-2xl
          ${
            msg.type === "user"
              ? isDark
                ? "bg-[#3b3b3b] text-blue-300"
                : "bg-[#cfe2ff] text-[#1967d2] rounded-tr-none"
              : isDark
              ? "bg-[#2d2d2d] text-gray-200"
              : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
          }
        `}
      >
        {msg.content.split("\n").map((line: string, i: number) => (
          <p key={i} className="m-0 mb-2 last:mb-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {!isOpen && (
        <Button
          icon="pi pi-sparkles"
          className="p-button-rounded"
          onClick={() => setIsOpen(true)}
          style={{
            bottom: `${position}px`,
            position: "fixed",
            right: "25px",
            width: "55px",
            height: "55px",
            background: "linear-gradient(135deg, #4285f4, #9b72cb)",
            border: "none",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
      <Dialog
        visible={isOpen}
        onHide={() => {
          setIsOpen(false);
          setIsMaximized(false);
        }}
        maximized={isMaximized}
        modal={isMaximized}
        position="bottom-right"
        showHeader={false}
        style={{
          width: isMaximized ? "80vw" : "400px",
          height: isMaximized ? "85vh" : "550px",
          margin: isMaximized ? "0" : "0 20px 20px 0",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          border: "1px solid #eef0f2",
        }}
        contentStyle={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f3f4",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="pi pi-sparkles" style={{ color: "#4285f4" }}></i>
            <span style={{ fontWeight: 600 }}>AI HR Assistant</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <Button
              icon="pi pi-history"
              className="p-button-text p-button-plain p-button-sm"
              onClick={() => {
                setShowHistory(true);
                fetchHistory();
              }}
            />
            <Button
              icon={
                isMaximized ? "pi pi-window-minimize" : "pi pi-window-maximize"
              }
              className="p-button-text p-button-plain p-button-sm"
              onClick={() => setIsMaximized(!isMaximized)}
            />
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-plain p-button-sm"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="custom-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMaximized ? "30px 15%" : "20px",
          }}
        >
          {messages.length === 0 && (
            <div
              className="flex flex-col items-center justify-center"
              style={{
                marginTop: isMaximized ? "10%" : "15%",
                animation: "fadeIn 0.8s ease-out",
              }}
            >
              <div className="relative mb-4">
                <div
                  style={{
                    position: "absolute",
                    inset: -10,
                    background:
                      "radial-gradient(circle, rgba(66, 133, 244, 0.2) 0%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(10px)",
                  }}
                ></div>
                <i
                  className="pi pi-sparkles"
                  style={{
                    fontSize: "3.5rem",
                    background: "linear-gradient(135deg, #4285f4, #9b72cb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                ></i>
              </div>
              <h2
                style={{
                  fontSize: isMaximized ? "2rem" : "1.4rem",
                  fontWeight: 700,
                  marginBottom: "8px",
                  textAlign: "center",
                  background: isDark ? "white" : "#333",
                  WebkitBackgroundClip: "text",
                }}
              >
                Xin chào, tôi là{" "}
                <span style={{ color: "#4285f4" }}>HR Assistant</span>
              </h2>
              <p
                style={{
                  textAlign: "center",
                  color: isDark ? "#aaa" : "#666",
                  maxWidth: "80%",
                  lineHeight: "1.5",
                  fontSize: "1rem",
                }}
              >
                Tôi đã sẵn sàng để tối ưu hóa quy trình nhân sự và giải đáp mọi
                thắc mắc của bạn. Bạn muốn bắt đầu từ đâu?
              </p>

              <div
                className="flex flex-wrap justify-center gap-2 mt-4"
                style={{ maxWidth: "500px" }}
              >
                {[
                  { label: "Tra cứu bảng lương", icon: "pi pi-money-bill" },
                  { label: "Chế độ phúc lợi 2024", icon: "pi pi-heart" },
                  { label: "Quy định nghỉ phép", icon: "pi pi-calendar" },
                  { label: "Hướng dẫn tuyển dụng", icon: "pi pi-users" },
                ].map((action, index) => (
                  <div
                    key={index}
                    onClick={() => setInputValue(action.label)}
                    className="quick-action-item"
                    style={{
                      padding: "10px 16px",
                      borderRadius: "12px",
                      border: isDark ? "1px solid #444" : "1px solid #e0e0e0",
                      background: isDark ? "#2d2d2d" : "white",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className={action.icon}
                      style={{ color: "#4285f4", fontSize: "0.8rem" }}
                    ></i>
                    {action.label}
                  </div>
                ))}
              </div>
            </div>
          )}
          {messages.map(renderContent)}
          {isTyping && (
            <div style={{ display: "flex", gap: "15px" }}>
              <Avatar
                icon="pi pi-sparkles"
                style={{
                  background: "linear-gradient(135deg, #4285f4, #9b72cb)",
                }}
                shape="circle"
              />
              <ProgressSpinner
                style={{ width: "25px", height: "25px" }}
                strokeWidth="5"
              />
            </div>
          )}
        </div>

        <div
          style={{
            padding: isMaximized
              ? isFocused
                ? "20px 15% 30px"
                : "10px 15% 20px"
              : "10px 15px",
            background: isDark ? "#1e1e1e" : "#fff",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: isDark ? "#2b2b2b" : "#f0f4f9",
              borderRadius: isFocused ? "24px" : "32px",
              padding: isFocused ? "8px 12px" : "4px 12px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: isFocused
                ? isDark
                  ? "1px solid #5f9ea0"
                  : "1px solid #4285f4"
                : "1px solid transparent",
              boxShadow: isFocused ? "0 1px 6px rgba(32,33,36,0.1)" : "none",
            }}
          >
            <InputTextarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), onSend())
              }
              autoResize
              rows={1}
              placeholder="Hỏi AI HR..."
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                boxShadow: "none",
                padding: isFocused ? "10px 12px" : "8px 12px",
                fontSize: "1rem",
                color: isDark ? "#e3e3e3" : "#1f1f1f",
                maxHeight: "200px",
                minHeight: isFocused ? "45px" : "35px",
                transition: "all 0.3s ease",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isFocused ? "4px 8px" : "2px 8px",
                opacity: isFocused ? 1 : 0.8,
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-text"
                  onClick={handleNewChat}
                  style={{
                    color: isDark ? "#c4c7c5" : "#444746",
                    width: isFocused ? "36px" : "30px",
                    height: isFocused ? "36px" : "30px",
                  }}
                />
                <Button
                  icon="pi pi-image"
                  className="p-button-rounded p-button-text"
                  disabled
                  style={{
                    color: isDark ? "#c4c7c5" : "#444746",
                    width: isFocused ? "36px" : "30px",
                    height: isFocused ? "36px" : "30px",
                  }}
                />
              </div>
              <Button
                icon="pi pi-send"
                disabled={!inputValue.trim() || isTyping}
                onClick={onSend}
                style={{
                  background: "transparent",
                  border: "none",
                  color:
                    !inputValue.trim() || isTyping
                      ? isDark
                        ? "#555"
                        : "#ccc"
                      : "#4285f4",
                  width: "36px",
                  height: "36px",
                  fontSize: isFocused ? "1.2rem" : "1rem",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
          </div>
          {isFocused && (
            <p
              style={{
                fontSize: "0.65rem",
                textAlign: "center",
                marginTop: "8px",
                color: "#888",
                animation: "fadeIn 0.5s ease",
              }}
            >
              Kiểm tra thông tin quan trọng trước khi sử dụng.
            </p>
          )}
        </div>
      </Dialog>

      <Sidebar
        visible={showHistory}
        position="right"
        onHide={() => setShowHistory(false)}
        style={{ width: "400px", background: isDark ? "#1e1e1e" : "#ffffff" }}
        header={
          <div className="flex items-center gap-2">
            <i
              className="pi pi-history"
              style={{ fontSize: "1.2rem", color: "#4285f4" }}
            ></i>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: "1.25rem" }}>
              Lịch sử trò chuyện
            </h3>
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <div className="custom-scroll grow overflow-y-auto pr-2.5">
            {isLoadingHistory ? (
              <div className="flex justify-center p-5">
                <ProgressSpinner style={{ width: "30px", height: "30px" }} />
              </div>
            ) : !historyData || historyData.length === 0 ? (
              <div className="text-center mt-5 opacity-60">
                <i
                  className="pi pi-inbox mb-2"
                  style={{ fontSize: "2rem" }}
                ></i>
                <p>Chưa có lịch sử hội thoại</p>
              </div>
            ) : (
              historyData.map((item: any) => (
                <div
                  key={item.id}
                  className="history-item p-3 mb-3"
                  style={{
                    borderRadius: "12px",
                    border: isDark ? "1px solid #333" : "1px solid #eef0f2",
                    background: isDark ? "#2d2d2d" : "#f9fafb",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#888",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <i
                        className="pi pi-clock"
                        style={{ fontSize: "0.7rem" }}
                      ></i>
                      {formatDateTime(item.createdAt)}
                    </span>
                    <Button
                      icon="pi pi-trash"
                      className="rounded-2xl"
                      style={{
                        height: 30,
                        fontSize: 13,
                        padding: "8px 16px",
                        border: `1px solid red`,
                        color: "red",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                    />
                  </div>
                  <div
                    className="mb-2"
                    style={{ fontWeight: 600, fontSize: "0.9rem" }}
                  >
                    <span style={{ color: "#4285f4" }}>Q:</span> {item.question}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: isDark ? "#bbb" : "#666",
                      lineHeight: "1.4",
                      borderLeft: "2px solid #ddd",
                      paddingLeft: "10px",
                      marginTop: "8px",
                    }}
                  >
                    {item.answer?.replace(/\*\*/g, "")}
                  </div>
                </div>
              ))
            )}
          </div>
          <Button
            label="Xóa tất cả lịch sử"
            icon="pi pi-trash"
            className="p-button-outlined  w-full mb-4"
            style={{
              height: 30,
              fontSize: 13,
              border: `1px solid red`,
              color: "red",
              backgroundColor: "transparent",
              boxShadow: "none",
              marginBottom: 5,
              padding: "30px 20px",
            }}
            onClick={() => onClearAll()}
          />
        </div>
      </Sidebar>
    </>
  );
};

export default HRMChatbot;
