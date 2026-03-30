import { useParams } from "react-router-dom";
import { useDestinationDetail } from "@/hooks/destination";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import { formatDate } from "@/common/helpers/format";

export default function DetailDestinationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: destination, isLoading } = useDestinationDetail(id);

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "NEW":
        return "info";
      case "ACTIVE":
        return "success";
      case "HIDDEN":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex flex-row justify-between items-center mb-6">
        <Title>Chi tiết điểm đến</Title>
        {destination && (
          <Tag
            value={destination.status}
            severity={getStatusSeverity(destination.status)}
            className="px-4 py-1"
          />
        )}
      </div>

      <TabView>
        <TabPanel header="Thông tin chung" leftIcon="pi pi-map mr-2">
          {destination && <DestinationDetailView data={destination} />}
        </TabPanel>
        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="Destination" functionId={id} />
        </TabPanel>
      </TabView>
    </BaseView>
  );
}

const DestinationDetailView = ({ data }: { data: any }) => {
  return (
    <div className="p-0 lg:p-4 animate-in fade-in duration-500 bg-[#262626]">
      <div className="border rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
        {/* CỘT TRÁI: TỔNG QUAN */}
        <div className="w-full lg:w-1/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r ">
          <div className="flex items-center gap-4 mb-8">
            <div className="shrink-0 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg ">
              <i className="pi pi-map-marker text-3xl text-white"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight">{data.name}</h2>
              <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {data.code}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <StatCard
              label="Lượt xem"
              value={data.viewCount || 0}
              icon="pi-eye"
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              label="Đánh giá"
              value={`${data.rating}/5`}
              icon="pi-star-fill"
              bgColor="bg-amber-50"
              textColor="text-amber-700"
            />
            <StatCard
              label="Đang phục vụ"
              value={data.touringCount || 0}
              icon="pi-send"
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Vị trí & Khí hậu
            </h4>
            <DetailItem label="Quốc gia" value={data.country} icon="pi-globe" />
            <DetailItem
              label="Vùng miền"
              value={data.region}
              icon="pi-directions"
            />
            <DetailItem
              label="Nhiệt độ TB"
              value={
                data.averageTemperature ? `${data.averageTemperature}°C` : "---"
              }
              icon="pi-cloud"
            />
            <DetailItem
              label="Mùa đẹp nhất"
              value={
                data.bestTimeToVisit ? `Tháng ${data.bestTimeToVisit}` : "---"
              }
              icon="pi-sun"
            />
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT */}
        <div className="w-full lg:w-2/3 p-6 lg:p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tọa độ */}
            <div className="flex-1 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tọa độ địa lý
              </h4>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100">
                <div className="flex-1 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">
                    Vĩ độ (Lat)
                  </span>
                  <span className="font-mono font-bold ">
                    {data.latitude || "---"}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex-1 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase mb-1">
                    Kinh độ (Long)
                  </span>
                  <span className="font-mono font-bold ">
                    {data.longitude || "---"}
                  </span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="flex-1 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Thông tin hệ thống
              </h4>
              <div className="space-y-2 text-sm  border border-slate-100 p-3.5 rounded-xl">
                <div className="flex justify-between">
                  <span className="">Ngày tạo:</span>
                  <span className="font-medium ">
                    {formatDate(data.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Cập nhật:</span>
                  <span className="font-medium ">
                    {formatDate(data.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="space-y-4">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Mô tả điểm đến
            </h4>
            <div className="leading-relaxed p-5 rounded-2xl border border-slate-100 italic font-light">
              {data.description || "Chưa có mô tả chi tiết cho điểm đến này."}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Hoạt động phổ biến
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.popularActivities ? (
                data.popularActivities
                  .split(",")
                  .map((act: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:border-blue-300 transition-colors cursor-default"
                    >
                      {act.trim()}
                    </span>
                  ))
              ) : (
                <span className="text-slate-400 italic text-sm">
                  Chưa cập nhật hoạt động.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, bgColor, textColor }: any) => (
  <div
    className={`flex items-center p-4 rounded-xl ${bgColor} transition-transform hover:scale-[1.02] duration-200`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-sm`}
    >
      <i className={`pi ${icon} ${textColor}`}></i>
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
        {label}
      </span>
      <span className={`text-lg font-black ${textColor}`}>{value}</span>
    </div>
  </div>
);

const DetailItem = ({ label, value, icon }: any) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-2 text-slate-500">
      <i className={`pi ${icon} text-[10px]`}></i>
      <span className="text-xs font-medium uppercase tracking-tight">
        {label}
      </span>
    </div>
    <span className="font-bold text-sm">{value || "---"}</span>
  </div>
);
