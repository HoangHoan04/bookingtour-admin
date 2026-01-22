import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateTourGuideDto,
  TourGuideDto,
  TourGuideFilterDto,
  UpdateTourGuideDto,
} from "@/dto/tour-guide.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTourGuide = (
  params: PaginationDto<TourGuideFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TourGuideDto>
  >({
    queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useTourGuideDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<TourGuideDto>
  >({
    queryKey: [API_ENDPOINTS.TOUR_GUIDE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.FIND_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<TourGuideDto>;
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

export const useCreateTourGuide = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createTourGuide, isPending } = useMutation({
    mutationFn: (body: CreateTourGuideDto) =>
      rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
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
      queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
    });
  };

  return { onCreateTourGuide: createTourGuide, isLoading: isPending, refetch };
};
export const useUpdateTourGuide = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateTourGuide, isPending } = useMutation({
    mutationFn: (data: UpdateTourGuideDto) => {
      return rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
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

  return { onUpdateTourGuide: updateTourGuide, isLoading: isPending };
};
export const useActivateTourGuide = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateTourGuide, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
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
    onActivateTourGuide,
    isLoading,
  };
};
export const useDeactivateTourGuide = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateTourGuide, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
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
    onDeactivateTourGuide,
  };
};
export const useTourGuideSelectBox = () => {
  const { data, isLoading, error } = useQuery<TourGuideDto[]>({
    queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX) as Promise<
        TourGuideDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
