import { useToast } from "@/context/ToastContext";
import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  CreatePositionMasterDto,
  PositionMasterDto,
  PositionMasterFilterDto,
  UpdatePositionMasterDto,
} from "@/dto/position-master.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationPositionMaster = (
  params: PaginationDto<PositionMasterFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<PositionMasterDto>
  >({
    queryKey: [API_ENDPOINTS.POSITION_MASTER.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.POSITION_MASTER.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const usePositionMasterDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<PositionMasterDto>
  >({
    queryKey: [API_ENDPOINTS.POSITION_MASTER.FIND_BY_ID, id],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.POSITION_MASTER.FIND_BY_ID, {
        id,
      }) as Promise<SuccessResponse<PositionMasterDto>>,
    enabled: !!id,
  });

  return {
    data: data?.data as PositionMasterDto,
    isLoading,
    refetch,
    error,
  };
};
export const useCreatePositionMaster = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createPositionMaster, isPending } = useMutation({
    mutationFn: (body: CreatePositionMasterDto) =>
      rootApiService.post(
        API_ENDPOINTS.POSITION_MASTER.CREATE,
        body
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION_MASTER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION_MASTER.SELECT_BOX],
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

  return { onCreatePositionMaster: createPositionMaster, isLoading: isPending };
};
export const useUpdatePositionMaster = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updatePositionMaster, isPending } = useMutation({
    mutationFn: (data: UpdatePositionMasterDto) => {
      return rootApiService.post(
        API_ENDPOINTS.POSITION_MASTER.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION_MASTER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION_MASTER.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION_MASTER.SELECT_BOX],
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

  return { onUpdatePositionMaster: updatePositionMaster, isLoading: isPending };
};
export const useActivatePositionMaster = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivatePositionMaster, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.POSITION_MASTER.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION_MASTER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION_MASTER.SELECT_BOX],
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
    onActivatePositionMaster,
    isLoading,
  };
};
export const useDeactivatePositionMaster = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivatePositionMaster, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.POSITION_MASTER.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION_MASTER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION_MASTER.SELECT_BOX],
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
    onDeactivatePositionMaster,
  };
};
export const usePositionMasterSelectBox = () => {
  const { data, isLoading, error } = useQuery<PositionMasterDto[]>({
    queryKey: [API_ENDPOINTS.POSITION_MASTER.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.POSITION_MASTER.SELECT_BOX) as Promise<
        PositionMasterDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
