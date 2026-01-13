import { ROUTES } from "@/common/constants/routes";
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
import type {
  PositionMasterDto,
  PositionMasterFilterDto,
} from "@/dto/position-master.dto";
import { usePermission } from "@/hooks/layout/usePermission";
import {
  useActivatePositionMaster,
  useDeactivatePositionMaster,
  usePaginationPositionMaster,
} from "@/hooks/position-master";
import { useRouter } from "@/routers/hooks";

import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: PositionMasterFilterDto = {
  code: "",
  name: "",
  isDeleted: undefined,
};

export default function PositionMasterManager() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<PositionMasterFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<PositionMasterFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<PositionMasterDto[]>([]);
  const [selectedPositionMaster, setSelectedPositionMaster] =
    useState<PositionMasterDto | null>(null);

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationPositionMaster(pagination);
  const { onDeactivatePositionMaster, isLoading: isLoadingDeactivate } =
    useDeactivatePositionMaster();
  const { onActivatePositionMaster, isLoading: isLoadingActivate } =
    useActivatePositionMaster();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as PositionMasterFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedPositionMaster) return;
    await onActivatePositionMaster(selectedPositionMaster.id);
    await refetch();
    setSelectedPositionMaster(null);
  };

  const handleDeactivate = async () => {
    if (!selectedPositionMaster) return;
    await onDeactivatePositionMaster(selectedPositionMaster.id);
    await refetch();
    setSelectedPositionMaster(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.PART_MANAGER
        .children.PART_MASTER.children.ADD_PART_MASTER.path
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã vị trí mẫu",
      type: "input",
      placeholder: "Nhập mã",
      col: 4,
    },
    {
      key: "name",
      label: "Tên vị trí mẫu",
      type: "input",
      placeholder: "Nhập tên",
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

  const columns: TableColumn<PositionMasterDto>[] = [
    {
      field: "code",
      header: "Mã vị trí mẫu",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên vị trí mẫu",
      width: 250,
      sortable: true,
    },
    {
      field: "description",
      header: "Mô tả",
      width: 300,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: PositionMasterDto) => (
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

  const rowActions: RowAction<PositionMasterDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("PART_MASTER:VIEW_DETAIL"),
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.PART_MANAGER.children.PART_MASTER.children.DETAIL_PART_MASTER.path.replace(
            ":id",
            record.id
          )
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) =>
        !record.isDeleted && hasPermission("PART_MASTER:UPDATE"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.PART_MANAGER.children.PART_MASTER.children.EDIT_PART_MASTER.path.replace(
            ":id",
            record.id
          )
        );
      },
    },
    {
      key: "deactivate",
      icon: PrimeIcons.BAN,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) =>
        !record.isDeleted && hasPermission("PART_MASTER:DEACTIVATE"),
      onClick: (record) => {
        setSelectedPositionMaster(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("PART_MASTER:ACTIVATE"),
      onClick: (record) => {
        setSelectedPositionMaster(record);
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

      <TableCustom<PositionMasterDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingActivate || isLoadingDeactivate}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy vị trí mẫu nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total,
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
                  visible: hasPermission("PART_MASTER :CREATE"),
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

      <ActionConfirm
        ref={activateConfirmRef}
        title={`Xác nhận kích hoạt vị trí mẫu "${selectedPositionMaster?.name}"`}
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title={`Xác nhận ngừng hoạt động vị trí mẫu "${selectedPositionMaster?.name}"`}
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
