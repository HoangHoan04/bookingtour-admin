import GlobalLoading from "@/components/ui/Loading";
import { usePartMasterDetail, useUpdatePartMaster } from "@/hooks/part-master";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import AddPartMasterPage from "../add";

function EditPartMasterPage() {
  const { id } = useParams();
  const { data: partMasterData, isLoading } = usePartMasterDetail(id);
  const { onUpdatePartMaster, isLoading: isLoadingUpdate } =
    useUpdatePartMaster();

  const transformedData = useMemo(() => {
    if (!partMasterData) return undefined;
    const branchIds =
      partMasterData.branchPartMasters?.map((bpm: any) => bpm.branchId) || [];

    return {
      ...partMasterData,
      branchIds,
    };
  }, [partMasterData]);

  const handleUpdate = (values: any) => {
    onUpdatePartMaster({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddPartMasterPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa bộ phận mẫu"
          initData={transformedData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditPartMasterPage;
