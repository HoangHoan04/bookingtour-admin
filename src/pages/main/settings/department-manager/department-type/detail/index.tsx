import ActionLog from "@/components/ui/ActionLog";
import BaseView from "@/components/ui/BaseView";
import GlobalLoading from "@/components/ui/Loading";
import StatusTag from "@/components/ui/StatusTag";
import Title from "@/components/ui/Title";
import type { DepartmentTypeDto } from "@/dto/department-type.dto";
import { useDepartmentTypeDetail } from "@/hooks/department-type";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { useParams } from "react-router-dom";

export default function DepartmentTypeDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useDepartmentTypeDetail(id);

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (!id || !data) {
    return (
      <div className="p-4">
        <Title>Loại phòng ban không tồn tại</Title>
        <Card className="mt-4">
          <div className="text-center text-red-600">
            Loại phòng ban với ID đã cho không tồn tại hoặc không thể tải dữ
            liệu.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <BaseView isLoading={false}>
      <Title>Xem chi tiết loại phòng ban</Title>
      <div className="card mt-4">
        <TabView>
          <TabPanel header="Chi tiết">
            <DetailView data={data} />
          </TabPanel>
          <TabPanel header="Lịch sử thao tác">
            <ActionLog functionType="DepartmentType" functionId={id} />
          </TabPanel>
        </TabView>
      </div>
    </BaseView>
  );
}

const DetailItem = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col p-2">
    <span className={`text-sm mb-1 block `}>{label}</span>
    {children ? (
      children
    ) : (
      <span className="text-lg font-bold ">{value ?? "---"}</span>
    )}
  </div>
);

const DetailView = ({ data }: { data: DepartmentTypeDto }) => {
  const router = useRouter();

  const cardHeader = (
    <div className={`text-xl font-bold p-5 pb-0 `}>
      I. Thông tin loại phòng ban
    </div>
  );

  return (
    <div className="py-4">
      <Card title={cardHeader} className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-8 px-4 pb-4">
          <DetailItem label="Mã phòng ban" value={data?.code} />
          <DetailItem label="Tên phòng ban" value={data?.name} />
          <DetailItem label="Mô tả" value={data?.description} />
          <DetailItem label="Trạng thái">
            <StatusTag
              className="w-24"
              severity={data?.isDeleted ? "danger" : "success"}
              value={data?.isDeleted ? "Ngưng hoạt động" : "Hoạt động"}
            />
          </DetailItem>
        </div>
      </Card>

      <div className="flex justify-center mt-6">
        <Button
          label="Thoát"
          severity="secondary"
          outlined
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
};
