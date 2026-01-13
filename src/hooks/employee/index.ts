import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateEmployeeDto,
  EmployeeDto,
  EmployeeFilter,
  UpdateEmployeeDto,
} from "@/dto/employee.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationEmployee = (
  params: PaginationDto<EmployeeFilter>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<EmployeeDto>
  >({
    queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.EMPLOYEE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useEmployeeDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<EmployeeDto>
  >({
    queryKey: [API_ENDPOINTS.EMPLOYEE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.EMPLOYEE.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<EmployeeDto>;
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

export const useCreateEmployee = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createEmployee, isPending } = useMutation({
    mutationFn: (body: CreateEmployeeDto) =>
      rootApiService.post(
        API_ENDPOINTS.EMPLOYEE.CREATE,
        body
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo nhân viên thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo nhân viên",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
    });
  };

  return { onCreateEmployee: createEmployee, isLoading: isPending, refetch };
};
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateEmployee, isPending } = useMutation({
    mutationFn: (data: UpdateEmployeeDto) => {
      return rootApiService.post(
        API_ENDPOINTS.EMPLOYEE.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật nhân viên thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật nhân viên",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateEmployee: updateEmployee, isLoading: isPending };
};
export const useActivateEmployee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateEmployee, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.EMPLOYEE.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt nhân viên thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt nhân viên",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    }
  );

  return {
    onActivateEmployee,
    isLoading,
  };
};
export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateEmployee, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.EMPLOYEE.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động nhân viên thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message:
            error?.message || "Có lỗi xảy ra khi ngừng hoạt động nhân viên",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateEmployee,
  };
};
export const useEmployeeSelectBox = () => {
  const { data, isLoading, error } = useQuery<EmployeeDto[]>({
    queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.EMPLOYEE.SELECT_BOX) as Promise<
        EmployeeDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
