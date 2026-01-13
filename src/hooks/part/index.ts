import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreatePartDto,
  PartDto,
  PartFilterDto,
  UpdatePartDto,
} from "@/dto/part.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationPart = (params: PaginationDto<PartFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<PartDto>>({
    queryKey: [API_ENDPOINTS.PART.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PART.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const usePartDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<PartDto>
  >({
    queryKey: [API_ENDPOINTS.PART.FIND_BY_ID, id],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PART.FIND_BY_ID, {
        id,
      }) as Promise<SuccessResponse<PartDto>>,
    enabled: !!id,
  });

  return {
    data: data?.data as PartDto,
    isLoading,
    refetch,
    error,
  };
};
export const useCreatePart = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createPart, isPending } = useMutation({
    mutationFn: (body: CreatePartDto) =>
      rootApiService.post(
        API_ENDPOINTS.PART.CREATE,
        body
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo loại khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo loại khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onCreatePart: createPart, isLoading: isPending };
};
export const useUpdatePart = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updatePart, isPending } = useMutation({
    mutationFn: (data: UpdatePartDto) => {
      return rootApiService.post(
        API_ENDPOINTS.PART.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật loại khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật loại khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdatePart: updatePart, isLoading: isPending };
};
export const useActivatePart = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivatePart, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PART.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt loại khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message:
          error?.message || "Có lỗi xảy ra khi kích hoạt loại khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivatePart,
    isLoading,
  };
};
export const useDeactivatePart = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivatePart, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PART.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Ngừng hoạt động loại khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message:
          error?.message || "Có lỗi xảy ra khi ngừng hoạt động loại khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    isLoading,
    onDeactivatePart,
  };
};
export const usePartSelectBox = () => {
  const { data, isLoading, error } = useQuery<PartDto[]>({
    queryKey: [API_ENDPOINTS.PART.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PART.SELECT_BOX) as Promise<
        PartDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
