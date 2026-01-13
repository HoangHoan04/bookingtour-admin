import { useWebRTC } from "@/hooks/layout/useWebRTC";
import React, { useEffect, useRef, useState } from "react";

interface VideoCallModalProps {
  callLogId: string;
  recipientId: string;
  isInitiator: boolean;
  callType: "AUDIO" | "VIDEO";
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  callLogId,
  recipientId,
  isInitiator,
  callType,
  onClose,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const {
    localStream,
    remoteStream,
    isConnected,
    toggleAudio,
    toggleVideo,
    endCall,
  } = useWebRTC({
    callLogId,
    recipientId,
    isInitiator,
    callType,
  });

  useEffect(() => {
    if (localVideoRef.current && localStream)
      localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  const handleToggleAudio = () => {
    toggleAudio();
    setIsMicOn(!isMicOn);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsCamOn(!isCamOn);
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {!isConnected && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#ffffff",
              fontSize: "24px",
            }}
          >
            {isInitiator ? "Đang gọi..." : "Đang kết nối..."}
          </div>
        )}

        {callType === "VIDEO" && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              width: "200px",
              height: "150px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              display: isCamOn ? "block" : "none",
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <button
          onClick={handleToggleAudio}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: isMicOn ? "#ffffff" : "#dc3545",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          {isMicOn ? "🎤" : "🔇"}
        </button>

        {callType === "VIDEO" && (
          <button
            onClick={handleToggleVideo}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: isCamOn ? "#ffffff" : "#dc3545",
              border: "none",
              cursor: "pointer",
              fontSize: "24px",
            }}
          >
            {isCamOn ? "📹" : "🚫"}
          </button>
        )}

        <button
          onClick={handleEndCall}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#dc3545",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
};
