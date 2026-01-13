import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { PartDto } from "@/dto/part.dto";
import { useBranchSelectBox } from "@/hooks/branch";
import { useCompanySelectBox } from "@/hooks/company";
import { useDepartmentSelectBox } from "@/hooks/department";
import { useCreatePart } from "@/hooks/part";
import { usePartMasterSelectBox } from "@/hooks/part-master";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddPartPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới bộ phận",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: PartDto;
  isEdit?: boolean;
  handleUpdate?: (data: PartDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreatePart } = useCreatePart();
  const { data: companyOptions, isLoading: loadingCompanies } =
    useCompanySelectBox();
  const { data: branchOptions, isLoading: loadingBranches } =
    useBranchSelectBox();
  const { data: departmentOptions, isLoading: loadingDepartments } =
    useDepartmentSelectBox();
  const { data: partMasterOptions, isLoading: loadingPartMasters } =
    usePartMasterSelectBox();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã bộ phận",
        type: "input",
        required: true,
        placeholder: "Nhập mã bộ phận",
        disabled: isEdit,
      },
      {
        name: "name",
        label: "Tên bộ phận",
        type: "input",
        required: true,
        placeholder: "Nhập tên bộ phận",
      },
      {
        name: "companyId",
        label: "Công ty",
        type: "select",
        options:
          companyOptions?.map((c) => ({
            id: c.id,
            name: c.name,
            value: c.id,
          })) || [],
        placeholder: "Chọn công ty",
      },
      {
        name: "branchId",
        label: "Chi nhánh",
        type: "select",
        options:
          branchOptions?.map((b) => ({
            id: b.id,
            name: b.name,
            value: b.id,
          })) || [],
        placeholder: "Chọn chi nhánh",
      },
      {
        name: "departmentId",
        label: "Phòng ban",
        type: "select",
        options:
          departmentOptions?.map((d) => ({
            id: d.id,
            name: d.name,
            value: d.id,
          })) || [],
        placeholder: "Chọn phòng ban",
      },
      {
        name: "partMasterId",
        label: "Bộ phận mẫu",
        type: "select",
        options:
          partMasterOptions?.map((pm) => ({
            id: pm.id,
            name: pm.name,
            value: pm.id,
          })) || [],
        placeholder: "Chọn bộ phận mẫu",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        gridColumn: "span 3",
        placeholder: "Nhập mô tả",
      },
    ];
  }, [
    companyOptions,
    branchOptions,
    departmentOptions,
    partMasterOptions,
    isEdit,
  ]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreatePart(values);
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
        loading={
          isLoading ||
          isLoadingUpdate ||
          loadingCompanies ||
          loadingBranches ||
          loadingDepartments ||
          loadingPartMasters
        }
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

export default AddPartPage;
