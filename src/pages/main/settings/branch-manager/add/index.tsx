import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { BranchDto } from "@/dto/branch.dto";
import { useCreateBranch } from "@/hooks/branch";
import { useCompanySelectBox } from "@/hooks/company";
import { usePartMasterSelectBox } from "@/hooks/part-master";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddBranchPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới chi nhánh",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: BranchDto;
  isEdit?: boolean;
  handleUpdate?: (data: BranchDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateBranch } = useCreateBranch();
  const { data: companyOptions, isLoading: loadingCompanies } =
    useCompanySelectBox();
  const { data: partMasterOptions, isLoading: loadingParts } =
    usePartMasterSelectBox();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã chi nhánh",
        type: "input",
        required: true,
        placeholder: "Nhập mã chi nhánh",
        disabled: isEdit,
      },
      {
        name: "name",
        label: "Tên chi nhánh",
        type: "input",
        required: true,
        placeholder: "Nhập tên chi nhánh đầy đủ",
      },
      {
        name: "shortName",
        label: "Tên viết tắt",
        type: "input",
        placeholder: "Nhập tên viết tắt chi nhánh",
      },
      {
        name: "companyId",
        label: "Công ty",
        type: "select",
        required: true,
        options:
          companyOptions?.map((c) => ({
            id: c.id,
            name: c.name,
            value: c.id,
          })) || [],
        placeholder: "Chọn công ty",
      },
      {
        name: "type",
        label: "Loại chi nhánh",
        type: "select",
        options: Object.values(enumData.BRANCH_TYPE || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn loại chi nhánh",
      },
      {
        name: "partMasterIds",
        label: "Bộ phận mẫu",
        type: "multiselect",
        multiple: true,
        options:
          partMasterOptions?.map((p) => ({
            id: p.id,
            name: p.name,
            value: p.id,
          })) || [],
        placeholder: "Các bộ phận mẫu trong chi nhánh",
      },
      {
        name: "address",
        label: "Địa chỉ",
        type: "input",
        placeholder: "Nhập địa chỉ chi nhánh",
      },
      {
        name: "phoneNumber",
        label: "Số điện thoại",
        type: "phoneNumber",
        placeholder: " Nhập số điện thoại",
      },
      {
        name: "email",
        label: "Email liên hệ",
        type: "email",
        placeholder: " Nhập email liên hệ",
      },
      {
        name: "ipAddress",
        label: "Địa chỉ IP",
        type: "input",
        placeholder: "Nhập địa chỉ IP",
      },
      {
        name: "isHeadquarters",
        label: "Là trụ sở chính",
        type: "checkbox",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        gridColumn: "span 3",
        placeholder: "Nhập mô tả",
      },
    ];
  }, [companyOptions, isEdit, partMasterOptions]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateBranch(values);
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
          isLoading || isLoadingUpdate || loadingCompanies || loadingParts
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

export default AddBranchPage;
