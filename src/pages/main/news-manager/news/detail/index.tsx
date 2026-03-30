import { useParams } from "react-router-dom";
import { useNewDetail } from "@/hooks/new";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import { formatDateTime } from "@/common/helpers/format";

export default function DetailNewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: newDetail, isLoading } = useNewDetail(id);

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "FRESHLY_CREATED":
        return "info";
      case "PUBLISHED":
        return "success";
      case "ARCHIVED":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Title>Chi tiết bài viết</Title>
        {newDetail && (
          <div className="flex gap-2">
            <Tag
              value={newDetail.isVisible ? "Đang hiển thị" : "Đang ẩn"}
              severity={newDetail.isVisible ? "success" : "danger"}
              className="px-3"
            />
            <Tag
              value={newDetail.status}
              severity={getStatusSeverity(newDetail.status)}
              className="px-3"
            />
          </div>
        )}
      </div>

      <TabView>
        <TabPanel header="Nội dung bài viết" leftIcon="pi pi-file-edit mr-2">
          {newDetail && <NewDetailContent data={newDetail} />}
        </TabPanel>
        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="New" functionId={id} />
        </TabPanel>
      </TabView>
    </BaseView>
  );
}

const NewDetailContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-0 lg:p-4 animate-in fade-in duration-500 bg-[#262626]">
      {/* CỘT TRÁI: NỘI DUNG CHÍNH (Chiếm 2/3) */}
      <div className="flex-1 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Ảnh bìa bài viết */}
        <div className="w-full h-64 md:h-96 overflow-hidden ">
          {data.images && data.images.length > 0 ? (
            <img
              src={data.images[0].fileUrl}
              alt={data.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <i className="pi pi-image text-5xl mb-2"></i>
              <span>Không có ảnh đại diện</span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <Tag value={data.type} severity="warning" className="text-xs" />
            <span className="text-sm text-slate-400 font-mono">
              {data.code}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold  mb-6 leading-tight">
            {data.title}
          </h1>

          <Divider />

          {/* Render HTML Content từ Rich Text Editor */}
          <div
            className="prose prose-slate max-w-none 
              **:bg-transparent! 
              **:text-current! 
             dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN BỔ SUNG (Chiếm 1/3) */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {/* Card: Thông tin xuất bản */}
        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold  uppercase tracking-wider mb-4 flex items-center gap-2">
            <i className="pi pi-info-circle text-blue-500"></i>
            Thông tin xuất bản
          </h4>
          <div className="space-y-4">
            <InfoRow label="Thứ hạng (Rank)" value={`#${data.rank}`} />
            <InfoRow
              label="Ngày bắt đầu"
              value={formatDateTime(data.effectiveStartDate)}
            />
            <InfoRow
              label="Ngày kết thúc"
              value={formatDateTime(data.effectiveEndDate)}
            />
          </div>
        </div>

        {/* Card: Thông tin hệ thống */}
        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Hệ thống
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Người tạo
              </span>
              <span className="text-sm font-medium">
                {data.createdBy || "Admin"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Ngày tạo
              </span>
              <span className="text-sm font-medium">
                {formatDateTime(data.createdAt)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Cập nhật cuối
              </span>
              <span className="text-sm font-medium">
                {formatDateTime(data.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder cho Thumbnail list nếu có nhiều ảnh */}
        {data.images && data.images.length > 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold  mb-4">Hình ảnh đính kèm khác</h4>
            <div className="grid grid-cols-3 gap-2">
              {data.images.slice(1).map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg overflow-hidden border border-slate-100"
                >
                  <img
                    src={img.fileUrl}
                    className="w-full h-full object-cover"
                    alt="attachment"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-500 font-medium">{label}</span>
    <span className="text-sm font-bold">{value || "---"}</span>
  </div>
);
