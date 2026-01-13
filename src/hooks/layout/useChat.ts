import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useChatRooms = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CHAT.ROOM_PAGINATION],
    queryFn: () => rootApiService.post(API_ENDPOINTS.CHAT.ROOM_PAGINATION, {}),
    select: (res: any) => {
      const rooms = (res?.data || []).slice();
      rooms.sort((a: any, b: any) => {
        const tA = a.lastMessageTime
          ? new Date(a.lastMessageTime).getTime()
          : 0;
        const tB = b.lastMessageTime
          ? new Date(b.lastMessageTime).getTime()
          : 0;
        return tB - tA;
      });
      return rooms;
    },
  });

  useEffect(() => {
    if (!socket) return;
    const handleInvalidate = () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHAT.ROOM_PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHAT.UNREAD_COUNT],
      });
    };
    socket.on("message:new", handleInvalidate);
    socket.on("message:read", handleInvalidate);
    return () => {
      socket.off("message:new", handleInvalidate);
      socket.off("message:read", handleInvalidate);
    };
  }, [socket, queryClient]);

  return { data: data || [], isLoading, refetch };
};

export const useChatMessages = (roomId: string | null) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CHAT.MESSAGES, roomId],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.CHAT.MESSAGES, { roomId, limit: 50 }),
    enabled: !!roomId,
    select: (res: any) => (res?.data || []).reverse(),
  });
  return { data: data || [], isLoading, refetch };
};

export const useCreateDirectChat = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onCreateDirectChat, isPending } = useMutation({
    mutationFn: (recipientId: string) =>
      rootApiService.post(API_ENDPOINTS.CHAT.CREATE_DIRECT, { recipientId }),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHAT.ROOM_PAGINATION],
      });
      showToast({ type: "success", title: "Thành công", message: res.message });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể tạo phòng",
      });
    },
  });
  return { onCreateDirectChat, isLoading: isPending };
};

export const useEditMessage = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (body: { messageId: string; content: string }) =>
      rootApiService.post(API_ENDPOINTS.CHAT.EDIT_MESSAGE, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHAT.MESSAGES],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Đã sửa tin nhắn",
      });
    },
  });
};

export const useUnreadMessageCount = () => {
  const { socket } = useSocket();
  const [count, setCount] = useState(0);

  const { data, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CHAT.UNREAD_COUNT],
    queryFn: async () => {
      const res: any = await rootApiService.get(
        API_ENDPOINTS.CHAT.UNREAD_COUNT
      );
      return res?.data || 0;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (data !== undefined) {
      setCount(data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message:new", () => {
      refetch();
    });
    socket.on("message:read", () => {
      refetch();
    });

    return () => {
      socket.off("message:new");
      socket.off("message:read");
    };
  }, [socket, refetch]);

  return { count, refetch };
};

export const useUserOnlineStatus = (userId: string | null) => {
  const { socket } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);

  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("user:status:check", { userId }, (response: any) => {
      if (response?.isOnline !== undefined) {
        setIsOnline(response.isOnline);
        if (response?.lastActive) {
          setLastActive(new Date(response.lastActive));
        } else {
          setLastActive(null);
        }
      }
    });

    socket.on(
      "user:status:changed",
      ({ userId: changedUserId, isOnline: status, lastActive }) => {
        if (changedUserId === userId) {
          setIsOnline(status);
          if (lastActive) {
            setLastActive(new Date(lastActive));
          } else {
            setLastActive(null);
          }
        }
      }
    );

    return () => {
      socket.off("user:status:changed");
    };
  }, [socket, userId]);

  return { isOnline, lastActive };
};

export const useMarkRoomRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) =>
      rootApiService.post(API_ENDPOINTS.CHAT.MARK_ROOM_READ, { roomId }),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHAT.UNREAD_COUNT],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHAT.ROOM_PAGINATION],
      });
      if (roomId) {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CHAT.MESSAGES, roomId],
        });
      }
    },
  });
};
