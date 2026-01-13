import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreatePartMasterDto,
  PartMasterDto,
  PartMasterFilterDto,
  UpdatePartMasterDto,
} from "@/dto/part-master.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationPartMaster = (
  params: PaginationDto<PartMasterFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<PartMasterDto>
  >({
    queryKey: [API_ENDPOINTS.PART_MASTER.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PART_MASTER.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const usePartMasterDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<PartMasterDto>
  >({
    queryKey: [API_ENDPOINTS.PART_MASTER.FIND_BY_ID, id],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PART_MASTER.FIND_BY_ID, {
        id,
      }) as Promise<SuccessResponse<PartMasterDto>>,
    enabled: !!id,
  });

  return {
    data: data?.data as PartMasterDto,
    isLoading,
    refetch,
    error,
  };
};
export const useCreatePartMaster = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createPartMaster, isPending } = useMutation({
    mutationFn: (body: CreatePartMasterDto) =>
      rootApiService.post(
        API_ENDPOINTS.PART_MASTER.CREATE,
        body
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART_MASTER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART_MASTER.SELECT_BOX],
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

  return { onCreatePartMaster: createPartMaster, isLoading: isPending };
};
export const useUpdatePartMaster = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updatePartMaster, isPending } = useMutation({
    mutationFn: (data: UpdatePartMasterDto) => {
      return rootApiService.post(
        API_ENDPOINTS.PART_MASTER.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART_MASTER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART_MASTER.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PART_MASTER.SELECT_BOX],
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

  return { onUpdatePartMaster: updatePartMaster, isLoading: isPending };
};
export const useActivatePartMaster = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivatePartMaster, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.PART_MASTER.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PART_MASTER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PART_MASTER.SELECT_BOX],
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
    onActivatePartMaster,
    isLoading,
  };
};
export const useDeactivatePartMaster = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivatePartMaster, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.PART_MASTER.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PART_MASTER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PART_MASTER.SELECT_BOX],
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
    onDeactivatePartMaster,
  };
};
export const usePartMasterSelectBox = () => {
  const { data, isLoading, error } = useQuery<PartMasterDto[]>({
    queryKey: [API_ENDPOINTS.PART_MASTER.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PART_MASTER.SELECT_BOX) as Promise<
        PartMasterDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
