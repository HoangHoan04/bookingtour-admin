import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { DepartmentTypeDto } from "@/dto/department-type.dto";
import { useCreateDepartmentType } from "@/hooks/department-type";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

export default function AddDepartmentTypePage({
  initData,
  title = "Thêm mới loại phòng ban",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
  onCancel,
}: {
  initData?: DepartmentTypeDto;
  isEdit?: boolean;
  handleUpdate?: (data: DepartmentTypeDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateDepartmentType } = useCreateDepartmentType();

  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã loại phòng ban",
        type: "input",
        required: true,
        placeholder: "Nhập mã loại phòng ban",
      },
      {
        name: "name",
        label: "Tên loại phòng ban",
        type: "input",
        required: true,
        placeholder: "Nhập tên loại phòng ban",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
      },
    ];
    return fields;
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      handleUpdate?.({
        ...initData,
        ...values,
      });
    } else {
      onCreateDepartmentType(values);
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
        onCancel={onCancel || goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns={2}
      />
    </BaseView>
  );
}
