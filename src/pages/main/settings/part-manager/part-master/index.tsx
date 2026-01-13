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
import type { PartMasterDto, PartMasterFilterDto } from "@/dto/part-master.dto";
import { usePermission } from "@/hooks/layout/usePermission";
import {
  useActivatePartMaster,
  useDeactivatePartMaster,
  usePaginationPartMaster,
} from "@/hooks/part-master";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: PartMasterFilterDto = {
  code: "",
  name: "",
  isDeleted: undefined,
};

export default function PartMasterManager() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<PartMasterFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<PartMasterFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<PartMasterDto[]>([]);
  const [selectedPartMaster, setSelectedPartMaster] =
    useState<PartMasterDto | null>(null);

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationPartMaster(pagination);
  const { onDeactivatePartMaster, isLoading: isLoadingDeactivate } =
    useDeactivatePartMaster();
  const { onActivatePartMaster, isLoading: isLoadingActivate } =
    useActivatePartMaster();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as PartMasterFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedPartMaster) return;
    await onActivatePartMaster(selectedPartMaster.id);
    await refetch();
    setSelectedPartMaster(null);
  };

  const handleDeactivate = async () => {
    if (!selectedPartMaster) return;
    await onDeactivatePartMaster(selectedPartMaster.id);
    await refetch();
    setSelectedPartMaster(null);
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
      label: "Mã bộ phận mẫu",
      type: "input",
      placeholder: "Nhập mã",
      col: 4,
    },
    {
      key: "name",
      label: "Tên bộ phận mẫu",
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

  const columns: TableColumn<PartMasterDto>[] = [
    {
      field: "code",
      header: "Mã bộ phận mẫu",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên bộ phận mẫu",
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
      body: (rowData: PartMasterDto) => (
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

  const rowActions: RowAction<PartMasterDto>[] = [
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
        setSelectedPartMaster(record);
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
        setSelectedPartMaster(record);
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

      <TableCustom<PartMasterDto>
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
        emptyText="Không tìm thấy bộ phận mẫu nào"
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
        title={`Xác nhận kích hoạt bộ phận mẫu "${selectedPartMaster?.name}"`}
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title={`Xác nhận ngừng hoạt động bộ phận mẫu "${selectedPartMaster?.name}"`}
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
