import GlobalLoading from "@/components/ui/Loading";
import { useEmployeeDetail, useUpdateEmployee } from "@/hooks/employee";
import { useParams } from "react-router-dom";
import AddEmployeePage from "../add";

function EditEmployeePage() {
  const { id } = useParams();
  const { data: employeeData, isLoading } = useEmployeeDetail(id);
  const { onUpdateEmployee, isLoading: isLoadingUpdate } = useUpdateEmployee();

  const handleUpdate = (values: any) => {
    onUpdateEmployee({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddEmployeePage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa nhân viên"
          initData={employeeData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditEmployeePage;
