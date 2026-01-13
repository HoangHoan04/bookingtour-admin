import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { DepartmentTypeFilterDto, DepartmentTypeDto, CreateDepartmentTypeDto, UpdateDepartmentTypeDto } from "@/dto/department-type.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationDepartmentType = (
  params: PaginationDto<DepartmentTypeFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<DepartmentTypeDto>
  >({
    queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDepartmentTypeDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<DepartmentTypeDto>
  >({
    queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.DEPARTMENT_TYPE.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<DepartmentTypeDto>;
    },
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateDepartmentType = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createDepartmentType, isPending } = useMutation({
    mutationFn: (body: CreateDepartmentTypeDto) =>
      rootApiService.post(
        API_ENDPOINTS.DEPARTMENT_TYPE.CREATE,
        body
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION],
    });
  };

  return {
    onCreateDepartmentType: createDepartmentType,
    isLoading: isPending,
    refetch,
  };
};
export const useUpdateDepartmentType = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateDepartmentType, isPending } = useMutation({
    mutationFn: (data: UpdateDepartmentTypeDto) => {
      return rootApiService.post(
        API_ENDPOINTS.DEPARTMENT_TYPE.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateDepartmentType: updateDepartmentType, isLoading: isPending };
};
export const useActivateDepartmentType = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateDepartmentType, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.DEPARTMENT_TYPE.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt khách hàng thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt khách hàng",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onActivateDepartmentType,
    isLoading,
  };
};
export const useDeactivateDepartmentType = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateDepartmentType, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.DEPARTMENT_TYPE.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động khách hàng thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message:
            error?.message || "Có lỗi xảy ra khi ngừng hoạt động khách hàng",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateDepartmentType,
  };
};
export const useDepartmentTypeSelectBox = () => {
  const { data, isLoading, error } = useQuery<DepartmentTypeDto[]>({
    queryKey: [API_ENDPOINTS.DEPARTMENT_TYPE.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.DEPARTMENT_TYPE.SELECT_BOX) as Promise<
        DepartmentTypeDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
