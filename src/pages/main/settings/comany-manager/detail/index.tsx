import { enumData } from "@/common/enums/enum";
import { formatDate } from "@/common/helpers/format";
import ActionLog from "@/components/ui/ActionLog";
import BaseView from "@/components/ui/BaseView";
import DocumentList from "@/components/ui/DocumentFile";
import GlobalLoading from "@/components/ui/Loading";
import StatusTag from "@/components/ui/StatusTag";
import Title from "@/components/ui/Title";
import { useCompanyDetail } from "@/hooks/company";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { OrganizationChart } from "primereact/organizationchart";
import { TabPanel, TabView } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { useParams } from "react-router-dom";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useCompanyDetail(id);

  if (isLoading) return <GlobalLoading />;

  const hasChildCompanies =
    Array.isArray(data?.childCompanies) && data.childCompanies.length > 0;

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex justify-between items-center mb-4">
        <Title>Xem chi tiết công ty</Title>
      </div>

      <div className="card">
        <TabView>
          <TabPanel header="Chi tiết" leftIcon="pi pi-user mr-2">
            <DetailView data={data} refetch={refetch} />
          </TabPanel>

          {hasChildCompanies && (
            <TabPanel header="Sơ đồ tổ chức" leftIcon="pi pi-sitemap mr-2">
              <CompanyTreeView data={data} />
            </TabPanel>
          )}

          <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
            <ActionLog functionType="Company" functionId={id} />
          </TabPanel>
        </TabView>
      </div>
    </BaseView>
  );
}

const DetailView = ({ data }: { data: any; refetch?: () => void }) => {
  if (!data) return null;
  const logoSrc = Array.isArray(data?.logoUrl)
    ? data.logoUrl[0]?.fileUrl
    : data?.logoUrl?.fileUrl;
  const router = useRouter();

  return (
    <div className="py-4">
      <Card
        title={
          <span className="text-blue-900 text-xl font-bold">
            I. Thông tin công ty
          </span>
        }
        className="shadow-sm mb-6"
      >
        <div className="grid grid-cols-12 gap-y-4">
          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Mã công ty
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.code}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Tên công ty
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.name}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Địa chỉ
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.address}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Mã số thuế
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.taxCode}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Số điện thoại
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.phoneNumber}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Email
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.email}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Website
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.website}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Ngày thành lập
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {formatDate(data?.foundedDate)}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Người đại diện pháp luật
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.legalRepresentative}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Công ty mẹ
            </span>
            <span className="text-lg font-semibold text-gray-700">
              {data?.parentCompany?.name}
            </span>
          </div>

          <div className="col-span-12 md:col-span-4 p-4">
            <span className="block text-sm text-blue-800 font-medium mb-1">
              Trạng thái
            </span>
            <StatusTag
              severity={data.isDeleted ? "danger" : "success"}
              value={
                data.isDeleted
                  ? enumData.STATUS_FILTER.INACTIVE.name
                  : enumData.STATUS_FILTER.ACTIVE.name
              }
            />
          </div>
        </div>
      </Card>

      <Card className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="flex flex-col p-2">
            <span className="text-sm mb-2 block font-medium text-blue-800">
              Logo
            </span>
            <div className="flex justify-center md:justify-start">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt="Company Logo"
                  indicatorIcon={<i className="pi pi-search"></i>}
                  width="150"
                  preview
                  imageClassName="object-cover rounded-lg border border-gray-200"
                  imageStyle={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-400 italic"
                  style={{ width: "150px", height: "150px", fontSize: "13px" }}
                >
                  Không có ảnh
                </div>
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-col p-2 border-l border-gray-100">
            <span className="text-sm mb-3 block font-medium text-blue-800">
              Tài liệu đính kèm ({data?.documents?.length || 0})
            </span>
            <DocumentList documents={data?.documents} />
          </div>
        </div>
      </Card>

      <div className="mt-4 flex justify-center">
        <Button
          label={"Đóng"}
          icon="pi pi-times-circle"
          className="p-button-danger rounded-2xl"
          style={{ height: 30, fontSize: 13 }}
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
};

const CompanyTreeView = ({ data }: { data: any }) => {
  if (!data) return null;

  const convertToTreeNode = (node: any) => {
    return {
      expanded: true,
      data: {
        id: node.id,
        name: node.name,
        code: node.code,
        statusName: node.isDeleted
          ? enumData.STATUS_FILTER.INACTIVE.name
          : enumData.STATUS_FILTER.ACTIVE.name,
        statusColor: node.isDeleted ? "#dc2626" : "#16a34a",
        isRoot: node.id === data.id,
      },
      children: Array.isArray(node.childCompanies)
        ? node.childCompanies.map((child: any) => convertToTreeNode(child))
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
          minWidth: "200px",
          borderLeft: "1px solid #e5e7eb",
          borderRight: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          className={`
          w-10 h-10 rounded-full flex items-center justify-center mb-3
          ${isRoot ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}
        `}
        >
          <i
            className={`pi ${isRoot ? "pi-building" : "pi-sitemap"} text-lg`}
          ></i>
        </div>

        <div className="text-center">
          <div className="font-bold text-gray-800 text-base leading-tight mb-1 uppercase tracking-wide">
            Công ty {node.data.name}
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Mã công ty: {node.data.code}
          </div>
        </div>

        <Tag
          value={node.data.statusName || "Hoạt động"}
          style={{
            backgroundColor:
              node.data.statusColor || (isRoot ? "#2563eb" : "#64748b"),
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "12px",
          }}
        />

        {isRoot && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shadow-sm">
            Công ty cha
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
            Sử dụng chuột để cuộn xem các nhánh con
          </span>
        </div>

        <OrganizationChart value={chartData} nodeTemplate={nodeTemplate} />
      </div>
    </div>
  );
};
