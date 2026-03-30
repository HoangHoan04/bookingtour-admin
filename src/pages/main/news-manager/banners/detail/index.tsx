import { useParams } from "react-router-dom";
import { useBannerDetail } from "@/hooks/banner";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import { formatDateTime } from "@/common/helpers/format";

const BANNER_STATUS = {
  FRESHLY_CREATED: {
    code: "FRESHLY_CREATED",
    name: "Mới tạo",
    severity: "info",
  },
  IN_EFFECT: { code: "IN_EFFECT", name: "Đang hiệu lực", severity: "success" },
  EXPIRED: { code: "EXPIRED", name: "Hết hiệu lực", severity: "danger" },
};

export default function DetailBannerPage() {
  const { id } = useParams<{ id: string }>();
  const { data: banner, isLoading } = useBannerDetail(id);
  const getStatusInfo = (status: string) => {
    return (
      (BANNER_STATUS as any)[status] || { name: status, severity: "secondary" }
    );
  };

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Title>Chi tiết Banner</Title>
        {banner && (
          <div className="flex justify-center items-center gap-2">
            <Tag
              value={banner.isVisible ? "Đang hoạt động" : "Đang ẩn"}
              severity={banner.isVisible ? "success" : "danger"}
              icon={banner.isVisible ? "pi pi-eye" : "pi pi-eye-slash"}
              className="px-3 py-1 w-32"
            />
            <Tag
              value={getStatusInfo(banner.status).name}
              severity={getStatusInfo(banner.status).severity}
              className="px-3 py-1 w-32"
            />
          </div>
        )}
      </div>

      <TabView>
        <TabPanel header="Thông tin banner" leftIcon="pi pi-image mr-2">
          {banner && <BannerDetailView data={banner} />}
        </TabPanel>
        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="Banner" functionId={id} />
        </TabPanel>
      </TabView>
    </BaseView>
  );
}

const BannerDetailView = ({ data }: { data: any }) => {
  return (
    <div className="p-0 lg:p-4 animate-in fade-in duration-500 bg-[#262626]">
      <div className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* PHẦN 1: HÌNH ẢNH BANNER (PREVIEW) */}
        <div
          className="w-full relative group overflow-hidden"
          style={{ minHeight: "300px", maxHeight: "450px" }}
        >
          {data.image?.fileUrl ? (
            <img
              src={data.image.fileUrl}
              alt={data.title}
              className="w-full h-full object-contain mx-auto"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <i className="pi pi-image text-6xl mb-2"></i>
              <span>Không có hình ảnh</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Tag value={data.type} severity="warning" className="shadow-lg" />
          </div>
        </div>

        {/* CHI TIẾT NỘI DUNG */}
        <div className="flex flex-col lg:flex-row w-full">
          {/* Nội dung chính */}
          <div className="flex-1 p-6 md:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                Tiêu đề quảng bá
              </span>
              <h2 className="text-2xl font-bold leading-tight">
                {data.title || "Chưa đặt tiêu đề"}
              </h2>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest block">
                Đường dẫn liên kết
              </span>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:bg-blue-50 transition-colors">
                <i className="pi pi-link text-blue-500"></i>
                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-600"
                >
                  {data.url}
                </a>
                <i className="pi pi-external-link text-xs text-slate-300 ml-auto"></i>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeItem
                label="Bắt đầu hiệu lực"
                value={formatDateTime(data.effectiveStartDate)}
                icon="pi-calendar-plus"
                color="emerald"
              />
              <TimeItem
                label="Kết thúc hiệu lực"
                value={formatDateTime(data.effectiveEndDate)}
                icon="pi-calendar-minus"
                color="rose"
              />
            </div>
          </div>

          {/* Cấu hình hiển thị Side */}
          <div className="w-full lg:w-80 p-6 md:p-8 space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Cấu hình hệ thống
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-500 font-medium">
                    Thứ tự hiển thị
                  </span>
                  <span className="text-xl font-black text-blue-600">
                    #{data.displayOrder}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-500 font-medium">
                    Phân loại
                  </span>
                  <Tag value={data.type} severity="info" />
                </div>
              </div>
            </div>

            <Divider />

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="">Tên tệp:</span>
                <span className="font-bold truncate ml-4 w-32 text-right">
                  {data.image?.fileName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="">Ngày tạo:</span>
                <span className="font-bold">
                  {formatDateTime(data.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeItem = ({ label, value, icon, color }: any) => (
  <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
    <div
      className={`w-10 h-10 bg-${color}-50 rounded-lg flex items-center justify-center text-${color}-600`}
    >
      <i className={`pi ${icon} text-lg`}></i>
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">
        {label}
      </span>
      <span className={`text-sm font-bold text-slate-800`}>
        {value || "---"}
      </span>
    </div>
  </div>
);
