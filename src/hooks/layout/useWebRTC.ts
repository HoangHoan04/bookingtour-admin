import { useSocket } from "@/context/SocketContext";
import { useCallback, useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";

export const useWebRTC = (callData: {
  callLogId: string;
  recipientId: string;
  isInitiator: boolean;
  callType: string;
}) => {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef<SimplePeer.Instance | null>(null);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  }, [localStream]);

  const endCall = useCallback(() => {
    if (peerRef.current) peerRef.current.destroy();
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    socket?.emit("call:end", { callLogId: callData.callLogId });
  }, [localStream, socket, callData.callLogId]);

  useEffect(() => {
    if (!socket) return;

    navigator.mediaDevices
      .getUserMedia({
        video: callData.callType === "VIDEO",
        audio: true,
      })
      .then((stream) => {
        setLocalStream(stream);

        const peer = new SimplePeer({
          initiator: callData.isInitiator,
          trickle: true,
          stream: stream,
        });

        peer.on("signal", (data) => {
          if (data.type === "offer") {
            socket.emit("webrtc:offer", {
              recipientId: callData.recipientId,
              callLogId: callData.callLogId,
              offer: data,
            });
          } else if (data.type === "answer") {
            socket.emit("webrtc:answer", {
              recipientId: callData.recipientId,
              callLogId: callData.callLogId,
              answer: data,
            });
          } else if ((data as any).candidate) {
            socket.emit("webrtc:ice-candidate", {
              recipientId: callData.recipientId,
              callLogId: callData.callLogId,
              candidate: data,
            });
          }
        });

        peer.on("stream", (remote) => {
          setRemoteStream(remote);
          setIsConnected(true);
        });

        peer.on("error", (err) => console.error("Peer Error:", err));
        peerRef.current = peer;
      })
      .catch((err) => {
        console.error("Media Error:", err);
      });
    const handleOffer = ({ offer }: { offer: any }) => {
      peerRef.current?.signal(offer);
    };

    const handleAnswer = ({ answer }: { answer: any }) => {
      peerRef.current?.signal(answer);
    };

    const handleIceCandidate = ({ candidate }: { candidate: any }) => {
      peerRef.current?.signal(candidate);
    };

    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);

    return () => {
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
    };
  }, [
    socket,
    callData.callLogId,
    callData.callType,
    callData.isInitiator,
    callData.recipientId,
  ]);

  return {
    localStream,
    remoteStream,
    isConnected,
    toggleAudio,
    toggleVideo,
    endCall,
  };
};
