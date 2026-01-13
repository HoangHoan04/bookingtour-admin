import BaseView from "@/components/ui/BaseView";
import PositionManager from "./position";
import PositionMasterManager from "./position-master";

export default function PositionManagerPage() {
  return (
    <BaseView
      tabs={[
        {
          key: "position",
          title: "Vị trí",
          content: <PositionManager />,
        },
        {
          key: "positionMaster",
          title: "Vị trí mẫu",
          content: <PositionMasterManager />,
        },
      ]}
    ></BaseView>
  );
}
