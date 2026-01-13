import GlobalLoading from "@/components/ui/Loading";

import {
  useDepartmentTypeDetail,
  useUpdateDepartmentType,
} from "@/hooks/department-type";
import { useParams } from "react-router-dom";
import AddDepartmentTypePage from "../add";

export default function EditDepartmentTypePage() {
  const { id } = useParams();

  const { data: customerTypeData, isLoading } = useDepartmentTypeDetail(
    id as string
  );
  const { onUpdateDepartmentType, isLoading: isLoadingUpdate } =
    useUpdateDepartmentType();

  const handleUpdate = (values: any) => {
    onUpdateDepartmentType({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddDepartmentTypePage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa loại phòng ban"
          initData={customerTypeData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
