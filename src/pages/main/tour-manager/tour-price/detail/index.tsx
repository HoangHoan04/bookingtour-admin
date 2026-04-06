import { ROUTES } from "@/common/constants/routes";
import { enumData } from "@/common/enums/enum";
import { formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/ui/BaseView";
import StatusTag from "@/components/ui/StatusTag";
import { useTourPrice } from "@/hooks/tour-price";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 last:border-0">
    <span className="col-span-4 lg:col-span-3 font-semibold text-gray-700">
      {label}:
    </span>
    <span className="col-span-8 lg:col-span-9 text-gray-900">
      {value || "---"}
    </span>
  </div>
);

export default function DetailTourPricePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useTourPrice(id);

  const priceTypeName = Object.values(enumData.PRICE_TYPE || {}).find(
    (item: any) => item.code === data?.priceType,
  )?.name;

  const statusName = Object.values(enumData.TOUR_STATUS || {}).find(
    (item: any) => item.code === data?.status,
  )?.name;

  return (
    <BaseView isLoading={isLoading}>
      {!data ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-500">Không tìm thấy giá tour</p>
          <Button
            label="Quay lại"
            icon="pi pi-arrow-left"
            onClick={() => router.back()}
            className="mt-4"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Card title="Chi tiết giá tour" className="shadow-sm">
            <div className="space-y-1">
              <InfoRow label="Mã giá tour" value={data.code} />
              <InfoRow label="Mã chi tiết tour" value={data.tourDetailId} />
              <InfoRow
                label="Loại giá"
                value={priceTypeName || data.priceType || "---"}
              />
              <InfoRow
                label="Giá"
                value={`${Number(data.price || 0).toLocaleString("vi-VN")} ${data.currency || ""}`.trim()}
              />
              <InfoRow label="Tiền tệ" value={data.currency || "---"} />
              <InfoRow
                label="Trạng thái"
                value={
                  <StatusTag
                    severity={
                      data.status === enumData.TOUR_STATUS.ACTIVE.code
                        ? "success"
                        : data.status === enumData.TOUR_STATUS.INACTIVE.code
                          ? "warning"
                          : "danger"
                    }
                    value={statusName || data.status}
                  />
                }
              />
              <InfoRow
                label="Hoạt động"
                value={
                  <StatusTag
                    severity={data.isDeleted ? "danger" : "success"}
                    value={
                      data.isDeleted
                        ? enumData.STATUS_FILTER.INACTIVE.name
                        : enumData.STATUS_FILTER.ACTIVE.name
                    }
                  />
                }
              />
              <InfoRow
                label="Ngày tạo"
                value={data.createdAt ? formatDateTime(data.createdAt) : "---"}
              />
              <InfoRow
                label="Cập nhật lần cuối"
                value={data.updatedAt ? formatDateTime(data.updatedAt) : "---"}
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              label="Quay lại"
              icon="pi pi-arrow-left"
              severity="secondary"
              onClick={() => router.back()}
            />
            <Button
              label="Chỉnh sửa"
              icon="pi pi-pencil"
              severity="success"
              onClick={() =>
                router.push(
                  ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children.EDIT_TOUR_PRICE.path.replace(
                    ":id",
                    data.id,
                  ),
                )
              }
            />
          </div>
        </div>
      )}
    </BaseView>
  );
}
