import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreatePositionDto,
  PositionDto,
  PositionFilterDto,
  UpdatePositionDto,
} from "@/dto/position.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationPosition = (
  params: PaginationDto<PositionFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<PositionDto>
  >({
    queryKey: [API_ENDPOINTS.POSITION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.POSITION.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const usePositionDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<PositionDto>
  >({
    queryKey: [API_ENDPOINTS.POSITION.FIND_BY_ID, id],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.POSITION.FIND_BY_ID, {
        id,
      }) as Promise<SuccessResponse<PositionDto>>,
    enabled: !!id,
  });

  return {
    data: data?.data as PositionDto,
    isLoading,
    refetch,
    error,
  };
};
export const useCreatePosition = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createPosition, isPending } = useMutation({
    mutationFn: (body: CreatePositionDto) =>
      rootApiService.post(
        API_ENDPOINTS.POSITION.CREATE,
        body
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.SELECT_BOX],
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

  return { onCreatePosition: createPosition, isLoading: isPending };
};
export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updatePosition, isPending } = useMutation({
    mutationFn: (data: UpdatePositionDto) => {
      return rootApiService.post(
        API_ENDPOINTS.POSITION.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.SELECT_BOX],
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

  return { onUpdatePosition: updatePosition, isLoading: isPending };
};
export const useActivatePosition = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivatePosition, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.POSITION.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION.SELECT_BOX],
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
    }
  );

  return {
    onActivatePosition,
    isLoading,
  };
};
export const useDeactivatePosition = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivatePosition, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.POSITION.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION.SELECT_BOX],
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
            error?.message ||
            "Có lỗi xảy ra khi ngừng hoạt động loại khách hàng",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivatePosition,
  };
};
export const usePositionSelectBox = () => {
  const { data, isLoading, error } = useQuery<PositionDto[]>({
    queryKey: [API_ENDPOINTS.POSITION.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.POSITION.SELECT_BOX) as Promise<
        PositionDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
