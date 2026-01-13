import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { PartMasterDto } from "@/dto/part-master.dto";
import { useBranchSelectBox } from "@/hooks/branch";
import { useCreatePartMaster } from "@/hooks/part-master";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddPartMasterPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới bộ phận mẫu",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: PartMasterDto;
  isEdit?: boolean;
  handleUpdate?: (data: PartMasterDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreatePartMaster } = useCreatePartMaster();
  const { data: branchOptions, isLoading: loadingBranches } =
    useBranchSelectBox();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã bộ phận mẫu",
        type: "input",
        required: true,
        placeholder: "Nhập mã bộ phận mẫu",
        disabled: isEdit,
      },
      {
        name: "name",
        label: "Tên bộ phận mẫu",
        type: "input",
        required: true,
        placeholder: "Nhập tên bộ phận mẫu",
      },
      {
        name: "branchIds",
        label: "Chi nhánh áp dụng",
        type: "multiselect",
        multiple: true,
        options:
          branchOptions?.map((branch) => ({
            id: branch.id,
            name: branch.name,
            value: branch.id,
          })) || [],
        placeholder: "Chọn chi nhánh áp dụng",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        gridColumn: "span 3",
        placeholder: "Nhập mô tả",
      },
    ];
  }, [branchOptions, isEdit]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreatePartMaster(values);
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
        loading={isLoading || isLoadingUpdate || loadingBranches}
        onSubmit={handleSubmit}
        onCancel={goBack || onCancel}
        submitText="Lưu"
        cancelText="Hủy"
        gap="20px"
        gridColumns={3}
      />
    </BaseView>
  );
}

export default AddPartMasterPage;
