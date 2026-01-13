import { useTranslation } from "@/context/TranslationContext";
import { useFindAllPermissionGroups } from "@/hooks/permission";
import { useAssignPermissions, useRoleDetail } from "@/hooks/role";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tree } from "primereact/tree";
import type { TreeNode } from "primereact/treenode";
import { useEffect, useMemo, useState } from "react";

interface AssignPermissionProps {
  roleId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function AssignPermission({
  roleId,
  onCancel,
  onSuccess,
}: AssignPermissionProps) {
  const { t } = useTranslation();
  const { data: permissionGroups, isLoading: loadingGroups } =
    useFindAllPermissionGroups();
  const {
    data: roleDetail,
    isLoading: loadingRole,
    refetch,
  } = useRoleDetail(roleId);
  const { onAssignPermissions, isPending: submitting } = useAssignPermissions();

  const [selectionKeys, setSelectionKeys] = useState<any>({});
  const [expandedKeys, setExpandedKeys] = useState<any>({});

  useEffect(() => {
    if (roleId) {
      refetch();
    }
  }, [roleId, refetch]);

  const treeNodes: TreeNode[] = useMemo(() => {
    if (!permissionGroups || permissionGroups.length === 0) return [];

    return permissionGroups.map((group) => ({
      key: group.module,
      label: group.module,
      data: "MODULE_GROUP",
      children: group.items.map((perm) => ({
        key: perm.id,
        label: `${perm.code} - ${perm.name}`,
        data: perm.id,
      })),
    }));
  }, [permissionGroups]);

  useEffect(() => {
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
          (backendId) =>
            backendId.toString().toLowerCase() ===
            childKey.toString().toLowerCase()
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
  }, [treeNodes, roleDetail]);

  const handleSave = () => {
    const selectedPermissionIds = Object.keys(selectionKeys || {}).filter(
      (key) => {
        const nodeState = selectionKeys[key];
        const isModuleKey = permissionGroups?.some((g) => g.module === key);
        return nodeState.checked && !isModuleKey;
      }
    );

    onAssignPermissions(
      { roleId, permissionIds: selectedPermissionIds },
      {
        onSuccess: () => {
          refetch().then(() => {
            if (onSuccess) onSuccess();
            onCancel();
          });
        },
      }
    );
  };

  if (loadingGroups || loadingRole) {
    return (
      <div className="flex justify-center items-center h-60">
        <ProgressSpinner style={{ width: "40px" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto border rounded-md p-4">
        {treeNodes.length === 0 ? (
          <div className="text-center mt-10">
            {t("assignPermission.noData")}
          </div>
        ) : (
          <Tree
            value={treeNodes}
            selectionMode="checkbox"
            selectionKeys={selectionKeys}
            onSelectionChange={(e) => setSelectionKeys(e.value)}
            expandedKeys={expandedKeys}
            onToggle={(e) => setExpandedKeys(e.value)}
            className="w-full border-none p-0"
            filter
            filterPlaceholder={t("assignPermission.searchPlaceholder")}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-2 border-t">
        <Button
          label={t("action.cancel")}
          icon="pi pi-times"
          className="p-button-text p-button-secondary"
          onClick={onCancel}
        />
        <Button
          label={t("action.save")}
          icon="pi pi-save"
          loading={submitting}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
