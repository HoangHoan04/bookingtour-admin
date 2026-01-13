import GlobalLoading from "@/components/ui/Loading";
import { useBranchDetail, useUpdateBranch } from "@/hooks/branch";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import AddBranchPage from "../add";

function EditBranchPage() {
  const { id } = useParams();
  const { data: branchData, isLoading } = useBranchDetail(id);
  const { onUpdateBranch, isLoading: isLoadingUpdate } = useUpdateBranch();

  const transformedData = useMemo(() => {
    if (!branchData) return undefined;

    const partMasterIds =
      branchData.branchPartMasters?.map((bpm: any) => bpm.partMasterId) || [];

    return {
      ...branchData,
      partMasterIds,
    };
  }, [branchData]);

  const handleUpdate = (values: any) => {
    onUpdateBranch({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddBranchPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa chi nhánh"
          initData={transformedData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditBranchPage;
