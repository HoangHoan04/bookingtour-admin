import GlobalLoading from "@/components/ui/Loading";
import { useTourDetail } from "@/hooks/tour-detail";
import { useParams } from "react-router-dom";
import { useUpdateTourDetail } from "@/hooks/tour-detail";
import AddTourDetailPage from "../add";

function EditTourDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useTourDetail(id);
  const { onUpdateTourDetail, isLoading: isLoadingUpdate } =
    useUpdateTourDetail();

  const handleUpdate = (values: any) => {
    onUpdateTourDetail({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddTourDetailPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa tour chi tiết"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditTourDetailPage;
