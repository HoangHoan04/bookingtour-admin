import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateDepartmentDto,
  DepartmentDto,
  DepartmentFilterDto,
  UpdateDepartmentDto,
} from "@/dto/department.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationDepartment = (
  params: PaginationDto<DepartmentFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<DepartmentDto>
  >({
    queryKey: [API_ENDPOINTS.DEPARTMENT.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.DEPARTMENT.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDepartmentDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<DepartmentDto>
  >({
    queryKey: [API_ENDPOINTS.DEPARTMENT.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.DEPARTMENT.FIND_BY_ID,
        {
          id,
        }
      );
      return res as SuccessResponse<DepartmentDto>;
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

export const useCreateDepartment = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createDepartment, isPending } = useMutation({
    mutationFn: (body: CreateDepartmentDto) =>
      rootApiService.post(
        API_ENDPOINTS.DEPARTMENT.CREATE,
        body
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT.SELECT_BOX],
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
      queryKey: [API_ENDPOINTS.DEPARTMENT.PAGINATION],
    });
  };

  return {
    onCreateDepartment: createDepartment,
    isLoading: isPending,
    refetch,
  };
};
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateDepartment, isPending } = useMutation({
    mutationFn: (data: UpdateDepartmentDto) => {
      return rootApiService.post(
        API_ENDPOINTS.DEPARTMENT.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENT.SELECT_BOX],
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

  return { onUpdateDepartment: updateDepartment, isLoading: isPending };
};
export const useActivateDepartment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateDepartment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.DEPARTMENT.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT.SELECT_BOX],
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
    onActivateDepartment,
    isLoading,
  };
};
export const useDeactivateDepartment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateDepartment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.DEPARTMENT.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DEPARTMENT.SELECT_BOX],
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
    onDeactivateDepartment,
  };
};
export const useDepartmentSelectBox = () => {
  const { data, isLoading, error } = useQuery<DepartmentDto[]>({
    queryKey: [API_ENDPOINTS.DEPARTMENT.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.DEPARTMENT.SELECT_BOX) as Promise<
        DepartmentDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
