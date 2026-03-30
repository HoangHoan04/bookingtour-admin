import GlobalLoading from "@/components/ui/Loading";
import { useTourDetail, useUpdateTour } from "@/hooks/tour";
import { useParams } from "react-router-dom";
import AddTourPage from "../add";
import type { TourDto } from "@/dto/tour.dto";

function EditTourPage() {
  const { id } = useParams();
  const { data, isLoading } = useTourDetail(id);
  const { onUpdateTour, isLoading: isLoadingUpdate } = useUpdateTour();
  function formatText(input: string): string {
    return input
      .replace(/[{}"]/g, "")
      .split(",")
      .map((item) => item.trim())
      .join(", ");
  }

  const parseData: TourDto = {
    ...(data as TourDto),
    tags: data?.tags ? formatText(data.tags) : undefined,
  };

  const handleUpdate = (values: any) => {
    onUpdateTour({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddTourPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa tour"
          initData={parseData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditTourPage;
