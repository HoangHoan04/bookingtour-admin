import { enumData } from "@/common/enums/enum";
import { formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TourPriceDto } from "@/dto/tour-price.dto";
import { useTourDetailSelectBox } from "@/hooks/tour-detail";
import { useCreateTourPrice } from "@/hooks/tour-price";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddTourPricePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới giá tour",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TourPriceDto;
  isEdit?: boolean;
  handleUpdate?: (data: TourPriceDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTourPrice } = useCreateTourPrice();
  const router = useRouter();
  const { data: tourDetailOptions } = useTourDetailSelectBox();

  const normalizedInitialValues = useMemo(() => {
    if (!initData) return undefined;

    const tourDetailId =
      initData.tourDetailId ||
      (initData as any)?.tourDetail?.id ||
      (initData as any)?.tourDetail?._id;

    return {
      ...initData,
      priceType: initData.priceType ? String(initData.priceType) : undefined,
      tourDetailId: tourDetailId ? String(tourDetailId) : undefined,
    };
  }, [initData]);

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "priceType",
        label: "Loại giá",
        type: "select",
        placeholder: "Chọn loại giá tour",
        required: true,
        options: Object.values(enumData.PRICE_TYPE || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        col: 4,
      },
      {
        name: "price",
        label: "Giá tour",
        type: "number",
        required: true,
        placeholder: "Nhập giá tour",
        col: 4,
      },
      {
        name: "tourDetailId",
        label: "Chọn chi tiết tour",
        type: "select",
        required: true,
        placeholder: "Chọn chi tiết tour",
        options: tourDetailOptions?.map((item) => ({
          id: item.id,
          name: `Code: ${item.code} - Bắt đầu:${formatDateTime(item.startDay)}`,
          value: String(item.id),
        })),
        col: 4,
      },
    ];
  }, [tourDetailOptions]);

  const handleSubmit = (values: TourPriceDto) => {
    const submitData: TourPriceDto = values;

    if (isEdit && handleUpdate) {
      handleUpdate(submitData);
    } else {
      onCreateTourPrice(submitData);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={normalizedInitialValues}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={goBack || onCancel}
        submitText="Lưu"
        cancelText="Hủy"
        gap="20px"
        gridColumns={12}
      />
    </BaseView>
  );
}

export default AddTourPricePage;
