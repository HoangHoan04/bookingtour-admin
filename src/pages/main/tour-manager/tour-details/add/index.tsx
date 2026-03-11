import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TourDetailDto } from "@/dto/tour.dto";
import { useCreateTourDetail } from "@/hooks/tour-detail";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddTourDetailPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới chi tiết tour",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TourDetailDto;
  isEdit?: boolean;
  handleUpdate?: (data: TourDetailDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTourDetail } = useCreateTourDetail();
  const router = useRouter();

  type TourSubmitValues = Omit<TourDetailDto, "tags"> & {
    tags?: string | string[];
  };

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã chi tiết tour",
        type: "input",
        placeholder: "Mã chi tiết tour sẽ được tự động tạo",
        disabled: true,
        col: 4,
      },
      {
        name: "startDay",
        label: "Ngày khởi hành",
        type: "input",
        required: true,
        placeholder: "Nhập ngày khởi hành (VD: 2024-12-31)",
        col: 4,
      },
      {
        name: "endDay",
        label: "Ngày kết thúc",
        type: "input",
        required: true,
        placeholder: "Nhập ngày kết thúc (VD: 2024-12-31)",
        col: 4,
      },
      {
        name: "startLocation",
        label: "Địa điểm khởi hành",
        type: "input",
        required: true,
        placeholder: "Nhập địa điểm khởi hành (VD: Hà Nội)",
        col: 4,
      },
      {
        name: "capacity",
        label: "Sức chứa",
        type: "number",
        placeholder: "Nhập sức chứa của tour (VD: 20)",
        col: 4,
      },
      {
        name: "remainingSeats",
        label: "Số ghế còn lại",
        type: "number",
        placeholder: "Số ghế sẽ được khởi tạo bằng sức chứa ban đầu",
        disabled: true,
        col: 4,
      },
      {
        name: "tourId",
        label: "Mã tour",
        type: "input",
        required: true,
        placeholder: "Nhập mã tour",
        col: 12,
      },
    ];
  }, []);

  const handleSubmit = (values: TourSubmitValues) => {
    const submitData: TourDetailDto = values;

    if (isEdit && handleUpdate) {
      handleUpdate(submitData);
    } else {
      onCreateTourDetail(submitData);
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
        initialValues={initData}
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

export default AddTourDetailPage;
