import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import { useToast } from "@/context/ToastContext";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useFindAllPermissionGroups } from "@/hooks/permission";
import {
  useAssignPermissions,
  useEmployeesByRole,
  useRoleDetail,
  useRoleSelectBox,
} from "@/hooks/role";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toolbar } from "primereact/toolbar";
import { Tree } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { useEffect, useMemo, useState } from "react";

interface CustomTreeNode extends TreeNode {
  title?: string;
}

export default function RoleAssignmentPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<any>({ roleId: null });
  const [selectionKeys, setSelectionKeys] = useState<any>({});
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [showEmpDialog, setShowEmpDialog] = useState(false);
  const [employeeList, setEmployeeList] = useState<EmployeeDto[]>([]);

  const { data: roles, isLoading: loadingRoles } = useRoleSelectBox();
  const { data: permissionGroups, isLoading: loadingGroups } =
    useFindAllPermissionGroups();
  const {
    data: roleDetail,
    isLoading: loadingRoleDetail,
    refetch: refetchRoleDetail,
  } = useRoleDetail(filters.roleId);

  const { onAssignPermissions, isPending: saving } = useAssignPermissions();
  const { getEmployees, isLoading: loadingEmps } = useEmployeesByRole();

  const filterFields: FilterField[] = useMemo(() => {
    return [
      {
        key: "roleId",
        label: "Vai trò",
        type: "select",
        placeholder: "Chọn vai trò để phân quyền",
        options:
          roles?.map((role) => ({
            label: `${role.code} - ${role.name}`,
            value: role.id,
          })) || [],
        disabled: loadingRoles,
      },
    ];
  }, [roles, loadingRoles]);

  const treeNodes: CustomTreeNode[] = useMemo(() => {
    if (!permissionGroups || permissionGroups.length === 0) return [];

    return permissionGroups.map((group) => ({
      key: group.module,
      label: group.module,
      data: "MODULE_GROUP",
      children: group.items.map((perm) => ({
        key: perm.id,
        label: perm.name,
        title: `${perm.code} - ${perm.name}`,
        data: "PERMISSION_ITEM",
      })),
    }));
  }, [permissionGroups]);

  useEffect(() => {
    if (!filters.roleId) {
      setSelectionKeys({});
      return;
    }

    refetchRoleDetail();

    if (!treeNodes.length || !roleDetail) return;

    const currentPermissionIds = roleDetail.permissionIds || [];
    const newSelectionKeys: any = {};
    const newExpandedKeys: any = {};

    treeNodes.forEach((groupNode) => {
      const groupKey = groupNode.key as string;
      const children = groupNode.children || [];
      let checkedChildrenCount = 0;

      children.forEach((childNode) => {
        const childKey = childNode.key as string;
        const isMatch = currentPermissionIds.some(
          (id) =>
            id.toString().toLowerCase() === childKey.toString().toLowerCase()
        );

        if (isMatch) {
          newSelectionKeys[childKey] = { checked: true, partialChecked: false };
          checkedChildrenCount++;
        }
      });

      if (children.length > 0) {
        if (checkedChildrenCount === children.length) {
          newSelectionKeys[groupKey] = { checked: true, partialChecked: false };
        } else if (checkedChildrenCount > 0) {
          newSelectionKeys[groupKey] = { checked: false, partialChecked: true };
        }
      }
      newExpandedKeys[groupKey] = true;
    });

    setSelectionKeys(newSelectionKeys);
    setExpandedKeys(newExpandedKeys);
  }, [filters.roleId, roleDetail, treeNodes, refetchRoleDetail]);

  const handleSave = () => {
    if (!filters.roleId) return;
    const selectedPermissionIds = Object.keys(selectionKeys || {}).filter(
      (key) => {
        const nodeState = selectionKeys[key];
        const isModuleKey = permissionGroups?.some((g) => g.module === key);
        return nodeState.checked && !isModuleKey;
      }
    );

    onAssignPermissions(
      { roleId: filters.roleId, permissionIds: selectedPermissionIds },
      {
        onSuccess: () => {
          showToast({
            type: "success",
            title: "Thành công",
            message: "Đã cập nhật quyền hạn",
            timeout: 3000,
          });
          refetchRoleDetail();
        },
      }
    );
  };

  const handleViewEmployees = async () => {
    if (!filters.roleId) return;
    const res = await getEmployees(filters.roleId);
    if (res && res.data) {
      setEmployeeList(res.data);
      setShowEmpDialog(true);
    }
  };

  const nodeTemplate = (node: CustomTreeNode) => {
    if (node.data === "MODULE_GROUP") {
      return (
        <div className="font-bold uppercase text-sm py-1">
          <i className="pi pi-folder-open mr-2 "></i>
          {node.label}
        </div>
      );
    }
    return (
      <div className="text-sm truncate w-full" title={node.title}>
        {node.label}
      </div>
    );
  };

  const startContent = (
    <div className="flex align-items-center gap-2">
      {filters.roleId && (
        <Button
          label={`Xem nhân viên (${
            employeeList.length > 0 ? employeeList.length : "?"
          })`}
          icon="pi pi-users"
          severity="info"
          outlined
          size="small"
          loading={loadingEmps}
          onClick={handleViewEmployees}
        />
      )}
    </div>
  );

  const endContent = (
    <Button
      label="Lưu thay đổi"
      icon="pi pi-save"
      severity="secondary"
      size="small"
      loading={saving}
      onClick={handleSave}
      disabled={!filters.roleId}
    />
  );

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .permission-grid-tree .p-treenode-children {
            padding-left: 0 !important;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 8px;
            padding: 8px 16px;
        }
        .permission-grid-tree .p-treenode[aria-level="1"] > .p-treenode-content {
            border-radius: 6px;
            margin-bottom: 4px;
            padding: 0.5rem 0.5rem !important;
        }
        .permission-grid-tree .p-treenode[aria-level="2"] {
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
        }
        .permission-grid-tree .p-treenode[aria-level="2"] .p-treenode-content {
            width: 100%;
            padding: 6px !important;
            transition: all 0.2s;
        }
        .permission-grid-tree .p-treenode[aria-level="2"] .p-tree-toggler {
            display: none !important;
        }
        .permission-grid-tree .p-checkbox {
            width: 18px;
            height: 18px;
            margin-right: 8px;
        }
      `}</style>

      <div className="mb-4">
        <FilterComponent
          title="Chọn vai trò phân quyền"
          fields={filterFields}
          filters={filters}
          onFiltersChange={setFilters}
          showSearchButton={false}
          showClearButton={false}
        />
        <Toolbar
          start={startContent}
          end={endContent}
          className="mb-4 border-none shadow-sm"
        />
      </div>

      <div className="flex-1 rounded-lg shadow-sm border p-0 overflow-hidden relative">
        {!filters.roleId ? (
          <div className="flex flex-col items-center my-32 justify-center h-full">
            <i className="pi pi-id-card text-6xl my-4 opacity-20"></i>
            <p>Vui lòng chọn một vai trò ở trên để bắt đầu</p>
          </div>
        ) : (
          <Panel
            header={
              <div className="flex items-center gap-2">
                <i className="pi pi-list text-blue-500"></i>
                <span>
                  Quyền hạn hiện tại:{" "}
                  <span className="text-blue-600 font-bold">
                    {roleDetail?.name}
                  </span>
                </span>
              </div>
            }
            className="h-full border-none"
            pt={{ content: { className: "p-0" } }}
          >
            {loadingGroups || loadingRoleDetail ? (
              <div className="flex justify-center p-10">
                <ProgressSpinner style={{ width: "50px" }} />
              </div>
            ) : (
              <div className="h-[calc(100vh-420px)] overflow-y-auto  p-2">
                <Tree
                  value={treeNodes}
                  selectionMode="checkbox"
                  selectionKeys={selectionKeys}
                  onSelectionChange={(e) => setSelectionKeys(e.value)}
                  expandedKeys={expandedKeys}
                  onToggle={(e) => setExpandedKeys(e.value)}
                  className="w-full border-none bg-transparent permission-grid-tree"
                  filter
                  filterPlaceholder="Tìm kiếm nhanh quyền..."
                  nodeTemplate={nodeTemplate}
                />
              </div>
            )}
          </Panel>
        )}
      </div>

      <Dialog
        header={`Nhân viên thuộc vai trò: ${
          roles?.find((r) => r.id === filters.roleId)?.name || ""
        }`}
        visible={showEmpDialog}
        style={{ width: "50vw" }}
        onHide={() => setShowEmpDialog(false)}
      >
        <DataTable
          value={employeeList}
          paginator
          rows={5}
          size="small"
          emptyMessage="Chưa có nhân viên nào được gán vai trò này"
          stripedRows
        >
          <Column
            field="code"
            header="Mã NV"
            sortable
            style={{ width: "15%" }}
          ></Column>
          <Column
            field="fullName"
            header="Họ và tên"
            sortable
            body={(rowData: EmployeeDto) => (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]">
                  {rowData.firstName?.charAt(0)}
                </div>
                <span className="font-medium">
                  {rowData.fullName ||
                    `${rowData.lastName} ${rowData.firstName}`}
                </span>
              </div>
            )}
          ></Column>
          <Column field="email" header="Email"></Column>
          <Column
            field="position.name"
            header="Chức vụ"
            body={(row) => row.position?.name || "-"}
          ></Column>
        </DataTable>

        <div className="flex justify-end mt-4">
          <Button
            label="Đóng"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={() => setShowEmpDialog(false)}
          />
        </div>
      </Dialog>
    </div>
  );
}
