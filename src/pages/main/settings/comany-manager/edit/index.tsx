import GlobalLoading from "@/components/ui/Loading";
import { useCompanyDetail, useUpdateCompany } from "@/hooks/company";
import { useParams } from "react-router-dom";
import AddCompanyPage from "../add";

function EditCompanyPage() {
  const { id } = useParams();
  const { data: employeeData, isLoading } = useCompanyDetail(id);
  const { onUpdateCompany, isLoading: isLoadingUpdate } = useUpdateCompany();

  const handleUpdate = (values: any) => {
    onUpdateCompany({
      ...values,
      id,
    });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddCompanyPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa công ty"
          initData={employeeData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditCompanyPage;
