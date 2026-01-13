import GlobalLoading from "@/components/ui/Loading";
import { usePartDetail, useUpdatePart } from "@/hooks/part";
import { useParams } from "react-router-dom";
import AddPartPage from "../add";

function EditPartPage() {
  const { id } = useParams();
  const { data: partData, isLoading } = usePartDetail(id);
  const { onUpdatePart, isLoading: isLoadingUpdate } = useUpdatePart();

  const handleUpdate = (values: any) => {
    onUpdatePart({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddPartPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa bộ phận"
          initData={partData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditPartPage;
