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
import type { BranchDto, BranchFilterDto } from "@/dto/branch.dto";
import {
  useActivateBranch,
  useDeactivateBranch,
  usePaginationBranch,
} from "@/hooks/branch";
import { useCompanySelectBox } from "@/hooks/company";

import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: BranchFilterDto = {
  code: "",
  name: "",
  shortName: "",
  companyId: null,
  type: null,
  isDeleted: false,
  isHeadquarters: null,
};

export default function BranchManager() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<BranchFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<BranchFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<BranchDto[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationBranch(pagination);
  const { onDeactivateBranch, isLoading: isLoadingDeactivate } =
    useDeactivateBranch();
  const { onActivateBranch, isLoading: isLoadingActivate } =
    useActivateBranch();
  const { data: companyOptions, isLoading: loadingCompanies } =
    useCompanySelectBox();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as BranchFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedBranch) return;
    await onActivateBranch(selectedBranch.id);
    await refetch();
    setSelectedBranch(null);
  };

  const handleDeactivate = async () => {
    if (!selectedBranch) return;
    await onDeactivateBranch(selectedBranch.id);
    await refetch();
    setSelectedBranch(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.BRANCH_MANAGER
        .children.ADD_BRANCH.path
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã chi nhánh",
      type: "input",
      placeholder: "Nhập mã",
      col: 6,
    },
    {
      key: "name",
      label: "Tên chi nhánh",
      type: "input",
      placeholder: "Nhập tên",
      col: 6,
    },
    {
      key: "shortName",
      label: "Tên viết tắt",
      type: "input",
      placeholder: "Nhập tên viết tắt",
      col: 6,
    },
    {
      key: "type",
      label: "Loại chi nhánh",
      type: "select",
      placeholder: "Nhập loại chi nhánh",
      options: Object.values(enumData.BRANCH_TYPE || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
    {
      key: "companyId",
      label: "Tên công ty",
      type: "select",
      placeholder: "Nhập tên công ty",
      options: (companyOptions || []).map((item) => ({
        label: item.name,
        value: item.id,
      })),
      col: 6,
    },
    {
      key: "isHeadquarters",
      label: "Là trụ sở chính",
      type: "select",
      placeholder: "Chọn trụ sở chính",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: enumData.STATUS_FILTER.ACTIVE.name, value: false },
        { label: enumData.STATUS_FILTER.INACTIVE.name, value: true },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<BranchDto>[] = [
    {
      field: "code",
      header: "Mã chi nhánh",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên chi nhánh",
      width: 200,
      sortable: true,
    },
    {
      field: "shortName",
      header: "Tên viết tắt",
      width: 200,
      sortable: true,
    },
    {
      field: "type",
      header: "Loại chi nhánh",
      width: 220,
      sortable: true,
      body: (rowData: BranchDto) =>
        enumData.BRANCH_TYPE[rowData.type as keyof typeof enumData.BRANCH_TYPE]
          ?.name || "",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: BranchDto) => (
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

  const rowActions: RowAction<BranchDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("BRANCH:VIEW_DETAIL"),
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.BRANCH_MANAGER.children.DETAIL_BRANCH.path.replace(
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
      visible: (record) => !record.isDeleted && hasPermission("BRANCH:UPDATE"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.BRANCH_MANAGER.children.EDIT_BRANCH.path.replace(
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
        !record.isDeleted && hasPermission("BRANCH:DEACTIVATE"),
      onClick: (record) => {
        setSelectedBranch(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("BRANCH:DEACTIVATE"),
      onClick: (record) => {
        setSelectedBranch(record);
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

      <TableCustom<BranchDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingActivate ||
          isLoadingDeactivate ||
          loadingCompanies
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy chi nhánh nào"
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
                  visible: hasPermission("BRANCH:CREATE"),
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
        title="Xác nhận kích hoạt chi nhánh"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động chi nhánh"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
