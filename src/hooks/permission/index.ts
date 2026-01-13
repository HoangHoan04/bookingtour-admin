import { useToast } from "@/context/ToastContext";
import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  PermissionDto,
  PermissionFilterDto,
  UpdatePermissionDto,
} from "@/dto/permission.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface PermissionItem {
  id: string;
  name: string;
  code: string;
  module: string;
}

export interface PermissionGroup {
  module: string;
  items: PermissionItem[];
}

export const usePaginationPermission = (
  params: PaginationDto<PermissionFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<PermissionDto>
  >({
    queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useFindAllPermissionGroups = () => {
  const { data, isLoading, error } = useQuery<
    SuccessResponse<PermissionGroup[]>
  >({
    queryKey: [API_ENDPOINTS.PERMISSION.FIND_ALL_GROUPED],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.FIND_ALL_GROUPED),
  });

  return {
    data: data?.data || [],
    isLoading,
    error,
  };
};

export const useCreatePermission = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onCreatePermission, isPending } = useMutation({
    mutationFn: (body: any) =>
      rootApiService.post(
        API_ENDPOINTS.PERMISSION.CREATE,
        body
      ) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.FIND_ALL_GROUPED],
      });
      showToast({
        type: "success",
        message: res.message,
        title: "Thành công",
      });
      router.back();
    },
    onError: (err: any) => {
      showToast({ type: "error", message: err?.message, title: "Lỗi" });
    },
  });
  return { onCreatePermission, isLoading: isPending };
};

export const useUpdatePermission = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onUpdate, isPending } = useMutation({
    mutationFn: (body: UpdatePermissionDto) =>
      rootApiService.post(
        API_ENDPOINTS.PERMISSION.UPDATE,
        body
      ) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      showToast({ type: "success", message: res.message, title: "Thành công" });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message, title: "Lỗi" });
    },
  });

  return { onUpdate, isPending };
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDelete, isPending } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.DELETE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      showToast({ type: "success", message: res.message, title: "Thành công" });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message, title: "Lỗi" });
    },
  });

  return { onDelete, isPending };
};
