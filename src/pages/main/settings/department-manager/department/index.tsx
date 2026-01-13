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
import type { BranchSelectBoxDto } from "@/dto/branch.dto";
import type { CompanySelectBoxDto } from "@/dto/company.dto";
import type { DepartmentTypeSelectBoxDto } from "@/dto/department-type.dto";
import type { DepartmentDto, DepartmentFilterDto } from "@/dto/department.dto";
import { useBranchSelectBox } from "@/hooks/branch";
import { useCompanySelectBox } from "@/hooks/company";
import {
  useActivateDepartment,
  useDeactivateDepartment,
  usePaginationDepartment,
} from "@/hooks/department";
import { useDepartmentTypeSelectBox } from "@/hooks/department-type";
import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: DepartmentFilterDto = {
  code: "",
  name: "",
  companyId: undefined,
  branchId: undefined,
  departmentTypeId: undefined,
  isDeleted: undefined,
};

export default function DepartmentPage() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<DepartmentFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<DepartmentFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<DepartmentDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentDto | null>(null);

  const { data, isLoading, refetch, total } =
    usePaginationDepartment(pagination);
  const { onDeactivateDepartment, isLoading: isLoadingDeactivate } =
    useDeactivateDepartment();
  const { onActivateDepartment, isLoading: isLoadingActivate } =
    useActivateDepartment();
  const { data: departmentTypes, isLoading: isLoadingDepartmentTypes } =
    useDepartmentTypeSelectBox();
  const { data: branchOptions, isLoading: loadingBranch } =
    useBranchSelectBox();
  const { data: companyOptions, isLoading: loadingCompany } =
    useCompanySelectBox();

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
      label: "Mã phòng ban",
      type: "input",
      placeholder: "Nhập mã phòng ban",
      col: 6,
    },
    {
      key: "name",
      label: "Tên phòng ban",
      type: "input",
      placeholder: "Nhập tên phòng ban",
      col: 6,
    },
    {
      key: "companyId",
      label: "Công ty",
      type: "select",
      options: companyOptions.map((company: CompanySelectBoxDto) => ({
        label: company.name,
        value: company.id,
      })),
      placeholder: "Chọn công ty",
      col: 6,
    },
    {
      key: "branchId",
      label: "Chi nhánh",
      type: "select",
      options: branchOptions.map((branch: BranchSelectBoxDto) => ({
        label: branch.name,
        value: branch.id,
      })),
      placeholder: "Chọn chi nhánh",
      col: 6,
    },
    {
      key: "departmentTypeId",
      label: "Loại phòng ban",
      type: "select",
      placeholder: "Nhập tên phòng ban",
      col: 6,
      options: departmentTypes.map((dt: DepartmentTypeSelectBoxDto) => ({
        label: dt.name,
        value: dt.id,
      })),
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      options: [
        { label: enumData.STATUS_FILTER.ACTIVE.name, value: false },
        { label: enumData.STATUS_FILTER.INACTIVE.name, value: true },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<DepartmentDto>[] = [
    {
      field: "code",
      header: "Mã phòng ban",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên phòng ban",
      width: 200,
      sortable: true,
    },
    {
      field: "limit",
      header: "Giới hạn nhân viên",
      width: 150,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: DepartmentDto) => (
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

  const rowActions: RowAction<DepartmentDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("DEPARTMENT:VIEW_DETAIL"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.DEPARTMENT_MANAGER.children.DEPARTMENT.children.DETAIL_DEPARTMENT.path.replace(
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
        !record.isDeleted && hasPermission("DEPARTMENT:UPDATE"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.DEPARTMENT_MANAGER.children.DEPARTMENT.children.EDIT_DEPARTMENT.path.replace(
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
        !record.isDeleted && hasPermission("DEPARTMENT:DEACTIVATE"),
      onClick: (record) => {
        setSelectedDepartment(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("DEPARTMENT:DEACTIVATE"),
      onClick: (record) => {
        setSelectedDepartment(record);
        activateConfirmRef.current?.show();
      },
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.DEPARTMENT_MANAGER
        .children.DEPARTMENT.children.ADD_DEPARTMENT.path
    );
  };

  const handleActivate = async () => {
    if (!selectedDepartment) return;
    try {
      await onActivateDepartment(selectedDepartment.id);
      await refetch();
      setSelectedDepartment(null);
    } catch (error) {
      return;
    }
  };

  const handleDeactivate = async () => {
    if (!selectedDepartment) return;
    try {
      await onDeactivateDepartment(selectedDepartment.id);
      await refetch();
      setSelectedDepartment(null);
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
    setFilter(newFilters as DepartmentFilterDto);
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

      <TableCustom<DepartmentDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingActivate ||
          isLoadingDeactivate ||
          isLoadingDepartmentTypes ||
          loadingBranch ||
          loadingCompany
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy phòng ban nào"
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
        title="Xác nhận kích hoạt phòng ban"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động phòng ban"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
