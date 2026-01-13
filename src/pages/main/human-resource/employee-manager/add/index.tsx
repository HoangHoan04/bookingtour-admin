import { enumData } from "@/common/enums/enum";
import { getEnumOptions } from "@/common/helpers";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import { useTranslation } from "@/context/TranslationContext";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useCreateEmployee } from "@/hooks/employee";
import { useRoleSelectBox } from "@/hooks/role";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddEmployeePage({
  initData,
  isEdit = false,
  handleUpdate,
  title,
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: EmployeeDto;
  isEdit?: boolean;
  handleUpdate?: (data: EmployeeDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();
  const { isLoading, onCreateEmployee } = useCreateEmployee();
  const { data: roleOptions, isLoading: loadingRoles } = useRoleSelectBox();
  const router = useRouter();
  const formFields = useMemo((): FormField[] => {
    return [
      {
        // Mã nhân viên
        name: "code",
        label: t("employee.code"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.code"),
        disabled: isEdit,
      },
      {
        // Họ nhân viên
        name: "lastName",
        label: t("employee.lastName"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.lastName"),
      },
      {
        // Tên nhân viên
        name: "firstName",
        label: t("employee.firstName"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.firstName"),
      },
      {
        // Số điện thoại
        name: "phone",
        label: t("employee.phone"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.phone"),
      },
      {
        // Số điện thoại phụ
        name: "secondaryPhone",
        label: t("employee.secondaryPhone"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.secondaryPhone"),
      },
      {
        // Email
        name: "email",
        label: t("employee.email"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.email"),
      },
      {
        // Giới tính
        name: "gender",
        label: t("employee.gender"),
        type: "select",
        required: true,
        options: getEnumOptions(enumData.GENDER, "enums.GENDER", t),
        placeholder: t("employee.placeholder.gender"),
      },
      {
        // Ngày sinh
        name: "birthday",
        label: t("employee.birthday"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.birthday"),
      },
      {
        // Quốc tịch
        name: "nationality",
        label: t("employee.nationality"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.nationality"),
      },
      {
        // Dân tộc
        name: "ethnicity",
        label: t("employee.ethnicity"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.ethnicity"),
      },
      {
        // Tôn giáo
        name: "religion",
        label: t("employee.religion"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.religion"),
      },
      {
        // Tình trạng hôn nhân
        name: "maritalStatus",
        label: t("employee.maritalStatus"),
        type: "select",
        options: Object.values(enumData.MARITAL_STATUS || {}).map(
          (item: any) => ({
            id: item.code,
            name: t(`enum.maritalStatus.${item.code}`),
            value: item.code,
          })
        ),
        required: false,
        placeholder: t("employee.placeholder.maritalStatus"),
      },
      {
        // Số người phụ thuộc
        name: "numberOfDependents",
        label: t("employee.numberOfDependents"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.numberOfDependents"),
      },
      {
        // Số CMND/CCCD
        name: "identityCard",
        label: t("employee.identityCard"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.identityCard"),
      },
      {
        // Nơi cấp CMND/CCCD
        name: "placeOfIssuance",
        label: t("employee.placeOfIssuance"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.placeOfIssuance"),
      },
      {
        // Ngày cấp CMND/CCCD
        name: "issuanceDate",
        label: t("employee.issuanceDate"),
        type: "datepicker",
        required: false,
        placeholder: t("employee.placeholder.issuanceDate"),
      },
      {
        // Địa chỉ thường trú
        name: "permanentAddress",
        label: t("employee.permanentAddress"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.permanentAddress"),
      },
      {
        // Địa chỉ hiện tại
        name: "nowAddress",
        label: t("employee.nowAddress"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.nowAddress"),
      },
      {
        // Thành phố hiện tại
        name: "currentCity",
        label: t("employee.nowAddress"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.nowAddress"),
      },
      {
        // Quận/Huyện hiện tại
        name: "currentDistrict",
        label: t("employee.currentDistrict"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.currentDistrict"),
      },
      {
        // Phường/Xã hiện tại
        name: "currentWard",
        label: t("employee.currentWard"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.currentWard"),
      },
      {
        // Số hộ chiếu
        name: "passportNumber",
        label: t("employee.passportNumber"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.passportNumber"),
      },
      {
        // Ngày cấp hộ chiếu
        name: "passportIssueDate",
        label: t("employee.passportIssueDate"),
        type: "datepicker",
        required: false,
        placeholder: t("employee.placeholder.passportIssueDate"),
      },
      {
        // Ngày hết hạn hộ chiếu
        name: "passportExpiryDate",
        label: t("employee.passportExpiryDate"),
        type: "datepicker",
        required: false,
        placeholder: t("employee.placeholder.passportExpiryDate"),
      },
      {
        // Số Bảo hiểm xã hội
        name: "socialInsuranceNumber",
        label: t("employee.socialInsuranceNumber"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.socialInsuranceNumber"),
      },
      {
        // Số Bảo hiểm y tế
        name: "healthInsuranceNumber",
        label: t("employee.healthInsuranceNumber"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.healthInsuranceNumber"),
      },
      {
        // Số tài khoản ngân hàng
        name: "bankAccountNumber",
        label: t("employee.bankAccountNumber"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.bankAccountNumber"),
      },
      {
        // Tên ngân hàng
        name: "bankName",
        label: t("employee.bankName"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.bankName"),
      },
      {
        // Chi nhánh ngân hàng
        name: "bankBranch",
        label: t("employee.bankBranch"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.bankBranch"),
      },
      {
        // Chủ tài khoản ngân hàng
        name: "bankAccountHolder",
        label: t("employee.bankAccountHolder"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.bankAccountHolder"),
      },
      {
        // Mã số thuế cá nhân
        name: "taxCode",
        label: t("employee.taxCode"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.taxCode"),
      },
      {
        // Email công ty
        name: "companyEmail",
        label: t("employee.companyEmail"),
        type: "input",
        required: false,
        placeholder: t("employee.placeholder.companyEmail"),
      },
      {
        // Chi nhánh
        name: "branchId",
        label: t("employee.branch"),
        type: "select",
        options: [],
        required: false,
        placeholder: t("employee.placeholder.branch"),
      },
      {
        // Phòng ban
        name: "departmentId",
        label: t("employee.department"),
        type: "select",
        options: [],
        required: false,
        placeholder: t("employee.placeholder.department"),
      },
      {
        // Bộ phận
        name: "partId",
        label: t("employee.part"),
        type: "select",
        options: [],
        required: false,
        placeholder: t("employee.placeholder.part"),
      },
      {
        // Chức vụ mẫu
        name: "positionMasterId",
        label: t("employee.positionMaster"),
        type: "select",
        options: [],
        required: false,
        placeholder: t("employee.placeholder.positionMaster"),
      },
      {
        // Vị trí công việc
        name: "positionId",
        label: t("employee.position"),
        type: "select",
        options: [],
        required: false,
        placeholder: t("employee.placeholder.position"),
      },
      {
        // Cấp bậc
        name: "level",
        label: t("employee.level"),
        type: "select",
        required: true,
        options: getEnumOptions(enumData.EMPLOYEE_LEVEL, "enums.LEVEL", t),
        placeholder: t("employee.placeholder.level"),
      },
      {
        // Cách thức làm việc
        name: "workingMode",
        label: t("employee.workingMode"),
        type: "select",
        required: true,
        options: getEnumOptions(
          enumData.WORKING_MODEL,
          "enums.WORKING_MODEL",
          t
        ),
        placeholder: t("employee.placeholder.workingMode"),
      },
      {
        // Loại hợp đồng
        name: "contractType",
        label: t("employee.contractType"),
        type: "select",
        required: true,
        options: getEnumOptions(
          enumData.CONTRACT_TYPE,
          "enums.CONTRACTTYPE",
          t
        ),
        placeholder: t("employee.placeholder.contractType"),
      },
      {
        // Trạng thái thử việc
        name: "probationStatus",
        label: t("employee.probationStatus"),
        type: "select",
        required: true,
        options: getEnumOptions(
          enumData.PROBATION_STATUS,
          "enums.PROBATION_STATUS",
          t
        ),
        placeholder: t("employee.placeholder.probationStatus"),
      },
      {
        // Ngày bắt đầu thử việc
        name: "dateStartProbation",
        label: t("employee.dateStartProbation"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.dateStartProbation"),
      },
      {
        // Ngày kết thúc thử việc
        name: "dateEndProbation",
        label: t("employee.dateEndProbation"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.dateEndProbation"),
      },
      {
        // Ngày bắt đầu chính thức
        name: "dateStartOfficial",
        label: t("employee.dateStartOfficial"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.dateStartOfficial"),
      },
      {
        // Ngày gia nhập công ty
        name: "joinDate",
        label: t("employee.joinDate"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.joinDate"),
      },
      {
        // Ngày ký hợp đồng
        name: "contractSignDate",
        label: t("employee.contractSignDate"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.contractSignDate"),
      },
      {
        // Ngày kết thúc hợp đồng
        name: "contractEndDate",
        label: t("employee.contractEndDate"),
        type: "datepicker",
        required: true,
        placeholder: t("employee.placeholder.contractEndDate"),
      },
      {
        // Thời gian làm việc
        name: "workingDuration",
        label: t("employee.workingDuration"),
        type: "number",
        required: true,
        placeholder: t("employee.placeholder.workingDuration"),
      },
      {
        // Người liên hệ khẩn cấp - tên
        name: "emergencyContactName",
        label: t("employee.emergencyContactName"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.emergencyContactName"),
      },
      {
        // Người liên hệ khẩn cấp - quan hệ
        name: "emergencyContactRelation",
        label: t("employee.emergencyContactRelation"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.emergencyContactRelation"),
      },
      {
        // Người liên hệ khẩn cấp - số điện thoại
        name: "emergencyContactPhone",
        label: t("employee.emergencyContactPhone"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.emergencyContactPhone"),
      },
      {
        // Người liên hệ khẩn cấp - địa chỉ
        name: "emergencyContactAddress",
        label: t("employee.emergencyContactAddress"),
        type: "input",
        required: true,
        placeholder: t("employee.placeholder.emergencyContactAddress"),
      },
      {
        // Trạng thái nhân viên
        name: "status",
        label: t("employee.status"),
        type: "select",
        required: true,
        options: getEnumOptions(enumData.EMPLOYEE_STATUS, "enums.STATUS", t),
        placeholder: t("employee.placeholder.status"),
      },
      {
        // Vai trò
        name: "roleIds",
        label: t("employee.roles"),
        type: "multiselect",
        required: true,
        options:
          roleOptions?.map((role) => ({
            id: role.id,
            name: role.name,
            value: role.id,
          })) || [],
        placeholder: t("employee.placeholder.roles"),
      },
      {
        name: "avatar",
        label: t("employee.avatar"),
        type: "image",
        isSingle: true,
        required: false,
        gridColumn: "span 3",
      },
    ];
  }, [isEdit, roleOptions, t]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
      goBack();
    } else {
      onCreateEmployee(values);
      goBack();
    }
  };

  const goBack = () => {
    router.back();
  };

  const pageTitle =
    title || (isEdit ? t("employee.editTitle") : t("employee.addTitle"));

  return (
    <BaseView>
      <FormCustom
        title={pageTitle}
        showDivider={true}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate || loadingRoles}
        onSubmit={handleSubmit}
        onCancel={onCancel || goBack}
        submitText={t("common.save")}
        cancelText={t("common.cancel")}
        gap="20px"
        gridColumns={3}
      />
    </BaseView>
  );
}

export default AddEmployeePage;
