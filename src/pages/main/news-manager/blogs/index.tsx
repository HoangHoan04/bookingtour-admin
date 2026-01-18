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
import type { BlogDto, BlogFilterDto } from "@/dto/blog.dto";
import {
  useActivateBlog,
  useDeactivateBlog,
  usePaginationBlog,
} from "@/hooks/blog";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: BlogFilterDto = {
  title: "",
  category: "",
  status: "",
};

export default function BlogManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<BlogFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<BlogFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<BlogDto[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationBlog(pagination);
  const { onDeactivateBlog, isLoading: isLoadingDeactivate } =
    useDeactivateBlog();
  const { onActivateBlog, isLoading: isLoadingActivate } = useActivateBlog();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as BlogFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedBlog) return;
    await onActivateBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleDeactivate = async () => {
    if (!selectedBlog) return;
    await onDeactivateBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.ADD_BLOG.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "title",
      label: "Tiêu đề bài viết",
      type: "input",
      placeholder: "Nhập tiêu đề bài viết",
      col: 6,
    },
    {
      key: "category",
      label: "Danh mục bài viết",
      type: "input",
      placeholder: "Nhập danh mục bài viết",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái xuất bản",
      type: "select",
      placeholder: "Chọn trạng thái xuất bản",
      options: Object.values(enumData.BLOG_STATUS || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<BlogDto>[] = [
    {
      field: "title",
      header: "Tiêu đề bài viết",
      width: 250,
      sortable: true,
      frozen: true,
    },
    {
      field: "slug",
      header: "Đường dẫn (Slug)",
      width: 200,
      sortable: true,
    },
    {
      field: "category",
      header: "Danh mục",
      width: 150,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái xuất bản",
      width: 150,
      sortable: true,
      body: (rowData: BlogDto) =>
        enumData.BLOG_STATUS[
          rowData.status as keyof typeof enumData.BLOG_STATUS
        ]?.name || rowData.status,
    },
    {
      field: "viewCount",
      header: "Lượt xem",
      width: 100,
      align: "center",
      sortable: true,
    },
    {
      field: "likeCount",
      header: "Lượt thích",
      width: 100,
      align: "center",
      sortable: true,
    },
    {
      field: "publishedAt",
      header: "Ngày xuất bản",
      width: 150,
      sortable: true,
      body: (rowData: BlogDto) =>
        rowData.publishedAt
          ? new Date(rowData.publishedAt).toLocaleDateString("vi-VN")
          : "",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: BlogDto) => (
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

  const rowActions: RowAction<BlogDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.DETAIL_BLOG.path.replace(
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
          ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.EDIT_BLOG.path.replace(
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
        setSelectedBlog(record);
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
        setSelectedBlog(record);
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

      <TableCustom<BlogDto>
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
        emptyText="Không tìm thấy bài viết nào"
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
        title="Xác nhận kích hoạt bài viết"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động bài viết"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
