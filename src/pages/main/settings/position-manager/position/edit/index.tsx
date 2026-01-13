import GlobalLoading from "@/components/ui/Loading";
import { usePositionDetail, useUpdatePosition } from "@/hooks/position";
import { useParams } from "react-router-dom";
import AddPositionPage from "../add";

function EditPositionPage() {
  const { id } = useParams();
  const { data: employeeData, isLoading } = usePositionDetail(id);
  const { onUpdatePosition, isLoading: isLoadingUpdate } = useUpdatePosition();

  const handleUpdate = (values: any) => {
    onUpdatePosition({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddPositionPage
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

export default EditPositionPage;
