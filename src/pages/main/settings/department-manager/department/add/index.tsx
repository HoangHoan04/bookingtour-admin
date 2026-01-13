import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { BranchSelectBoxDto } from "@/dto/branch.dto";
import type { CompanySelectBoxDto } from "@/dto/company.dto";
import type { DepartmentTypeSelectBoxDto } from "@/dto/department-type.dto";
import type {
  DepartmentDto,
  DepartmentSelectBoxDto,
} from "@/dto/department.dto";
import { useBranchSelectBox } from "@/hooks/branch";
import { useCompanySelectBox } from "@/hooks/company";
import {
  useCreateDepartment,
  useDepartmentSelectBox,
} from "@/hooks/department";
import { useDepartmentTypeSelectBox } from "@/hooks/department-type";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

export default function AddDepartmentPage({
  initData,
  title = "Thêm mới phòng ban",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
  onCancel,
}: {
  initData?: DepartmentDto;
  isEdit?: boolean;
  handleUpdate?: (data: DepartmentDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const { isLoading, onCreateDepartment } = useCreateDepartment();
  const { data: departmentTypes, isLoading: isLoadingDepartmentTypes } =
    useDepartmentTypeSelectBox();
  const { data: companyOptions, isLoading: loadingCompany } =
    useCompanySelectBox();
  const { data: branchOptions, isLoading: loadingBranch } =
    useBranchSelectBox();
  const { data: departmentOptions, isLoading: loadingDepartments } =
    useDepartmentSelectBox();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã phòng ban",
        type: "input",
        required: true,
        placeholder: "Nhập mã phòng ban",
        col: 8,
      },
      {
        name: "name",
        label: "Tên phòng ban",
        type: "input",
        required: true,
        placeholder: "Nhập tên phòng ban",
        col: 8,
      },
      {
        name: "limit",
        label: "Giới hạn nhân viên",
        type: "number",
        required: false,
        placeholder: "Nhập giới hạn nhân viên",
        col: 8,
        min: 0,
      },
      {
        name: "departmentTypeId",
        label: "Loại phòng ban",
        type: "select",
        required: false,
        placeholder: "Chọn loại phòng ban",
        options: departmentTypes.map((dt: DepartmentTypeSelectBoxDto) => ({
          id: dt.id,
          name: dt.name,
          value: dt.id,
        })),
        col: 8,
      },
      {
        name: "companyId",
        label: "Công ty",
        type: "select",
        required: false,
        placeholder: "Chọn công ty",
        options: companyOptions.map((company: CompanySelectBoxDto) => ({
          id: company.id,
          name: company.name,
          value: company.id,
        })),
        col: 8,
      },
      {
        name: "branchId",
        label: "Chi nhánh",
        type: "select",
        required: false,
        placeholder: "Chọn chi nhánh",
        options: Array.isArray(branchOptions)
          ? branchOptions.map((branch: BranchSelectBoxDto) => ({
              name: branch.name,
              value: branch.id,
              id: branch.id,
            }))
          : [],
        col: 8,
      },
      {
        name: "parentId",
        label: "Phòng ban cha",
        type: "select",
        required: false,
        placeholder: "Chọn phòng ban cha (nếu có)",
        options: Array.isArray(departmentOptions)
          ? departmentOptions
              .filter((dept: DepartmentSelectBoxDto) =>
                isEdit ? dept.id !== initData?.id : true
              )
              .map((dept: DepartmentSelectBoxDto) => ({
                id: dept.id,
                name: `${dept.code} - ${dept.name}`,
                value: dept.id,
              }))
          : [],
        col: 8,
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả phòng ban",
        col: 24,
      },
    ];
    return fields;
  }, [
    branchOptions,
    companyOptions,
    departmentTypes,
    departmentOptions,
    isEdit,
    initData,
  ]);

  const handleSubmit = (values: any) => {
    const submitData = {
      ...values,
      limit: values.limit || 0,
    };

    if (isEdit) {
      handleUpdate?.({
        ...initData,
        ...submitData,
      });
    } else {
      onCreateDepartment(submitData);
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
          loadingCompany ||
          loadingBranch ||
          isLoadingDepartmentTypes ||
          loadingDepartments
        }
        onSubmit={handleSubmit}
        onCancel={onCancel || goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns={24}
      />
    </BaseView>
  );
}
