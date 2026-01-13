import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useChatbotStream = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const { mutate: onSendMessage, isPending: isTyping } = useMutation({
    mutationFn: (query: string) =>
      rootApiService.post(API_ENDPOINTS.CHATBOT.CHAT, {
        query,
      }) as Promise<any>,
    onSuccess: (data: any) => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: data.response, id: Date.now() },
      ]);
    },
  });

  return {
    messages,
    setMessages,
    onSendMessage,
    isTyping,
  };
};

export const useChatHistory = (params: PaginationDto<any>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<any>>({
    queryKey: [API_ENDPOINTS.CHATBOT.HISTORY_LIST, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.CHATBOT.HISTORY_LIST, params),
    enabled: !!params,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useSearchChatHistory = () => {
  const { mutateAsync: onSearch, isPending: isSearching } = useMutation({
    mutationFn: (searchTerm: string) =>
      rootApiService.post(API_ENDPOINTS.CHATBOT.HISTORY_SEARCH, { searchTerm }),
  });

  return {
    onSearch,
    isSearching,
  };
};

export const useDeleteChatHistoryItem = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.CHATBOT.HISTORY_DELETE_ITEM, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHATBOT.HISTORY_LIST],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa mục lịch sử thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi xóa",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onDeleteItem,
    isDeleting,
  };
};

export const useClearAllChatHistory = (setMessages?: (msgs: any[]) => void) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onClearAll, isPending: isClearing } = useMutation({
    mutationFn: () =>
      rootApiService.post(
        API_ENDPOINTS.CHATBOT.CLEAR_HISTORY
      ) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      if (setMessages) setMessages([]);
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CHATBOT.HISTORY_LIST],
      });
      showToast({
        type: "success",
        message: res.message || "Đã xóa sạch lịch sử chat",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Không thể xóa lịch sử",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onClearAll,
    isClearing,
  };
};
