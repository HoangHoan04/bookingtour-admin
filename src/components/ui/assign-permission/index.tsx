import { useTranslation } from "@/context/TranslationContext";
import { Button } from "primereact/button";

interface AssignPermissionProps {
  roleId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function AssignPermission({ onCancel }: AssignPermissionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto border rounded-md p-4"></div>

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
          loading={false}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
