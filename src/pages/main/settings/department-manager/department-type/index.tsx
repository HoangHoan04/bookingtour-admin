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
  DepartmentTypeDto,
  DepartmentTypeFilterDto,
} from "@/dto/department-type.dto";
import {
  useActivateDepartmentType,
  useDeactivateDepartmentType,
  usePaginationDepartmentType,
} from "@/hooks/department-type";
import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: DepartmentTypeFilterDto = {
  code: "",
  name: "",
  isDeleted: false,
};

export default function DepartmentTypePage() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<DepartmentTypeFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<DepartmentTypeFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<DepartmentTypeDto[]>([]);
  const [selectedDepartmentType, setSelectedDepartmentType] =
    useState<DepartmentTypeDto | null>(null);

  const { data, isLoading, refetch, total } =
    usePaginationDepartmentType(pagination);

  const { onDeactivateDepartmentType, isLoading: isLoadingDeactivate } =
    useDeactivateDepartmentType();
  const { onActivateDepartmentType, isLoading: isLoadingActivate } =
    useActivateDepartmentType();

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã loại phòng ban",
      type: "input",
      placeholder: "Nhập mã loại phòng ban",
      col: 8,
    },
    {
      key: "name",
      label: "Tên loại phòng ban",
      type: "input",
      placeholder: "Nhập tên loại phòng ban",
      col: 8,
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      options: [
        { label: enumData.STATUS_FILTER.ACTIVE.name, value: false },
        { label: enumData.STATUS_FILTER.INACTIVE.name, value: true },
      ],
      col: 8,
    },
  ];

  const columns: TableColumn<DepartmentTypeDto>[] = [
    {
      field: "code",
      header: "Mã loại phòng ban",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên loại phòng ban",
      width: 200,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: DepartmentTypeDto) => (
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

  const rowActions: RowAction<DepartmentTypeDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("DEPARTMENT_TYPE:VIEW"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.DEPARTMENT_MANAGER.children.DEPARTMENT_TYPE.children.DETAIL_DEPARTMENT_TYPE.path.replace(
            ":id",
            record.id
          )
        );
      },
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) =>
        !record.isDeleted && hasPermission("DEPARTMENT_TYPE:EDIT"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.DEPARTMENT_MANAGER.children.DEPARTMENT_TYPE.children.EDIT_DEPARTMENT_TYPE.path.replace(
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
        !record.isDeleted && hasPermission("DEPARTMENT_TYPE:DEACTIVATE"),
      onClick: (record) => {
        setSelectedDepartmentType(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("DEPARTMENT_TYPE:ACTIVATE"),
      onClick: (record) => {
        setSelectedDepartmentType(record);
        activateConfirmRef.current?.show();
      },
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.DEPARTMENT_MANAGER
        .children.DEPARTMENT_TYPE.children.ADD_DEPARTMENT_TYPE.path
    );
  };

  const handleExportExcel = () => {};

  const handleDownloadTemplate = () => {};

  const handleUploadFile = () => {};

  const handleActivate = async () => {
    if (!selectedDepartmentType) return;
    try {
      await onActivateDepartmentType(selectedDepartmentType.id);
      await refetch();
      setSelectedDepartmentType(null);
    } catch (error) {
      return;
    }
  };

  const handleDeactivate = async () => {
    if (!selectedDepartmentType) return;
    try {
      await onDeactivateDepartmentType(selectedDepartmentType.id);
      await refetch();
      setSelectedDepartmentType(null);
    } catch (error) {
      return;
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as DepartmentTypeFilterDto);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<DepartmentTypeDto>
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
        emptyText="Không tìm thấy loại phòng ban nào"
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
                  visible: hasPermission("DEPARTMENT_TYPE:CREATE"),
                },
                {
                  ...CommonActions.exportExcel(handleExportExcel),
                  visible: hasPermission("DEPARTMENT_TYPE:EXPORT"),
                },
                {
                  ...CommonActions.upload(
                    handleDownloadTemplate,
                    handleUploadFile
                  ),
                  visible: hasPermission("DEPARTMENT_TYPE:UPLOAD"),
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
        title="Xác nhận kích hoạt nhân viên"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động nhân viên"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
