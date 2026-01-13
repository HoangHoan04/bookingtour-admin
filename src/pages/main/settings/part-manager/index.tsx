import BaseView from "@/components/ui/BaseView";
import PartManager from "./part";
import PartMasterManager from "./part-master";

export default function PartManagerPage() {
  return (
    <BaseView
      tabs={[
        {
          key: "part",
          title: "Bộ phận",
          content: <PartManager />,
        },
        {
          key: "partMaster",
          title: "Bộ phận mẫu",
          content: <PartMasterManager />,
        },
      ]}
    ></BaseView>
  );
}
