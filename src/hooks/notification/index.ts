import { useToast } from "@/context/ToastContext";
import type { PageResponse, SuccessResponse } from "@/dto";
import type {
  NotificationItem,
  NotificationPaginationDto,
} from "@/dto/notification.dto";

import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationNotification = (
  params: NotificationPaginationDto
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<NotificationItem>
  >({
    queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.PAGINATION, params),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useUnreadCount = () => {
  const { data, isLoading, refetch } = useQuery<{ countAll: number }>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD),
    refetchInterval: 60000,
  });

  return {
    count: data?.countAll || 0,
    isLoading,
    refetch,
  };
};

export const useMarkReadList = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onMarkReadList, isPending } = useMutation({
    mutationFn: (ids: string[]) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.MARK_READ_LIST, {
        lstId: ids,
      }) as Promise<SuccessResponse>,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onMarkReadList, isLoading: isPending };
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onMarkAllRead, isPending } = useMutation({
    mutationFn: () =>
      rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ
      ) as Promise<SuccessResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
      });

      showToast({
        type: "success",
        message: res.message || "Đã đánh dấu tất cả là đã đọc",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onMarkAllRead, isLoading: isPending };
};
