import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { CompanyDto } from "@/dto/company.dto";
import { useCompanySelectBox, useCreateCompany } from "@/hooks/company";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddCompanyPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới công ty",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: CompanyDto;
  isEdit?: boolean;
  handleUpdate?: (data: CompanyDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateCompany } = useCreateCompany();
  const { data: companyOptions, isLoading: loadingCompany } =
    useCompanySelectBox();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã công ty",
        type: "input",
        required: true,
        placeholder: "Nhập mã công ty",
        disabled: isEdit,
      },
      {
        name: "name",
        label: "Tên công ty",
        type: "input",
        required: true,
        placeholder: "Nhập tên công ty",
      },
      {
        name: "address",
        label: "Địa chỉ",
        type: "input",
        required: false,
        placeholder: "Nhập địa chỉ",
      },
      {
        name: "taxCode",
        label: "Mã số thuế",
        type: "input",
        required: false,
        placeholder: "Nhập mã số thuế",
      },
      {
        name: "phoneNumber",
        label: "Số điện thoại",
        type: "phoneNumber",
        required: false,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "email",
        label: "Địa chỉ email",
        type: "email",
        required: false,
        placeholder: "Nhập địa chỉ email",
      },
      {
        name: "website",
        label: "Website",
        type: "input",
        required: false,
        placeholder: "Nhập website",
      },
      {
        name: "foundedDate",
        label: "Ngày thành lập",
        type: "datepicker",
        required: false,
        placeholder: "Chọn ngày thành lập",
      },
      {
        name: "parentCompanyId",
        label: "Công ty mẹ",
        type: "select",
        options:
          companyOptions?.map((company) => ({
            id: company.id,
            name: company.name,
            value: company.id,
          })) || [],
        required: false,
        placeholder: "Nhập công ty mẹ",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
        gridColumn: "span 3",
      },

      {
        name: "logoUrl",
        label: "Logo công ty",
        type: "image",
        isSingle: true,
        required: false,
      },

      {
        name: "documents",
        label: "Tài liệu",
        type: "file",
        isSingle: false,
        required: false,
      },
    ];
  }, [companyOptions, isEdit]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateCompany(values);
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
        loading={isLoading || isLoadingUpdate || loadingCompany}
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

export default AddCompanyPage;
