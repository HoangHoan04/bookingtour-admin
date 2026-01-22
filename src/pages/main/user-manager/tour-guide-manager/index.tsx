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
import type { TourGuideDto, TourGuideFilterDto } from "@/dto/tour-guide.dto";
import {
  useActivateTourGuide,
  useDeactivateTourGuide,
  usePaginationTourGuide,
} from "@/hooks/tour-guide";

import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: TourGuideFilterDto = {
  code: "",
  name: "",
  email: "",
  isDeleted: undefined,
};

export default function TourGuideManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<TourGuideFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<TourGuideFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<TourGuideDto[]>([]);
  const [selectedTourGuide, setSelectedTourGuide] =
    useState<TourGuideDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationTourGuide(pagination);
  const { onDeactivateTourGuide, isLoading: isLoadingDeactivate } =
    useDeactivateTourGuide();
  const { onActivateTourGuide, isLoading: isLoadingActivate } =
    useActivateTourGuide();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TourGuideFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedTourGuide) return;
    await onActivateTourGuide(selectedTourGuide.id);
    await refetch();
    setSelectedTourGuide(null);
  };

  const handleDeactivate = async () => {
    if (!selectedTourGuide) return;
    await onDeactivateTourGuide(selectedTourGuide.id);
    await refetch();
    setSelectedTourGuide(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children
        .ADD_TOUR_GUIDE.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã hướng dẫn viên",
      type: "input",
      placeholder: "Nhập mã hướng dẫn viên",
      col: 6,
    },
    {
      key: "name",
      label: "Tên hướng dẫn viên",
      type: "input",
      placeholder: "Nhập tên hướng dẫn viên",
      col: 6,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<TourGuideDto>[] = [
    {
      field: "code",
      header: "Mã hướng dẫn viên",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên hướng dẫn viên",
      width: 200,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "gender",
      header: "Giới tính",
      width: 220,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: TourGuideDto) => (
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

  const rowActions: RowAction<TourGuideDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children.DETAIL_TOUR_GUIDE.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children.EDIT_TOUR_GUIDE.path.replace(
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
      onClick: (record) => {
        setSelectedTourGuide(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted,
      onClick: (record) => {
        setSelectedTourGuide(record);
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

      <TableCustom<TourGuideDto>
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
        emptyText="Không tìm thấy hướng dẫn viên nào"
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

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt hướng dẫn viên"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động hướng dẫn viên"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
