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
import type { EmployeeDto, EmployeeFilter } from "@/dto/employee.dto";
import {
  useActivateEmployee,
  useDeactivateEmployee,
  usePaginationEmployee,
} from "@/hooks/employee";
import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: EmployeeFilter = {
  code: "",
  name: "",
  phone: "",
  isDeleted: false,
};

export default function EmployeeManager() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<EmployeeFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<EmployeeFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<EmployeeDto[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(
    null
  );

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);
  const { data, isLoading, refetch, total } = usePaginationEmployee(pagination);
  const { onDeactivateEmployee, isLoading: isLoadingDeactivate } =
    useDeactivateEmployee();
  const { onActivateEmployee, isLoading: isLoadingActivate } =
    useActivateEmployee();
  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as EmployeeFilter);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedEmployee) return;
    await onActivateEmployee(selectedEmployee.id);
    await refetch();
    setSelectedEmployee(null);
  };

  const handleDeactivate = async () => {
    if (!selectedEmployee) return;
    await onDeactivateEmployee(selectedEmployee.id);
    await refetch();
    setSelectedEmployee(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.children.ADD_EMPLOYEE
        .path
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã nhân viên",
      type: "input",
      placeholder: "Nhập mã",
      col: 4,
    },
    {
      key: "name",
      label: "Tên nhân viên",
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

  const columns: TableColumn<EmployeeDto>[] = [
    {
      field: "code",
      header: "Mã NV",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "firstName",
      header: "Tên nhân viên",
      width: 200,
      sortable: true,
    },
    {
      field: "lastName",
      header: "Tên nhân viên",
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
      body: (rowData: EmployeeDto) => (
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

  const rowActions: RowAction<EmployeeDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("EMPLOYEE:VIEW_DETAIL"),
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.children.DETAIL_EMPLOYEE.path.replace(
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
        !record.isDeleted && hasPermission("EMPLOYEE:UPDATE"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.children.EDIT_EMPLOYEE.path.replace(
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
        !record.isDeleted && hasPermission("EMPLOYEE:DEACTIVATE"),
      onClick: (record) => {
        setSelectedEmployee(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("EMPLOYEE:DEACTIVATE"),
      onClick: (record) => {
        setSelectedEmployee(record);
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

      <TableCustom<EmployeeDto>
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
        emptyText="Không tìm thấy nhân viên nào"
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
                  visible: hasPermission("EMPLOYEE:CREATE"),
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
