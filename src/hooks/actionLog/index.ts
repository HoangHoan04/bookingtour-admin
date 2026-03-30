import type { PageRequest, PageResponse } from "@/dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export interface ActionLogFilter {
  functionType: string;
  functionId: string;
  type?: string;
  createdBy?: string;
}

export const ActionType = {
  CREATE: "Tạo mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  CANCEL: "Hủy",
  APPROVE: "Phê duyệt",
  DEACTIVE: "Không hoạt động",
  ACTIVE: "Hoạt động",
} as const;

export interface ActionLogDto {
  dataOld: string;
  dataNew: string;
  id: string;
  createdAt: Date;
  createdById: string;
  createdByCode: string;
  createdByName: string;
  employeeCode: string;
  type: keyof typeof ActionType;
  description: string;
  functionType: string;
  functionId: string;
}

export const useActionsLogPagination = (
  params: PageRequest<ActionLogFilter>
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ACTION_LOG, params],
    queryFn: async () => {
      const response = await rootApiService.post<PageResponse<ActionLogDto>>(
        API_ENDPOINTS.ACTION_LOG,
        params
      );
      return response;
    },
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};
