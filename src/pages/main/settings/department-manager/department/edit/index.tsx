import GlobalLoading from "@/components/ui/Loading";
import { useDepartmentDetail, useUpdateDepartment } from "@/hooks/department";
import { useParams } from "react-router-dom";
import AddDepartmentPage from "../add";

export default function EditDepartmentPage() {
  const { id } = useParams();

  const { data: customerData, isLoading } = useDepartmentDetail(id as string);
  const { onUpdateDepartment, isLoading: isLoadingUpdate } =
    useUpdateDepartment();

  const handleUpdate = (values: any) => {
    onUpdateDepartment({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddDepartmentPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa phòng ban"
          initData={customerData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
