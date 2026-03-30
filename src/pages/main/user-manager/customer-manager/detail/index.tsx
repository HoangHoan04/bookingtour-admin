import { useParams } from "react-router-dom";
import { useCustomerDetail } from "@/hooks/customer";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview"; // Import đúng từ PrimeReact
import type { CustomerDto } from "@/dto/customer.dto";
import BaseView from "@/components/ui/BaseView";
import Title from "@/components/ui/Title";
import ActionLog from "@/components/ui/ActionLog";
import { Tag } from "primereact/tag";
import { formatDate } from "@/common/helpers/format";

export default function DetailCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomerDetail(id);

  return (
    <BaseView isLoading={isLoading}>
      <div className="flex justify-between items-center mb-4">
        <Title>Xem chi tiết khách hàng</Title>
      </div>

      <TabView>
        <TabPanel header="Chi tiết" leftIcon="pi pi-user mr-2">
          {customer && <DetailView data={customer} />}
        </TabPanel>
        <TabPanel header="Lịch sử thao tác" leftIcon="pi pi-history mr-2">
          <ActionLog functionType="Customer" functionId={id} />
        </TabPanel>
      </TabView>
    </BaseView>
  );
}
const DetailView = ({ data }: { data: CustomerDto }) => {
  return (
    <div className="p-3 mx-auto bg-[#262626]">
      <div className="p-5 shadow-1-xl">
        <div className="flex">
          {/* PHẦN BÊN TRÁI: AVATAR & INFO CƠ BẢN */}
          <div className="flex flex-col w-1/3 items-center text-center border-right-none md:border-right-1">
            <div className="w-20 h-20 flex justify-center items-center border-circle overflow-hidden border-2 border-blue-500 shadow-2 mb-3">
              {data.avatar?.[0]?.fileUrl ? (
                <img
                  src={data.avatar[0].fileUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="pi pi-user text-6xl text-center text-blue-500"></i>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-900 mb-1">{data.name}</h2>
            <p className="text-600 font-medium mb-3">{data.code}</p>

            <div className="w-full px-3">
              <div className="flex items-center gap-2 mb-2 p-2 rounded-2xl bg-blue-50 text-blue-700">
                <i className="pi pi-envelope"></i>
                <span className="text-sm font-semibold">{data.email}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-green-50 text-green-700">
                <i className="pi pi-phone"></i>
                <span className="text-sm font-semibold">{data.phone}</span>
              </div>
            </div>
          </div>

          {/* PHẦN BÊN PHẢI: CHI TIẾT */}
          <div className="flex flex-col w-2/3 pl-0 md:pl-5">
            {/* Group 1: Thông tin cá nhân */}
            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-id-card text-2xl text-blue-500"></i>
              <span className="text-xl font-bold text-900">
                Thông tin cá nhân
              </span>
            </div>

            <div className="flex flex-col mb-4">
              <div className="flex flex-wrap items-start mb-3">
                <DetailItem
                  label="Giới tính"
                  value={data.gender === "male" ? "Nam" : "Nữ"}
                  icon="pi-user"
                />
                <DetailItem
                  label="Ngày sinh"
                  value={formatDate(data.birthday)}
                  icon="pi-calendar"
                />
                <DetailItem
                  label="Số CMND/CCCD"
                  value={data.identityCard}
                  icon="pi-copy"
                />
                <DetailItem
                  label="Số hộ chiếu"
                  value={data.passportNumber}
                  icon="pi-map"
                />
              </div>

              <div className="flex flex-wrap items-start">
                <DetailItem
                  label="Quốc tịch"
                  value={data.nationality || "Việt Nam"}
                  icon="pi-globe"
                />
                <DetailItem
                  label="Địa chỉ"
                  value={data.address}
                  icon="pi-map-marker"
                />
              </div>
            </div>

            <Divider />

            {/* Group 2: Tài khoản hệ thống */}
            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-user text-2xl text-purple-500"></i>
              <span className="text-xl font-bold text-900">
                Tài khoản hệ thống
              </span>
            </div>

            <div className="flex flex-wrap items-start mb-3">
              <DetailItem
                label="Tên đăng nhập"
                value={data.user?.username}
                icon="pi-at"
              />
              <DetailItem
                label="Ngày tạo"
                value={
                  data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                    : "---"
                }
                icon="pi-plus-circle"
              />
              <DetailItem
                label="Đăng nhập cuối"
                value={
                  data.user?.lastLogin
                    ? new Date(data.user.lastLogin).toLocaleString("vi-VN")
                    : "Chưa từng"
                }
                icon="pi-sign-in"
              />
              <div className="flex flex-col gap-1 mb-3">
                <span className="text-500 font-medium text-sm">
                  Trạng thái xác thực
                </span>
                <div className="mt-1">
                  {data.user?.isVerified ? (
                    <Tag
                      severity="success"
                      value="Đã xác thực"
                      icon="pi pi-check"
                    />
                  ) : (
                    <Tag
                      severity="warning"
                      value="Chờ xác thực"
                      icon="pi pi-info-circle"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: string;
}) => (
  <div className="flex flex-col gap-1 mb-3 mr-15">
    <span className="text-500 font-medium text-sm">
      <i className={`pi ${icon} text-blue-300 mr-2`}></i>
      {label}
    </span>
    <div className="flex items-center gap-2">
      <span className="text-900 font-semibold">{value || "---"}</span>
    </div>
  </div>
);
