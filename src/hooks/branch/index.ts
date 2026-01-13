import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/context/TranslationContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  BranchDto,
  BranchFilterDto,
  CreateBranchDto,
  UpdateBranchDto,
} from "@/dto/branch.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationBranch = (params: PaginationDto<BranchFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<BranchDto>>(
    {
      queryKey: [API_ENDPOINTS.BRANCH.PAGINATION, params],
      queryFn: () =>
        rootApiService.post(API_ENDPOINTS.BRANCH.PAGINATION, params),
    }
  );

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useBranchDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<BranchDto>
  >({
    queryKey: [API_ENDPOINTS.BRANCH.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.BRANCH.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<BranchDto>;
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

export const useCreateBranch = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate: createBranch, isPending } = useMutation({
    mutationFn: (body: CreateBranchDto) =>
      rootApiService.post(
        API_ENDPOINTS.BRANCH.CREATE,
        body
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: t(res.message),
        title: t("common.success_title"),
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || t("branch.error.create"),
        title: t("common.error_title"),
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.BRANCH.PAGINATION],
    });
  };

  return { onCreateBranch: createBranch, isLoading: isPending, refetch };
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const { mutate: updateBranch, isPending } = useMutation({
    mutationFn: (data: UpdateBranchDto) => {
      return rootApiService.post(
        API_ENDPOINTS.BRANCH.UPDATE,
        data
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || t("branch.success.update"),
        title: t("common.success_title"),
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || t("branch.error.update"),
        title: t("common.error_title"),
        timeout: 3000,
      });
    },
  });

  return { onUpdateBranch: updateBranch, isLoading: isPending };
};

export const useActivateBranch = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const { mutateAsync: onActivateBranch, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BRANCH.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BRANCH.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || t("branch.success.activate"),
        title: t("common.success_title"),
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || t("branch.error.activate"),
        title: t("common.error_title"),
        timeout: 3000,
      });
    },
  });

  return {
    onActivateBranch,
    isLoading,
  };
};

export const useDeactivateBranch = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const { mutateAsync: onDeactivateBranch, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.BRANCH.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BRANCH.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BRANCH.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || t("branch.success.deactivate"),
          title: t("common.success_title"),
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || t("branch.error.deactivate"),
          title: t("common.error_title"),
          timeout: 3000,
        });
      },
    }
  );

  return {
    isLoading,
    onDeactivateBranch,
  };
};

export const useBranchSelectBox = () => {
  const { data, isLoading, error } = useQuery<BranchDto[]>({
    queryKey: [API_ENDPOINTS.BRANCH.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.BRANCH.SELECT_BOX) as Promise<
        BranchDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
