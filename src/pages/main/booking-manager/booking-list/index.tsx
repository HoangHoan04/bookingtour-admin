import { ROUTES } from "@/common/constants/routes";
import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import type { PaginationDto } from "@/dto";
import type { BookingDto, BookingFilterDto } from "@/dto/booking.dto";
import { usePaginationBooking } from "@/hooks/booking";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useState } from "react";

export const initFilter: BookingFilterDto = {
  tourId: "",
  contactFullname: "",
  contactEmail: "",
  contactPhone: "",
  bookingDate: new Date(),
  status: "",
};

export default function BookingManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<BookingFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<BookingFilterDto>>(
    {
      skip: 0,
      take: 10,
      where: initFilter,
    },
  );
  const [selectedRows, setSelectedRows] = useState<BookingDto[]>([]);
  // const activateConfirmRef = useRef<ActionConfirmRef>(null);
  // const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationBooking(pagination);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as BookingFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.BOOKING_MANAGER.children.ADD_BOOKING.path);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã booking",
      type: "input",
      placeholder: "Nhập mã booking",
      col: 6,
    },
    {
      key: "contactFullname",
      label: "Tên khách hàng",
      type: "input",
      placeholder: "Nhập tên khách hàng",
      col: 6,
    },
    {
      key: "contactEmail",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 6,
    },
    {
      key: "contactPhone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái booking",
      type: "select",
      options: Object.values(enumData.BOOKING_STATUS || {}).map(
        (item: any) => ({
          label: item.name,
          value: item.code,
        }),
      ),
      placeholder: "Chọn trạng thái",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Hoạt động",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      placeholder: "Chọn trạng thái hoạt động",
      col: 6,
    },
  ];

  const columns: TableColumn<BookingDto>[] = [
    {
      field: "code",
      header: "Mã booking",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "contactFullname",
      header: "Tên khách hàng",
      width: 250,
      sortable: true,
    },
    {
      field: "contactEmail",
      header: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "contactPhone",
      header: "Số điện thoại",
      width: 150,
      sortable: true,
      align: "center",
    },
    {
      field: "totalPrice",
      header: "Tổng giá",
      width: 150,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (rowData: BookingDto) => {
        const status = Object.values(enumData.BOOKING_STATUS || {}).find(
          (s: any) => s.code === rowData.status,
        ) as any;
        return (
          <StatusTag
            severity={
              status?.code === enumData.BOOKING_STATUS.CONFIRMED.code
                ? "success"
                : status?.code === enumData.BOOKING_STATUS.CANCELLED.code
                  ? "warning"
                  : "danger"
            }
            value={status?.name || rowData.status}
          />
        );
      },
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 120,
      align: "center",
      body: (rowData: BookingDto) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={
            rowData.isDeleted
              ? enumData.STATUS_FILTER.INACTIVE.name
              : enumData.STATUS_FILTER.ACTIVE.name
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<BookingDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.BOOKING_MANAGER.children.DETAIL_BOOKING.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.BOOKING_MANAGER.children.EDIT_BOOKING.path.replace(
            ":id",
            record.id,
          ),
        );
      },
    },
    {
      key: "deactivate",
      icon: PrimeIcons.BAN,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      // onClick: (record) => {
      //   // setSelectedBooking(record);
      //   deactivateConfirmRef.current?.show();
      // },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted,
      // onClick: (record) => {
      //   // setSelectedBooking(record);
      //   activateConfirmRef.current?.show();
      // },
    },
  ];

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<BookingDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy booking nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <RowActions
              actions={[
                {
                  ...CommonActions.create(handleCreate),
                },
              ]}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />
    </BaseView>
  );
}
