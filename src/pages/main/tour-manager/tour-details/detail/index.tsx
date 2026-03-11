import { ROUTES } from "@/common/constants/routes";
import { enumData } from "@/common/enums/enum";
import { formatDate } from "@/common/helpers/format";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import GlobalLoading from "@/components/ui/Loading";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import { useTourDetail } from "@/hooks/tour-detail";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useParams } from "react-router-dom";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="col-span-2 text-gray-900">{value || "-"}</span>
  </div>
);

export default function DetailTourDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: tourDetail, isLoading } = useTourDetail(id);

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (!tourDetail) {
    return (
      <BaseView>
        <Card>
          <div className="text-center py-5">
            <p className="text-xl text-gray-500 mb-4">
              Không tìm thấy chi tiết tour
            </p>
            <Button
              label="Quay lại"
              icon="pi pi-arrow-left"
              severity="secondary"
              onClick={() => router.back()}
            />
          </div>
        </Card>
      </BaseView>
    );
  }

  const statusName =
    Object.values(enumData.TOUR_STATUS).find(
      (status) => status.code === tourDetail.status,
    )?.name || tourDetail.status;

  return (
    <BaseView>
      <Card
        title={
          <div className="flex align-items-center justify-content-between">
            <span>Chi tiết tour</span>
            <div className="flex gap-2">
              <StatusTag
                severity={
                  tourDetail.status === enumData.TOUR_STATUS.ACTIVE.code
                    ? "success"
                    : "warning"
                }
                value={statusName}
              />
              <StatusTag
                severity={tourDetail.isDeleted ? "danger" : "success"}
                value={
                  tourDetail.isDeleted
                    ? enumData.STATUS_FILTER.INACTIVE.name
                    : enumData.STATUS_FILTER.ACTIVE.name
                }
              />
            </div>
          </div>
        }
      >
        <div className="mb-4">
          <RowActions
            actions={[
              {
                ...CommonActions.cancel(() => router.back()),
                label: "Quay lại",
              },
              {
                ...CommonActions.update(() =>
                  router.push(
                    ROUTES.MAIN.TOUR_MANAGER.children.TOUR_DETAIL_MANAGER.children.EDIT_TOUR_DETAIL.path.replace(
                      ":id",
                      tourDetail.id,
                    ),
                  ),
                ),
                label: "Chỉnh sửa",
                visible: !tourDetail.isDeleted,
              },
            ]}
            justify="start"
            gap="medium"
          />
        </div>

        <Divider />

        <Card title="Thông tin tour" className="shadow-sm">
          <div className="space-y-2">
            <InfoRow label="Mã chi tiết tour" value={tourDetail.code} />
            <InfoRow label="Mã Tour liên quan" value={tourDetail.tourId} />
            <InfoRow
              label="Địa điểm khởi hành"
              value={tourDetail.startLocation}
            />
            <InfoRow
              label="Ngày bắt đầu"
              value={formatDate(tourDetail.startDay)}
            />
            <InfoRow
              label="Ngày Kết thúc"
              value={formatDate(tourDetail.endDay)}
            />
            <InfoRow
              label="Trạng thái"
              value={
                <StatusTag
                  severity={
                    tourDetail.status === enumData.TOUR_STATUS.ACTIVE.code
                      ? "success"
                      : "warning"
                  }
                  value={
                    Object.values(enumData.TOUR_STATUS).find(
                      (s: any) => s.code === tourDetail.status,
                    )?.name || tourDetail.status
                  }
                />
              }
            />
            <InfoRow
              label="Hoạt động"
              value={
                <StatusTag
                  severity={tourDetail.isDeleted ? "danger" : "success"}
                  value={
                    tourDetail.isDeleted
                      ? enumData.STATUS_FILTER.INACTIVE.name
                      : enumData.STATUS_FILTER.ACTIVE.name
                  }
                />
              }
            />
          </div>
        </Card>

        <Divider />

        {/* <div className="mb-2">
          <h3 className="text-xl font-semibold mb-3">Thông tin hệ thống</h3>
          <DetailRow label="ID" value={tourDetail.id} />
          <DetailRow
            label="Ngày tạo"
            value={
              tourDetail.createdAt
                ? new Date(tourDetail.createdAt).toLocaleString("vi-VN")
                : "-"
            }
          />
          <DetailRow
            label="Cập nhật lần cuối"
            value={
              tourDetail.updatedAt
                ? new Date(tourDetail.updatedAt).toLocaleString("vi-VN")
                : "-"
            }
          />
        </div> */}
      </Card>
    </BaseView>
  );
}
