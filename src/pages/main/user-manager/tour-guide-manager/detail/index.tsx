import { useParams } from "react-router-dom";
import { useTourGuideDetail } from "@/hooks/tour-guide";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import type { TourGuideDto } from "@/dto/tour-guide.dto";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import { formatDate } from "@/common/helpers/format";

export default function DetailTourGuidePage() {
  const { id } = useParams<{ id: string }>();
  const { data: tourGuide, isLoading } = useTourGuideDetail(id);

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "PENDING":
        return "warning";
      case "INACTIVE":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex justify-between items-center mb-4">
        <Title>Xem chi tiết hướng dẫn viên</Title>
        {tourGuide && (
          <Tag
            value={tourGuide.status}
            severity={getStatusSeverity(tourGuide.status)}
            className="px-3 py-1 text-sm"
          />
        )}
      </div>

      <TabView className="mt-2">
        <TabPanel header="Chi tiết" leftIcon="pi pi-user mr-2">
          {tourGuide && <DetailView data={tourGuide} />}
        </TabPanel>
        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="TourGuide" functionId={id} />
        </TabPanel>
      </TabView>
    </BaseView>
  );
}

const DetailView = ({ data }: { data: TourGuideDto }) => {
  return (
    <div className="p-0 md:p-3 mx-auto">
      <div className="surface-card p-4 md:p-5 shadow-1 border-round-xl">
        <div className="flex">
          {/* CỘT TRÁI: AVATAR & LIÊN HỆ NHANH */}
          <div className=" flex flex-col w-1/3 items-center text-center border-right-none md:border-right-1 surface-border py-4">
            <div className="w-20 h-20 border-circle overflow-hidden border-2 border-blue-500 shadow-2 mb-3">
              {data.avatar && data.avatar.length > 0 ? (
                <img
                  src={data.avatar[0].fileUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                  <i className="pi pi-user text-6xl text-blue-400"></i>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-900 mb-1">{data.name}</h2>
            <Tag value={data.code} severity="secondary" className="mb-4"></Tag>

            <div className="w-full px-3">
              <div className="flex  items-center gap-2 mb-2 p-2 bg-blue-50 border-round text-blue-700">
                <i className="pi pi-envelope text-sm"></i>
                <span className="text-xs font-semibold truncate">
                  {data.email}
                </span>
              </div>
              <div className="flex  items-center gap-2 p-2 bg-green-50 border-round text-green-700">
                <i className="pi pi-phone text-sm"></i>
                <span className="text-xs font-semibold">{data.phone}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-content-between text-xs">
                  <span className="text-500">Đánh giá:</span>
                  <span className="font-bold">
                    {data.averageRating || "0.00"} ⭐
                  </span>
                </div>
                <div className="flex justify-content-between text-xs">
                  <span className="text-500">Tour hoàn thành:</span>
                  <span className="font-bold">
                    {data.totalToursCompleted || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TẤT CẢ CHI TIẾT */}
          <div className="w-2/3">
            {/* GROUP 1: THÔNG TIN CÁ NHÂN */}
            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-id-card text-2xl text-blue-500"></i>
              <span className="text-xl font-bold text-900">
                Thông tin cá nhân
              </span>
            </div>
            <div className="flex flex-wrap">
              <DetailItem
                label="Giới tính"
                value={data.gender === "MALE" ? "Nam" : "Nữ"}
                icon="pi-user mr-2"
              />
              <DetailItem
                label="Ngày sinh"
                value={formatDate(data.birthday)}
                icon="pi-calendar mr-2"
              />
              <DetailItem
                label="Số CMND/CCCD"
                value={data.identityCard}
                icon="pi-copy mr-2"
              />

              <DetailItem
                label="Số hộ chiếu"
                value={data.passportNumber}
                icon="pi-map mr-2"
              />
              <DetailItem
                label="Quốc tịch"
                value={data.nationality}
                icon="pi-globe mr-2"
              />
              <DetailItem
                label="Địa chỉ"
                value={data.address}
                icon="pi-map-marker mr-2"
              />
            </div>

            <Divider />

            {/* GROUP 2: CHUYÊN MÔN & BẰNG CẤP */}
            <div className="flex items-center gap-2 mb-4 pt-2">
              <i className="pi pi-briefcase text-2xl text-orange-500"></i>
              <span className="text-xl font-bold text-900">
                Chuyên môn & Bằng cấp
              </span>
            </div>
            <div className="flex flex-wrap">
              <DetailItem
                label="Số thẻ HDV"
                value={data.licenseNumber}
                icon="pi-ticket"
              />
              <DetailItem
                label="Nơi cấp"
                value={data.licenseIssuedBy}
                icon="pi-building"
              />
              <DetailItem
                label="Nơi cấp"
                value={data.licenseIssuedBy}
                icon="pi-building"
              />

              <DetailItem
                label="Ngày cấp"
                value={formatDate(data.licenseIssuedDate)}
                icon="pi-calendar"
              />
              <DetailItem
                label="Ngày hết hạn"
                value={formatDate(data.licenseExpiryDate)}
                icon="pi-calendar-times"
              />
              <DetailItem
                label="Kinh nghiệm"
                value={
                  data.yearsOfExperience
                    ? `${data.yearsOfExperience} năm`
                    : "---"
                }
                icon="pi-clock"
              />
              <DetailItem
                label="Ngôn ngữ"
                value={data.languages?.join(", ")}
                icon="pi-language"
              />
              <div className="ml-3 mb-3">
                <span className="text-500 font-medium text-sm block mb-2">
                  Lĩnh vực chuyên sâu
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.specialties && data.specialties.length > 0
                    ? data.specialties.map((s, idx) => (
                        <Tag key={idx} value={s} severity="info" />
                      ))
                    : "---"}
                </div>
              </div>
            </div>

            <Divider />

            {/* GROUP 3: TÀI CHÍNH & NGÂN HÀNG */}
            <div className="flex items-center gap-2 mb-4 pt-2">
              <i className="pi pi-money-bill text-2xl text-green-500"></i>
              <span className="text-xl font-bold text-900">
                Tài chính & Ngân hàng
              </span>
            </div>
            <div className="flex flex-wrap">
              <DetailItem
                label="Lương cơ bản"
                value={data.baseSalary?.toLocaleString("vi-VN")}
                icon="pi-wallet"
              />
              <DetailItem
                label="Tỉ lệ hoa hồng"
                value={data.commissionRate ? `${data.commissionRate}%` : "---"}
                icon="pi-percentage"
              />
              <DetailItem
                label="Ngân hàng"
                value={data.bankName}
                icon="pi-building"
              />
              <DetailItem
                label="Số tài khoản"
                value={data.bankAccountNumber}
                icon="pi-credit-card"
              />
              <DetailItem
                label="Tên chủ tài khoản"
                value={data.bankAccountName}
                icon="pi-user"
              />
            </div>

            <Divider />

            {/* GROUP 4: TÀI KHOẢN HỆ THỐNG */}
            <div className="flex items-center gap-2 mb-4 pt-2">
              <i className="pi pi-shield text-2xl text-purple-500"></i>
              <span className="text-xl font-bold text-900">Hệ thống</span>
            </div>
            <div className="flex flex-wrap">
              <DetailItem
                label="Tên đăng nhập"
                value={data.user?.username}
                icon="pi-at"
              />
              <DetailItem
                label="Ngày tạo"
                value={formatDate(data.createdAt)}
                icon="pi-plus-circle"
              />
              <DetailItem
                label="Đăng nhập cuối"
                value={formatDate(data.user?.lastLogin)}
                icon="pi-sign-in"
              />
            </div>

            {/* TIỂU SỬ & GHI CHÚ */}
            {(data.shortBio || data.description) && (
              <div className="mt-5 p-4 surface-50 border-round-lg border-left-3 border-blue-500">
                <h4 className="text-sm font-bold mb-2 text-700 uppercase">
                  Tiểu sử & Ghi chú
                </h4>
                {data.shortBio && (
                  <p className="text-900 font-medium mb-2">{data.shortBio}</p>
                )}
                <p className="text-700 line-height-3 m-0 italic text-sm">
                  {data.description ? `"${data.description}"` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component helper cho layout item
const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon: string;
}) => (
  <div className={`flex flex-col gap-1 mb-7 ml-7`}>
    <span className="text-500 font-medium text-sm flex items-center">
      <i className={`pi ${icon} text-400 text-xs mr-2`}></i>
      {label}
    </span>
    <div className="flex  items-center gap-2">
      <span className="text-900 font-semibold">{value || "---"}</span>
    </div>
  </div>
);
