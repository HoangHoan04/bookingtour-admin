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
import type { PartDto, PartFilterDto } from "@/dto/part.dto";
import { useBranchSelectBox } from "@/hooks/branch";
import { useCompanySelectBox } from "@/hooks/company";
import { useDepartmentSelectBox } from "@/hooks/department";

import { usePermission } from "@/hooks/layout/usePermission";
import {
  useActivatePart,
  useDeactivatePart,
  usePaginationPart,
} from "@/hooks/part";
import { usePartMasterSelectBox } from "@/hooks/part-master";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: PartFilterDto = {
  code: "",
  name: "",
  companyId: undefined,
  branchId: undefined,
  departmentId: undefined,
  partMasterId: undefined,
  isDeleted: undefined,
};

export default function PartManager() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<PartFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<PartFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<PartDto[]>([]);
  const [selectedPart, setSelectedPart] = useState<PartDto | null>(null);

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);
  const { data, isLoading, refetch, total } = usePaginationPart(pagination);
  const { onDeactivatePart, isLoading: isLoadingDeactivate } =
    useDeactivatePart();
  const { onActivatePart, isLoading: isLoadingActivate } = useActivatePart();

  const { data: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanySelectBox();
  const { data: branchOptions, isLoading: isLoadingBranchOptions } =
    useBranchSelectBox();

  const { data: departmentOptions, isLoading: isLoadingDepartmentOptions } =
    useDepartmentSelectBox();

  const { data: partMasterOptions, isLoading: isLoadingPartMasterOptions } =
    usePartMasterSelectBox();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as PartFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedPart) return;
    await onActivatePart(selectedPart.id);
    await refetch();
    setSelectedPart(null);
  };

  const handleDeactivate = async () => {
    if (!selectedPart) return;
    await onDeactivatePart(selectedPart.id);
    await refetch();
    setSelectedPart(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.PART_MANAGER
        .children.PART.children.ADD_PART.path
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã bộ phận",
      type: "input",
      placeholder: "Nhập mã",
      col: 6,
    },
    {
      key: "name",
      label: "Tên bộ phận",
      type: "input",
      placeholder: "Nhập tên",
      col: 6,
    },

    {
      key: "companyId",
      label: "Công ty",
      type: "select",
      options: companyOptions.map((company) => ({
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
      options: branchOptions.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
      placeholder: "Chọn chi nhánh",
      col: 6,
    },
    {
      key: "departmentId",
      label: "Phòng ban",
      type: "select",
      options: departmentOptions.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })),
      placeholder: "Chọn phòng ban",
      col: 6,
    },
    {
      key: "partMasterId",
      label: "Bộ phận mẫu",
      type: "select",
      options: partMasterOptions.map((partMaster) => ({
        label: partMaster.name,
        value: partMaster.id,
      })),
      placeholder: "Chọn bộ phận mẫu",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER).map((status) => ({
        label: status.name,
        value: status.value,
      })),
      placeholder: "Chọn trạng thái hoạt động",
      col: 6,
    },
  ];

  const columns: TableColumn<PartDto>[] = [
    {
      field: "code",
      header: "Mã bộ phận",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên bộ phận",
      width: 250,
      sortable: true,
    },
    {
      field: "partMaster",
      header: "Bộ phận mẫu",
      width: 200,
      sortable: true,
      body: (rowData: PartDto) => rowData.partMaster?.name || "",
    },
    {
      field: "department",
      header: "Phòng ban",
      width: 200,
      sortable: true,
      body: (rowData: PartDto) => rowData.department?.name || "",
    },
    {
      field: "branch",
      header: "Chi nhánh",
      width: 200,
      sortable: true,
      body: (rowData: PartDto) => rowData.branch?.name || "",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: PartDto) => (
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

  const rowActions: RowAction<PartDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("PART:VIEW_DETAIL"),
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.PART_MANAGER.children.PART.children.DETAIL_PART.path.replace(
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
      visible: (record) => !record.isDeleted && hasPermission("PART:UPDATE"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.PART_MANAGER.children.PART.children.EDIT_PART.path.replace(
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
        !record.isDeleted && hasPermission("PART:DEACTIVATE"),
      onClick: (record) => {
        setSelectedPart(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted && hasPermission("PART:ACTIVATE"),
      onClick: (record) => {
        setSelectedPart(record);
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

      <TableCustom<PartDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingActivate ||
          isLoadingDeactivate ||
          isLoadingCompanyOptions ||
          isLoadingBranchOptions ||
          isLoadingDepartmentOptions ||
          isLoadingPartMasterOptions
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy bộ phận nào"
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
                  visible: hasPermission("PART:CREATE"),
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
        title={`Xác nhận kích hoạt bộ phận "${selectedPart?.name}"`}
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title={`Xác nhận ngừng hoạt động bộ phận "${selectedPart?.name}"`}
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
