import { areArraysEqual } from "@/common/helpers/arrayHelper";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import { useToast } from "@/context/ToastContext";
import {
  useEmployeeDetail,
  useEmployeeSelectBox,
  useUpdateEmployee,
} from "@/hooks/employee";
import { useFindAllPermissionGroups } from "@/hooks/permission";
import { useFindAllRoles, useRoleSelectBox } from "@/hooks/role";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toolbar } from "primereact/toolbar";
import { Tree } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { useEffect, useMemo, useState } from "react";

interface CustomTreeNode extends TreeNode {
  title?: string;
}

export default function EmployeeAssignmentPage() {
  const { showToast } = useToast();

  const [filters, setFilters] = useState<any>({
    employeeId: null,
    roleIds: [],
  });
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const { data: employees, isLoading: loadingEmps } = useEmployeeSelectBox();
  const { data: roles, isLoading: loadingRoles } = useRoleSelectBox();
  const { data: allRolesInfo } = useFindAllRoles();
  const { data: permissionGroups, isLoading: loadingGroups } =
    useFindAllPermissionGroups();

  const { data: employeeDetail, isLoading: loadingEmpDetail } =
    useEmployeeDetail(filters.employeeId);
  const { onUpdateEmployee, isLoading: savingEmp } = useUpdateEmployee();
  useEffect(() => {
    if (employeeDetail) {
      setFilters((prev: any) => {
        const currentRoleIds = prev.roleIds || [];
        const newRoleIds = employeeDetail.roleIds || [];
        if (areArraysEqual(currentRoleIds, newRoleIds)) {
          return prev;
        }

        return {
          ...prev,
          roleIds: newRoleIds,
        };
      });
    } else {
      setFilters((prev: any) => {
        if (prev.roleIds && prev.roleIds.length > 0) {
          return { ...prev, roleIds: [] };
        }
        return prev;
      });
    }
  }, [employeeDetail]);

  const filterFields: FilterField[] = useMemo(() => {
    return [
      {
        key: "employeeId",
        label: "Nhân viên",
        type: "select",
        col: 6,
        placeholder: "Chọn nhân viên",
        options:
          employees?.map((emp) => ({
            label: `${emp.code} - ${emp.fullName}`,
            value: emp.id,
          })) || [],
        disabled: loadingEmps,
      },
      {
        key: "roleIds",
        label: "Vai trò đảm nhận",
        type: "multiSelect",
        col: 6,
        placeholder: "Chọn các vai trò",
        options:
          roles?.map((role) => ({
            label: `${role.code} - ${role.name}`,
            value: role.id,
          })) || [],
        disabled: loadingRoles || !filters.employeeId,
      },
    ];
  }, [employees, roles, loadingEmps, loadingRoles, filters.employeeId]);

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

  const { selectionKeys, autoExpandedKeys } = useMemo(() => {
    if (!filters.employeeId || !filters.roleIds || !allRolesInfo) {
      return { selectionKeys: {}, autoExpandedKeys: {} };
    }

    const selectedRoleIds = filters.roleIds as any[];
    const effectivePermissionIds = new Set<string>();
    selectedRoleIds.forEach((rId) => {
      const roleInfo = allRolesInfo.find((r) => String(r.id) === String(rId));
      if (roleInfo && roleInfo.permissionIds) {
        roleInfo.permissionIds.forEach((pId) =>
          effectivePermissionIds.add(String(pId))
        );
      }
    });

    const newSelectionKeys: any = {};
    const newExpandedKeys: any = {};

    treeNodes.forEach((groupNode) => {
      const groupKey = groupNode.key as string;
      const children = groupNode.children || [];
      let checkedChildrenCount = 0;

      children.forEach((childNode) => {
        const childKey = childNode.key as string;
        if (effectivePermissionIds.has(String(childKey))) {
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
      if (checkedChildrenCount > 0) newExpandedKeys[groupKey] = true;
    });

    return {
      selectionKeys: newSelectionKeys,
      autoExpandedKeys: newExpandedKeys,
    };
  }, [filters.roleIds, filters.employeeId, allRolesInfo, treeNodes]);

  useEffect(() => {
    if (Object.keys(autoExpandedKeys).length > 0) {
      setExpandedKeys(() => {
        return autoExpandedKeys;
      });
    }
  }, [autoExpandedKeys]);

  const handleSave = () => {
    if (!filters.employeeId) return;

    const payload: any = {
      id: filters.employeeId,
      ...employeeDetail,
      roleIds: filters.roleIds,
    };

    onUpdateEmployee(payload, {
      onSuccess: () => {
        showToast({
          type: "success",
          title: "Thành công",
          message: "Cập nhật vai trò cho nhân viên thành công.",
        });
      },
    });
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

  return (
    <div className="h-full flex flex-col">
      <style>{`
        .read-only-tree .p-checkbox { pointer-events: none; }
        .permission-grid-tree .p-treenode-children { padding-left: 0 !important; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px; padding: 8px 16px; }
      `}</style>

      <div className="mb-4">
        <FilterComponent
          title="Chọn nhân viên & vai trò"
          fields={filterFields}
          filters={filters}
          onFiltersChange={setFilters}
          showSearchButton={false}
          showClearButton={false}
        />
      </div>

      <Toolbar
        className="mb-4 border-none shadow-sm"
        start={
          <div className="text-sm text-gray-500 italic">
            Chọn vai trò ở trên để xem trước quyền hạn tổng hợp.
          </div>
        }
        end={
          <Button
            label="Cập nhật vai trò"
            icon="pi pi-save"
            severity="secondary"
            size="small"
            loading={savingEmp}
            onClick={handleSave}
            disabled={!filters.employeeId}
          />
        }
      />

      <div className="flex-1 rounded-lg shadow-sm border p-0 overflow-hidden relative">
        {!filters.employeeId ? (
          <div className="flex flex-col items-center my-32 justify-center h-full">
            <i className="pi pi-id-card text-6xl my-4 opacity-20"></i>
            <p>Vui lòng chọn nhân viên để bắt đầu</p>
          </div>
        ) : (
          <Panel
            header={
              <div className="flex items-center gap-2">
                <i className="pi pi-shield text-green-500"></i>
                <span>Quyền hạn tổng hợp (Xem trước)</span>
              </div>
            }
            className="h-full border-none"
            pt={{ content: { className: "p-0" } }}
          >
            {loadingGroups || loadingEmpDetail ? (
              <div className="flex justify-center p-10">
                <ProgressSpinner style={{ width: "50px" }} />
              </div>
            ) : (
              <div className="h-[calc(100vh-420px)] overflow-y-auto p-2">
                <Tree
                  value={treeNodes}
                  selectionMode="checkbox"
                  selectionKeys={selectionKeys}
                  onSelectionChange={() => {}}
                  expandedKeys={expandedKeys}
                  onToggle={(e) => setExpandedKeys(e.value)}
                  className="w-full border-none bg-transparent permission-grid-tree read-only-tree"
                  filter
                  filterPlaceholder="Tìm kiếm..."
                  nodeTemplate={nodeTemplate}
                />
              </div>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}
