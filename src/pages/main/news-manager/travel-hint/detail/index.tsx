import { useParams } from "react-router-dom";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import StatusTag from "@/components/ui/StatusTag";
import { useTravelHintDetail } from "@/hooks/travel-hint";
import { formatDateTime } from "@/common/helpers/format";

export default function DetailTravelHintPage() {
  const { id } = useParams<{ id: string }>();
  const { data: travelHint, isLoading } = useTravelHintDetail(id);
  if (!travelHint && !isLoading)
    return <BaseView>Không tìm thấy cẩm nang</BaseView>;

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "DRAFT":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <BaseView isLoading={isLoading}>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-center items-center gap-3">
            <Title>Chi tiết địa điểm gợi ý</Title>
            <StatusTag
              severity={getStatusSeverity(travelHint?.status || "")}
              value={travelHint?.status || "NEW"}
            />
          </div>
        </div>
      </div>

      <TabView>
        <TabPanel header="Thông tin gợi ý" leftIcon="pi pi-map mr-2">
          {travelHint && <TravelHintContent data={travelHint} />}
        </TabPanel>

        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="TravelHint" functionId={id} />
        </TabPanel>
      </TabView>
    </BaseView>
  );
}

const TravelHintContent = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-10 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <div className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="w-full h-96 md:h-96 overflow-hidden">
            {data.images && data.images.length > 0 ? (
              <img
                src={data.images[0].fileUrl}
                alt={data.locationName}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <i className="pi pi-image text-5xl mb-2"></i>
                <span>Chưa có hình ảnh</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Tag
                value={`Tháng ${data.month}`}
                severity="info"
                className="bg-blue-50 text-blue-700 border-blue-100 text-lg w-32 h-14"
              />
              <Tag
                value={data.type === "DOMESTIC" ? "Trong nước" : "Quốc tế"}
                severity="warning"
                className="bg-blue-50 text-blue-700 border-blue-100 text-lg w-32 h-14"
              />
              {data.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className=" text-sm flex justify-center items-center font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded w-32 h-14"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-black mb-6">{data.locationName}</h1>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Tại sao nên đi?
                </h4>
                <div className="p-4 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-xl text-slate-700 leading-relaxed italic">
                  {data.reason || "Chưa có lý do gợi ý"}
                </div>
              </div>

              <Divider />

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Mô tả chi tiết
                </h4>
                <div className="text-slate-600 leading-relaxed">
                  {data.description || "Chưa có mô tả chi tiết."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAP & COORDINATES BOX */}
        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest">
            <i className="pi pi-map-marker text-blue-500"></i> Vị trí địa lý
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <SidebarItem
                label="Quốc gia"
                value={data.country}
                icon="pi-globe"
              />
              <SidebarItem
                label="Thành phố"
                value={data.city}
                icon="pi-building"
              />
            </div>
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-around">
              <div className="text-center">
                <span className="block text-[10px]font-bold">Vĩ độ</span>
                <span className="font-mono text-sm font-bold text-blue-600">
                  {data.latitude}
                </span>
              </div>
              <Divider layout="vertical" />
              <div className="text-center">
                <span className="block text-[10px] font-bold">Kinh độ</span>
                <span className="font-mono text-sm font-bold text-blue-600">
                  {data.longitude}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SIDEBAR (Chiếm 1/3) */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Thông tin hệ thống
          </h4>
          <div className="space-y-4">
            <SidebarItem
              label="Ngày tạo"
              value={formatDateTime(data.createdAt)}
              icon="pi-calendar"
            />
            <SidebarItem
              label="Cập nhật cuối"
              value={formatDateTime(data.updatedAt)}
              icon="pi-sync"
            />
          </div>
        </div>

        {/* THẺ TRẠNG THÁI HIỂN THỊ */}
        <div
          className={`p-6 rounded-2xl border flex flex-col items-center gap-3 shadow-sm ${data.isDeleted ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"}`}
        >
          <i
            className={`pi ${data.isDeleted ? "pi-ban text-rose-500" : "pi-check-circle text-emerald-500"} text-3xl`}
          ></i>
          <div className="text-center">
            <span
              className={`block font-black text-sm uppercase ${data.isDeleted ? "text-rose-700" : "text-emerald-700"}`}
            >
              {data.isDeleted ? "Đã ngừng hoạt động" : "Đang hoạt động"}
            </span>
            <p className="text-[10px] text-slate-500 m-0 mt-1">
              Dữ liệu này đang được{" "}
              {data.isDeleted ? "ẩn khỏi" : "hiển thị trên"} ứng dụng khách hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ label, value, icon }: any) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <i className={`pi ${icon} text-xs text-blue-400`}></i>
      <span className="text-sm font-semibold">{value || "---"}</span>
    </div>
  </div>
);
