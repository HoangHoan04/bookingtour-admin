import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { PositionMasterDto } from "@/dto/position-master.dto";
import { useCreatePositionMaster } from "@/hooks/position-master";
import { useRoleSelectBox } from "@/hooks/role";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddPositionMasterPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới nhân viên",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: PositionMasterDto;
  isEdit?: boolean;
  handleUpdate?: (data: PositionMasterDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreatePositionMaster } = useCreatePositionMaster();
  const { data: roleOptions, isLoading: loadingRoles } = useRoleSelectBox();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã nhân viên",
        type: "input",
        required: true,
        placeholder: "Nhập mã nhân viên",
        disabled: isEdit,
      },
      {
        name: "lastName",
        label: "Họ ",
        type: "input",
        required: true,
        placeholder: "Nhập họ ",
      },
      {
        name: "firstName",
        label: "Tên",
        type: "input",
        required: true,
        placeholder: "Nhập tên",
      },
      {
        name: "gender",
        label: "Giới tính",
        type: "select",
        required: true,
        options: Object.values(enumData.GENDER || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn giới tính",
      },

      {
        name: "birthday",
        label: "Ngày sinh",
        type: "datepicker",
        required: true,
        placeholder: "Chọn ngày sinh",
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        required: true,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "email",
        label: "Email cá nhân",
        type: "input",
        required: true,
        placeholder: "Nhập email cá nhân",
      },

      {
        name: "positionId",
        label: "Chức vụ",
        type: "select",
        options: [],
        required: false,
        placeholder: "Chọn chức vụ",
      },
      {
        name: "roleIds",
        label: "Vai trò",
        type: "multiselect",
        required: true,
        options:
          roleOptions?.map((role) => ({
            id: role.id,
            name: role.name,
            value: role.id,
          })) || [],
        placeholder: "Chọn vai trò",
      },
      {
        name: "avatar",
        label: "Hình ảnh đại diện",
        type: "image",
        isSingle: true,
        required: false,
        gridColumn: "span 3",
      },
    ];
  }, [isEdit, roleOptions]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreatePositionMaster(values);
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
        loading={isLoading || isLoadingUpdate || loadingRoles}
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

export default AddPositionMasterPage;
