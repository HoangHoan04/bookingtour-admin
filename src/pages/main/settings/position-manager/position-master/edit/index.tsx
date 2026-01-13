import GlobalLoading from "@/components/ui/Loading";
import {
  usePositionMasterDetail,
  useUpdatePositionMaster,
} from "@/hooks/position-master";
import { useParams } from "react-router-dom";
import AddPositionMasterPage from "../add";

function EditPositionMasterPage() {
  const { id } = useParams();
  const { data: employeeData, isLoading } = usePositionMasterDetail(id);
  const { onUpdatePositionMaster, isLoading: isLoadingUpdate } =
    useUpdatePositionMaster();

  const handleUpdate = (values: any) => {
    onUpdatePositionMaster({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddPositionMasterPage
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

export default EditPositionMasterPage;
