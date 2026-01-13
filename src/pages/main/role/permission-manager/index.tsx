import { enumData } from "@/common/enums/enum";
import {
  PERMISSION_ACTION_OPTIONS,
  createPermissionCode,
  parsePermissionCode,
} from "@/common/enums/permissionEnum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import type { PaginationDto } from "@/dto";
import type {
  CreatePermissionDto,
  PermissionDto,
  PermissionFilterDto,
  UpdatePermissionDto,
} from "@/dto/permission.dto";
import {
  useCreatePermission,
  useDeletePermission,
  usePaginationPermission,
  useUpdatePermission,
} from "@/hooks/permission";
import { getModuleName, getModuleOptions } from "@/utils/permission.util";
import { PrimeIcons } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { useMemo, useRef, useState } from "react";

const initFilter: PermissionFilterDto = {
  code: "",
  name: "",
  isDeleted: false,
};

export default function PermissionManagerPage() {
  const [filter, setFilter] = useState<PermissionFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<PermissionFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<PermissionDto | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");

  const { data, isLoading, refetch, total } =
    usePaginationPermission(pagination);
  const { onCreatePermission, isLoading: creating } = useCreatePermission();
  const { onUpdate, isPending: updating } = useUpdatePermission();
  const { onDelete, isPending: deleting } = useDeletePermission();

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);
  const [selectedForDelete, setSelectedForDelete] =
    useState<PermissionDto | null>(null);
  const moduleOptions = useMemo(() => getModuleOptions(), []);
  const generatedCode = useMemo(() => {
    if (selectedModule && selectedAction) {
      return createPermissionCode(selectedModule, selectedAction);
    }
    return "";
  }, [selectedModule, selectedAction]);

  const handleSearch = (isReset = false) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      code: generatedCode,
      module: selectedModule,
    };

    if (editingItem) {
      const updatePayload: UpdatePermissionDto = {
        ...payload,
        id: editingItem.id,
      };
      onUpdate(updatePayload, {
        onSuccess: () => {
          setShowDialog(false);
          refetch();
        },
      });
    } else {
      const createPayload: CreatePermissionDto = payload;
      await onCreatePermission(createPayload);
      setShowDialog(false);
      refetch();
    }
  };

  const handleDelete = async () => {
    if (selectedForDelete) {
      await onDelete(selectedForDelete.id);
      setSelectedForDelete(null);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setSelectedModule("");
    setSelectedAction("");
    setShowDialog(true);
  };

  const handleEdit = (row: PermissionDto) => {
    setEditingItem(row);
    const parsed = parsePermissionCode(row.code);
    if (parsed) {
      setSelectedModule(parsed.module);
      setSelectedAction(parsed.action);
    }

    setShowDialog(true);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã quyền",
      type: "input",
      placeholder: "Tìm theo mã",
      col: 4,
    },
    {
      key: "name",
      label: "Tên quyền",
      type: "input",
      placeholder: "Tìm theo tên",
      col: 4,
    },
    {
      key: "module",
      label: "Module",
      type: "input",
      placeholder: "Tìm theo module",
      col: 4,
    },
  ];

  const formFields: FormField[] = [
    {
      name: "module",
      label: "Module",
      type: "select",
      required: true,
      options: moduleOptions.map((m) => ({
        id: m.code,
        name: m.name,
        value: m.code,
      })),
      placeholder: "Chọn module",
      onChange: (value) => setSelectedModule(value),
    },
    {
      name: "action",
      label: "Hành động",
      type: "select",
      required: true,
      options: PERMISSION_ACTION_OPTIONS.map((a) => ({
        id: a.code,
        name: a.name,
        value: a.code,
      })),
      placeholder: "Chọn hành động",
      onChange: (value) => setSelectedAction(value),
    },
    {
      name: "code",
      label: "Mã quyền (Tự động)",
      type: "input",
      disabled: true,
      placeholder: "Sẽ tự động tạo khi chọn module và action",
    },
    {
      name: "name",
      label: "Tên quyền",
      type: "input",
      required: true,
      placeholder: "VD: Thêm mới nhân viên",
    },
    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      required: false,
      placeholder: "Mô tả chi tiết về quyền này",
      gridColumn: "span 2",
    },
  ];

  const columns: TableColumn<PermissionDto>[] = [
    {
      field: "module",
      header: "Module",
      width: 150,
      sortable: true,
      body: (row) => <span>{getModuleName(row.module)}</span>,
    },
    {
      field: "code",
      header: "Mã quyền",
      width: 200,
      sortable: true,
    },
    {
      field: "name",
      header: "Tên quyền",
      width: 250,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (rowData) => (
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

  const rowActions: RowAction<PermissionDto>[] = [
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Sửa thông tin",
      severity: "secondary",
      onClick: handleEdit,
    },
    {
      key: "delete",
      icon: PrimeIcons.TRASH,
      tooltip: "Xóa",
      severity: "danger",
      visible: (record) => !record.isDeleted,
      onClick: (row) => {
        setSelectedForDelete(row);
        deleteConfirmRef.current?.show();
      },
    },
  ];

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => handleSearch()}
        onClear={() => handleSearch(true)}
      />

      <TableCustom
        data={data || []}
        columns={columns}
        loading={isLoading || deleting}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
        }}
        onPageChange={(p, s) =>
          setPagination((prev) => ({ ...prev, skip: (p - 1) * s, take: s }))
        }
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <RowActions
              actions={[CommonActions.create(handleCreate)]}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
        rowActions={rowActions}
      />

      <Dialog
        header={editingItem ? "Cập nhật quyền" : "Thêm mới quyền"}
        visible={showDialog}
        style={{ width: "50vw" }}
        onHide={() => setShowDialog(false)}
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
          <div className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
            Hướng dẫn:
          </div>
          <ul className="text-blue-700 dark:text-blue-400 space-y-1 ml-4 list-disc">
            <li>
              Chọn <strong>Module</strong> từ danh sách routes
            </li>
            <li>
              Chọn <strong>Hành động</strong> phù hợp
            </li>
            <li>
              Mã quyền sẽ tự động được tạo theo định dạng:{" "}
              <code className="bg-white dark:bg-gray-800 px-1 rounded">
                MODULE:ACTION
              </code>
            </li>
          </ul>
        </div>

        <FormCustom
          fields={formFields}
          initialValues={{
            ...editingItem,
            module: selectedModule,
            action: selectedAction,
            code: generatedCode,
          }}
          loading={creating || updating}
          onSubmit={handleSubmit}
          onCancel={() => setShowDialog(false)}
          gridColumns={2}
          onChangeValue={(values) => {
            if (values.module !== selectedModule) {
              setSelectedModule(values.module);
            }
            if (values.action !== selectedAction) {
              setSelectedAction(values.action);
            }
          }}
        />
      </Dialog>

      <ActionConfirm
        ref={deleteConfirmRef}
        title="Xác nhận xóa quyền"
        confirmText="Xóa"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDelete}
      />
    </BaseView>
  );
}
