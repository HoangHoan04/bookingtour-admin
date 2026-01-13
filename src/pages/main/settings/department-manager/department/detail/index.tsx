import { enumData } from "@/common/enums/enum";
import ActionLog from "@/components/ui/ActionLog";
import BaseView from "@/components/ui/BaseView";
import GlobalLoading from "@/components/ui/Loading";
import StatusTag from "@/components/ui/StatusTag";
import Title from "@/components/ui/Title";
import type { DepartmentDto } from "@/dto/department.dto";
import { useDepartmentDetail } from "@/hooks/department";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OrganizationChart } from "primereact/organizationchart";
import { TabPanel, TabView } from "primereact/tabview";
import { Tag } from "primereact/tag";
import React from "react";
import { useParams } from "react-router-dom";

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useDepartmentDetail(id);

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (!id || !data) {
    return (
      <div className="p-4">
        <Title>Phòng ban không tồn tại</Title>
        <Card className="mt-4">
          <div className="text-center text-red-600">
            Phòng ban với ID đã cho không tồn tại hoặc không thể tải dữ liệu.
          </div>
        </Card>
      </div>
    );
  }

  const hasChildDepartments =
    Array.isArray(data?.childDepartments) && data.childDepartments.length > 0;

  return (
    <BaseView isLoading={false}>
      <Title>Xem chi tiết phòng ban</Title>
      <div className="card mt-4">
        <TabView>
          <TabPanel header="Chi tiết" leftIcon="pi pi-info-circle mr-2">
            <DetailView data={data} />
          </TabPanel>

          {hasChildDepartments && (
            <TabPanel header="Sơ đồ tổ chức" leftIcon="pi pi-sitemap mr-2">
              <DepartmentTreeView data={data} />
            </TabPanel>
          )}

          <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
            <ActionLog functionType="Department" functionId={id} />
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
  <div className="col-span-12 md:col-span-4 p-4">
    <span className="block text-sm text-blue-800 font-medium mb-1">
      {label}
    </span>
    {children ? (
      children
    ) : (
      <span className="text-lg font-semibold text-gray-700">
        {value ?? "---"}
      </span>
    )}
  </div>
);

const DetailView = ({ data }: { data: DepartmentDto }) => {
  const router = useRouter();

  return (
    <div className="py-4">
      <Card
        title={
          <span className="text-blue-900 text-xl font-bold">
            I. Thông tin phòng ban
          </span>
        }
        className="shadow-sm mb-6"
      >
        <div className="grid grid-cols-12 gap-y-4">
          <DetailItem label="Mã phòng ban" value={data?.code} />
          <DetailItem label="Tên phòng ban" value={data?.name} />
          <DetailItem label="Giới hạn nhân viên" value={data?.limit || 0} />

          <DetailItem
            label="Loại phòng ban"
            value={data?.departmentType?.name}
          />
          <DetailItem label="Công ty" value={data?.company?.name} />
          <DetailItem label="Chi nhánh" value={data?.branch?.name} />

          <DetailItem
            label="Phòng ban cha"
            value={data?.parentDepartment?.name}
          />
          <DetailItem
            label="Số lượng nhân viên"
            value={data?.employees?.length || 0}
          />
          <DetailItem
            label="Số lượng bộ phận"
            value={data?.parts?.length || 0}
          />

          <DetailItem
            label="Số lượng chức vụ"
            value={data?.positions?.length || 0}
          />
          <DetailItem
            label="Số phòng ban con"
            value={data?.childDepartments?.length || 0}
          />

          <DetailItem label="Trạng thái">
            <StatusTag
              severity={data.isDeleted ? "danger" : "success"}
              value={
                data.isDeleted
                  ? enumData.STATUS_FILTER.INACTIVE.name
                  : enumData.STATUS_FILTER.ACTIVE.name
              }
            />
          </DetailItem>

          {data?.description && (
            <div className="col-span-12 p-4">
              <span className="block text-sm text-blue-800 font-medium mb-1">
                Mô tả
              </span>
              <p className="text-base text-gray-700 whitespace-pre-wrap">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center mt-6">
        <Button
          label="Đóng"
          icon="pi pi-times-circle"
          className="p-button-danger rounded-2xl"
          style={{ height: 30, fontSize: 13 }}
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
};

const DepartmentTreeView = ({ data }: { data: any }) => {
  if (!data) return null;

  const convertToTreeNode = (node: any): any => {
    return {
      expanded: true,
      data: {
        id: node.id,
        name: node.name,
        code: node.code,
        limit: node.limit,
        employeeCount: node.employees?.length || 0,
        statusName: node.isDeleted
          ? enumData.STATUS_FILTER.INACTIVE.name
          : enumData.STATUS_FILTER.ACTIVE.name,
        statusColor: node.isDeleted ? "#dc2626" : "#16a34a",
        isRoot: node.id === data.id,
      },
      children: Array.isArray(node.childDepartments)
        ? node.childDepartments.map((child: any) => convertToTreeNode(child))
        : [],
    };
  };

  const chartData = [convertToTreeNode(data)];

  const nodeTemplate = (node: any) => {
    const isRoot = node.data.isRoot;

    return (
      <div
        className={`
        relative p-4 rounded-xl shadow-md border-t-4 transition-all duration-300 hover:shadow-lg
        ${
          isRoot ? "border-t-blue-600 bg-white" : "border-t-gray-400 bg-gray-50"
        }
        flex flex-col items-center
      `}
        style={{
          minWidth: "220px",
          borderLeft: "1px solid #e5e7eb",
          borderRight: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          className={`
          w-12 h-12 rounded-full flex items-center justify-center mb-3
          ${isRoot ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}
        `}
        >
          <i
            className={`pi ${isRoot ? "pi-building" : "pi-sitemap"} text-xl`}
          ></i>
        </div>

        <div className="text-center w-full">
          <div className="font-bold text-gray-800 text-base leading-tight mb-1 uppercase tracking-wide">
            {node.data.name}
          </div>
          <div className="text-xs text-gray-500 mb-2">Mã: {node.data.code}</div>

          <div className="flex justify-center gap-2 mb-3 text-xs">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <i className="pi pi-users mr-1"></i>
              {node.data.employeeCount}/{node.data.limit || "∞"}
            </span>
          </div>
        </div>

        <Tag
          value={node.data.statusName}
          style={{
            backgroundColor: node.data.statusColor,
            fontSize: "10px",
            padding: "3px 10px",
            borderRadius: "12px",
          }}
        />

        {isRoot && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full uppercase font-bold shadow-sm">
            Phòng ban gốc
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full overflow-auto bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-inner"
      style={{ minHeight: "500px" }}
    >
      <style>{`
        .p-organizationchart .p-organizationchart-line-down {
          background: #cbd5e1;
          width: 2px;
        }
        .p-organizationchart .p-organizationchart-line-left,
        .p-organizationchart .p-organizationchart-line-right {
          border-color: #cbd5e1;
          border-width: 2px;
        }
        .p-organizationchart .p-organizationchart-line-top {
          border-color: #cbd5e1;
          border-width: 2px;
        }
        .p-organizationchart-node-content {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
        }
      `}</style>

      <div className="flex flex-col items-center">
        <div className="mb-6 text-slate-400 flex items-center gap-2">
          <i className="pi pi-info-circle"></i>
          <span className="text-sm italic">
            Sơ đồ cây phòng ban - Cuộn để xem chi tiết các nhánh
          </span>
        </div>

        <OrganizationChart value={chartData} nodeTemplate={nodeTemplate} />
      </div>
    </div>
  );
};
