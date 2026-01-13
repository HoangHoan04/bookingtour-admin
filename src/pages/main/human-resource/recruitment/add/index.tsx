import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import { useTranslation } from "@/context/TranslationContext";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddRecruitmentPage({
  initData,
  isEdit = false,
  handleUpdate,
  title,
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: any;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const formFields = useMemo((): FormField[] => {
    return [
      {
        // Mã
        name: "code",
        label: t("Recruitment.code"),
        type: "input",
        required: true,
        placeholder: t("Recruitment.placeholder.code"),
        disabled: isEdit,
      },
      {
        // Họ nhân viên
        name: "lastName",
        label: t("Recruitment.lastName"),
        type: "input",
        required: true,
        placeholder: t("Recruitment.placeholder.lastName"),
      },
      {
        // Tên nhân viên
        name: "firstName",
        label: t("Recruitment.firstName"),
        type: "input",
        required: true,
        placeholder: t("Recruitment.placeholder.firstName"),
      },
    ];
  }, [isEdit, t]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
      goBack();
    } else {
      goBack();
    }
  };

  const goBack = () => {
    router.back();
  };

  const pageTitle =
    title || (isEdit ? t("Recruitment.editTitle") : t("Recruitment.addTitle"));

  return (
    <BaseView>
      <FormCustom
        title={pageTitle}
        showDivider={true}
        fields={formFields}
        initialValues={initData}
        loading={isLoadingUpdate}
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

export default AddRecruitmentPage;
