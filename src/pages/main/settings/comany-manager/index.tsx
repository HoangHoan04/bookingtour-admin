import { ROUTES } from "@/common/constants/routes";
import { enumData } from "@/common/enums/enum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import ExcelImportExport from "@/components/ui/excel/ExportImportExcelCustom";
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
import type { CompanyDto, CompanyFilterDto } from "@/dto/company.dto";
import {
  useActivateCompany,
  useDeactivateCompany,
  useDownloadCompanyTemplate,
  useExportCompany,
  useImportCompany,
  usePaginationCompany,
} from "@/hooks/company";

import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: CompanyFilterDto = {
  code: "",
  name: "",
  taxCode: "",
  address: "",
  email: "",
  phoneNumber: "",
  status: "",
  isDeleted: undefined,
};

export default function CompanyManager() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState<CompanyFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<CompanyFilterDto>>(
    {
      skip: 0,
      take: 10,
      where: initFilter,
    }
  );
  const [selectedRows, setSelectedRows] = useState<CompanyDto[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDto | null>(
    null
  );
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);
  const { data, isLoading, refetch, total } = usePaginationCompany(pagination);
  const { onDeactivateCompany, isLoading: isLoadingDeactivate } =
    useDeactivateCompany();
  const { onActivateCompany, isLoading: isLoadingActivate } =
    useActivateCompany();
  const { downloadTemplate, isDownloading } = useDownloadCompanyTemplate();
  const {
    importCompany,
    isImporting,
    importProgress,
    importResult,
    downloadErrorReport,
    clearResult,
  } = useImportCompany();
  const { exportCompany, isExporting } = useExportCompany();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as CompanyFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedCompany) return;
    await onActivateCompany(selectedCompany.id);
    await refetch();
    setSelectedCompany(null);
  };

  const handleDeactivate = async () => {
    if (!selectedCompany) return;
    await onDeactivateCompany(selectedCompany.id);
    await refetch();
    setSelectedCompany(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.COMPANY_MANAGER
        .children.ADD_COMPANY.path
    );
  };

  const handleImport = async (file: File) => {
    await importCompany(file);
    await refetch();
  };

  const handleExport = (limit?: number) => {
    exportCompany({
      pagination: {
        ...pagination,
        take: limit || pagination.take,
      },
      limit,
    });
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã công ty",
      type: "input",
      placeholder: "Nhập mã công ty",
      col: 6,
    },
    {
      key: "name",
      label: "Tên công ty",
      type: "input",
      placeholder: "Nhập tên công ty",
      col: 6,
    },

    {
      key: "address",
      label: "Địa chỉ",
      type: "input",
      placeholder: "Nhập địa chỉ",
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

  const columns: TableColumn<CompanyDto>[] = [
    {
      field: "code",
      header: "Mã công ty",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên công ty",
      width: 200,
      sortable: true,
    },
    {
      field: "address",
      header: "Địa chỉ",
      width: 200,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: CompanyDto) => (
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

  const rowActions: RowAction<CompanyDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      visible: () => hasPermission("COMPANY:VIEW_DETAIL"),
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.COMPANY_MANAGER.children.DETAIL_COMPANY.path.replace(
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
      visible: (record) => !record.isDeleted && hasPermission("COMPANY:UPDATE"),
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children.COMPANY_MANAGER.children.EDIT_COMPANY.path.replace(
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
        !record.isDeleted && hasPermission("COMPANY:DEACTIVATE"),
      onClick: (record) => {
        setSelectedCompany(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) =>
        record.isDeleted && hasPermission("COMPANY:DEACTIVATE"),
      onClick: (record) => {
        setSelectedCompany(record);
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

      <TableCustom<CompanyDto>
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
        emptyText="Không tìm thấy công ty nào"
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
            <div className="flex items-center gap-2">
              <RowActions
                actions={[
                  {
                    ...CommonActions.create(handleCreate),
                    visible: hasPermission("COMPANY:CREATE"),
                  },
                ]}
                justify="start"
                gap="medium"
              />
              <ExcelImportExport
                onDownloadTemplate={downloadTemplate}
                onImportExcel={handleImport}
                onExportExcel={handleExport}
                onDownloadErrorReport={downloadErrorReport}
                onClearResult={clearResult}
                isDownloadingTemplate={isDownloading}
                isImporting={isImporting}
                isExporting={isExporting}
                importProgress={importProgress}
                importResult={importResult}
                showImport={hasPermission("COMPANY:IMPORT")}
                showExport={hasPermission("COMPANY:EXPORT")}
                showTemplate={hasPermission("COMPANY:IMPORT")}
                currentPageSize={pagination.take}
                totalRecords={total || 0}
              />
            </div>
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt công ty"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động công ty"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
