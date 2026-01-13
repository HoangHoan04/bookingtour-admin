import { PrimeIcons } from "primereact/api";
import type { ActionButton } from "./RowAction";

export const CommonActions = {
  create: (onClick?: () => void): ActionButton => ({
    key: "create",
    label: "action.create",
    icon: PrimeIcons.PLUS_CIRCLE,
    severity: "success",
    onClick,
  }),

  update: (onClick?: () => void): ActionButton => ({
    key: "update",
    label: "action.update",
    icon: PrimeIcons.PENCIL,
    severity: "warning",
    onClick,
  }),

  delete: (onClick?: () => void): ActionButton => ({
    key: "delete",
    label: "action.delete",
    icon: PrimeIcons.TRASH,
    severity: "danger",
    onClick,
  }),

  refresh: (onClick?: () => void): ActionButton => ({
    key: "refresh",
    label: "action.refresh",
    icon: PrimeIcons.REFRESH,
    severity: "info",
    onClick,
  }),

  upload: (
    onDownloadTemplate?: () => void,
    onUploadFile?: (file: File) => void
  ): ActionButton => ({
    key: "upload",
    label: "action.importExcel",
    icon: PrimeIcons.FILE_EXCEL,
    severity: "success",
    subActions: [
      {
        key: "download-template",
        label: "action.downloadTemplate",
        icon: PrimeIcons.DOWNLOAD,
        onClick: onDownloadTemplate,
      },
      {
        key: "upload-file",
        label: "action.uploadFile",
        icon: PrimeIcons.UPLOAD,
        onClick: onUploadFile as any,
      },
    ],
  }),

  exportExcel: (onClick?: () => void): ActionButton => ({
    key: "export-excel",
    label: "action.exportExcel",
    icon: PrimeIcons.FILE_EXCEL,
    severity: "success",
    onClick,
  }),

  exportPdf: (onClick?: () => void): ActionButton => ({
    key: "export-pdf",
    label: "action.exportPdf",
    icon: PrimeIcons.FILE_PDF,
    severity: "danger",
    onClick,
  }),

  save: (onClick?: () => void, loading?: boolean): ActionButton => ({
    key: "save",
    label: "action.save",
    icon: PrimeIcons.SAVE,
    severity: "info",
    loading,
    onClick,
  }),

  cancel: (onClick?: () => void): ActionButton => ({
    key: "cancel",
    label: "action.cancel",
    icon: PrimeIcons.TIMES,
    severity: "secondary",
    onClick,
  }),

  view: (onClick?: () => void): ActionButton => ({
    key: "view",
    label: "action.view",
    icon: PrimeIcons.EYE,
    severity: "info",
    onClick,
  }),

  copy: (onClick?: () => void): ActionButton => ({
    key: "copy",
    label: "action.copy",
    icon: PrimeIcons.COPY,
    severity: "help",
    onClick,
  }),

  print: (onClick?: () => void): ActionButton => ({
    key: "print",
    label: "action.print",
    icon: PrimeIcons.PRINT,
    severity: "secondary",
    onClick,
  }),

  filter: (onClick?: () => void): ActionButton => ({
    key: "filter",
    label: "action.filter",
    icon: PrimeIcons.FILTER,
    severity: "info",
    onClick,
  }),

  settings: (onClick?: () => void): ActionButton => ({
    key: "settings",
    label: "action.settings",
    icon: PrimeIcons.COG,
    severity: "secondary",
    onClick,
  }),

  approve: (onClick?: () => void): ActionButton => ({
    key: "approve",
    label: "action.approve",
    icon: PrimeIcons.CHECK_CIRCLE,
    severity: "success",
    onClick,
  }),

  reject: (onClick?: () => void): ActionButton => ({
    key: "reject",
    label: "action.reject",
    icon: PrimeIcons.TIMES_CIRCLE,
    severity: "danger",
    onClick,
  }),
};
