import { enumData } from "@/common/enums/enum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
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

import { usePermission } from "@/hooks/layout/usePermission";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: any = {
  code: "",
  name: "",
  phone: "",
  isDeleted: false,
};

export default function RecruitmentManager() {
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<any>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<any>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRecruitment, setSelectedRecruitment] = useState<any | null>(
    null
  );

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as any);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedRecruitment) return;
    setSelectedRecruitment(null);
  };

  const handleDeactivate = async () => {
    if (!selectedRecruitment) return;
    setSelectedRecruitment(null);
  };

  const handleCreate = () => {};

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã yêu cầu tuyển dụng",
      type: "input",
      placeholder: "Nhập mã",
      col: 4,
    },
    {
      key: "name",
      label: "Tên yêu cầu tuyển dụng",
      type: "input",
      placeholder: "Nhập tên",
      col: 4,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập SĐT",
      col: 4,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: enumData.STATUS_FILTER.ACTIVE.name, value: false },
        { label: enumData.STATUS_FILTER.INACTIVE.name, value: true },
      ],
      col: 4,
    },
  ];

  const columns: TableColumn<any>[] = [
    {
      field: "code",
      header: "Mã NV",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "firstName",
      header: "Tên yêu cầu tuyển dụng",
      width: 200,
      sortable: true,
    },
    {
      field: "lastName",
      header: "Tên yêu cầu tuyển dụng",
      width: 200,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 220,
      sortable: true,
    },
    {
      field: "phone",
      header: "Số điện thoại",
      width: 130,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: any) => (
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

  const rowActions: RowAction<any>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("RECRUITMENT:VIEW_DETAIL"),
      onClick: () => {},
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) =>
        !record.isDeleted && hasPermission("RECRUITMENT:UPDATE"),
      onClick: () => {},
    },
    {
      key: "deactivate",
      icon: PrimeIcons.BAN,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) =>
        !record.isDeleted && hasPermission("RECRUITMENT:DEACTIVATE"),
      onClick: (record) => {
        setSelectedRecruitment(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("RECRUITMENT:DEACTIVATE"),
      onClick: (record) => {
        setSelectedRecruitment(record);
        activateConfirmRef.current?.show();
      },
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

      <TableCustom<any>
        data={[]}
        columns={columns}
        loading={false}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy yêu cầu tuyển dụng nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: 0,
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
                  visible: hasPermission("RECRUITMENT:CREATE"),
                },
              ]}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: () => {},
        }}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt yêu cầu tuyển dụng"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động yêu cầu tuyển dụng"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
