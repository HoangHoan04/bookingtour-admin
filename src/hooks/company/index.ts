import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CompanyDto,
  CompanyFilterDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from "@/dto/company.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import {
  excelService,
  type ExcelColumn,
  type ImportResult,
} from "@/services/excel.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const usePaginationCompany = (
  params: PaginationDto<CompanyFilterDto>
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<CompanyDto>
  >({
    queryKey: [API_ENDPOINTS.COMPANY.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.COMPANY.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCompanyDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<CompanyDto>
  >({
    queryKey: [API_ENDPOINTS.COMPANY.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.COMPANY.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<CompanyDto>;
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

export const useCreateCompany = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createCompany, isPending } = useMutation({
    mutationFn: (body: CreateCompanyDto) =>
      rootApiService.post(
        API_ENDPOINTS.COMPANY.CREATE,
        body
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo công ty thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo công ty",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.COMPANY.PAGINATION],
    });
  };

  return { onCreateCompany: createCompany, isLoading: isPending, refetch };
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: (data: UpdateCompanyDto) => {
      return rootApiService.post(
        API_ENDPOINTS.COMPANY.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật công ty thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật công ty",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateCompany: updateCompany, isLoading: isPending };
};

export const useActivateCompany = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateCompany, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.COMPANY.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.COMPANY.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt công ty thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt công ty",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivateCompany,
    isLoading,
  };
};

export const useDeactivateCompany = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateCompany, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.COMPANY.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.COMPANY.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.COMPANY.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động công ty thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message:
            error?.message || "Có lỗi xảy ra khi ngừng hoạt động công ty",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateCompany,
  };
};

export const useCompanySelectBox = () => {
  const { data, isLoading, error } = useQuery<CompanyDto[]>({
    queryKey: [API_ENDPOINTS.COMPANY.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.COMPANY.SELECT_BOX) as Promise<
        CompanyDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export const companyExcelColumns: ExcelColumn[] = [
  {
    field: "code",
    header: "Mã công ty",
    width: 15,
    required: true,
  },
  {
    field: "name",
    header: "Tên công ty",
    width: 30,
    required: true,
  },
  {
    field: "taxCode",
    header: "Mã số thuế",
    width: 15,
    required: false,
  },
  {
    field: "address",
    header: "Địa chỉ",
    width: 40,
    required: false,
  },
  {
    field: "phoneNumber",
    header: "Số điện thoại",
    width: 15,
    required: false,
  },
  {
    field: "email",
    header: "Email",
    width: 25,
    required: false,
  },
  {
    field: "website",
    header: "Website",
    width: 25,
    required: false,
  },
  {
    field: "legalRepresentative",
    header: "Người đại diện pháp luật",
    width: 25,
    required: false,
  },
  {
    field: "foundedDate",
    header: "Ngày thành lập",
    width: 15,
    required: false,
    formatter: (value: any) => {
      if (!value) return "";
      if (value instanceof Date) {
        return value.toLocaleDateString("vi-VN");
      }
      return value;
    },
  },
  {
    field: "description",
    header: "Mô tả",
    width: 40,
    required: false,
  },
];

export function useDownloadCompanyTemplate() {
  const { showToast } = useToast();

  const { mutate: downloadTemplate, isPending: isDownloading } = useMutation({
    mutationFn: async () => {
      await excelService.downloadTemplate(
        companyExcelColumns,
        "company_template.xlsx"
      );
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: "Tải template thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tải template",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    downloadTemplate,
    isDownloading,
  };
}

export function useImportCompany() {
  const { showToast } = useToast();
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] =
    useState<ImportResult<CompanyDto> | null>(null);

  const { mutateAsync: importCompany, isPending: isImporting } = useMutation({
    mutationFn: async (file: File) => {
      const validation = excelService.validateExcelFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const result = await excelService.importFromExcel<CompanyDto>(file, {
        columns: companyExcelColumns,
        onProgress: setImportProgress,
      });

      setImportResult(result);

      if (result.data.length > 0) {
        const response = await rootApiService.post(
          API_ENDPOINTS.COMPANY.IMPORT,
          {
            companies: result.data,
          }
        );
        return { ...result, apiResponse: response };
      }

      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        showToast({
          type: "success",
          message: `Import thành công ${result.successRows}/${result.totalRows} dòng`,
          title: "Thành công",
          timeout: 3000,
        });
      } else {
        showToast({
          type: "warn",
          message: `Import hoàn tất với ${result.errorRows} lỗi`,
          title: "Cảnh báo",
          timeout: 5000,
        });
      }
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi import",
        title: "Lỗi",
        timeout: 3000,
      });
      setImportProgress(0);
    },
  });

  const downloadErrorReport = async () => {
    if (!importResult || importResult.errors.length === 0) return;

    const errorData = importResult.errors.map((error) => ({
      Dòng: error.row,
      Trường: error.field || "N/A",
      Lỗi: error.message,
    }));

    await excelService.exportToExcel(errorData, {
      filename: `company_import_errors_${new Date().getTime()}.xlsx`,
      sheetName: "Errors",
    });
  };

  const clearResult = () => {
    setImportResult(null);
    setImportProgress(0);
  };

  return {
    importCompany,
    isImporting,
    importProgress,
    importResult,
    downloadErrorReport,
    clearResult,
  };
}

export function useExportCompany() {
  const { showToast } = useToast();

  const { mutate: exportCompany, isPending: isExporting } = useMutation({
    mutationFn: async (params: {
      pagination: PaginationDto<CompanyFilterDto>;
      limit?: number;
    }) => {
      const response = (await rootApiService.post(
        API_ENDPOINTS.COMPANY.PAGINATION,
        {
          ...params.pagination,
          take: params.limit || params.pagination.take,
          skip: 0,
        }
      )) as PageResponse<CompanyDto>;
      const data = response.data || [];
      await excelService.exportToExcel(data, {
        columns: companyExcelColumns,
        filename: `company_export_${new Date().getTime()}.xlsx`,
        sheetName: "Companies",
      });
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: "Xuất Excel thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi xuất Excel",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    exportCompany,
    isExporting,
  };
}
