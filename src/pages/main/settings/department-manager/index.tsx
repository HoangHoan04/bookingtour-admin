import BaseView from "@/components/ui/BaseView";
import DepartmentPage from "./department";
import DepartmentTypePage from "./department-type";

export default function DepartmentManagerPage() {
  return (
    <BaseView
      tabs={[
        {
          key: "department",
          title: "Phòng ban",
          content: <DepartmentPage />,
        },
        {
          key: "departmentType",
          title: "Loại phòng ban",
          content: <DepartmentTypePage />,
        },
      ]}
    ></BaseView>
  );
}
