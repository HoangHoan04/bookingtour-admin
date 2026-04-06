import { enumData } from "@/common/enums/enum";
import { formatDateTime } from "@/common/helpers/format";
import {
  type ActionLogDto,
  ActionType,
  useActionsLogPagination,
} from "@/hooks/actionLog";
import { memo, useMemo, useState } from "react";
import TableCustom, {
  type PaginationConfig,
  type TableColumn,
} from "./TableCustom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

interface ActionLogProps {
  functionType: string;
  functionId?: string;
}

function ActionLog({ functionType, functionId }: ActionLogProps) {
  const [paginationState, setPaginationState] = useState({
    pageIndex: enumData.PAGE.PAGEINDEX,
    pageSize: enumData.PAGE.PAGESIZE,
  });

  const [selectedData, setSelectedData] = useState<{
    old: any;
    next: any;
  } | null>(null);

  const queryPayload = useMemo(() => {
    return {
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      skip: (paginationState.pageIndex - 1) * paginationState.pageSize,
      take: paginationState.pageSize,
      where: {
        functionType: functionType,
        functionId: functionId || "",
      },
    };
  }, [paginationState, functionType, functionId]);

  const { data, total, isLoading } = useActionsLogPagination(queryPayload);

  const columns = useMemo<TableColumn<ActionLogDto>[]>(
    () => [
      {
        field: "createdAt",
        header: "Thời gian",
        body: (rowData: ActionLogDto) => formatDateTime(rowData.createdAt),
        style: { width: "160px" },
      },
      {
        field: "createdByName",
        header: "Người thực hiện",
        body: (rowData: ActionLogDto) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">
              {rowData.createdByName}
            </span>
          </div>
        ),
        style: { width: "180px" },
      },
      {
        field: "type",
        header: "Hành động",
        style: { width: "140px" },
        type: "tag",
        body: (rowData: ActionLogDto) => {
          return (ActionType as any)[rowData.type] || rowData.type;
        },
        tagSeverity: (val) => {
          const v = val?.toString().toUpperCase();
          if (v?.includes("CREATE")) return "success";
          if (v?.includes("UPDATE")) return "warning";
          if (v?.includes("DELETE")) return "danger";
          return "info";
        },
      },
      {
        field: "description",
        header: "Nội dung",
        style: { minWidth: "250px" },
        body: (rowData: ActionLogDto) => (
          <span className="text-sm text-slate-600 leading-relaxed">
            {rowData.description}
          </span>
        ),
      },
      {
        field: "actions",
        header: "Chi tiết",
        style: { width: "100px" },
        body: (rowData: ActionLogDto) => (
          <Button
            icon="pi pi-eye"
            rounded
            text
            severity="info"
            onClick={() => {
              try {
                setSelectedData({
                  old: JSON.parse(rowData.dataOld || "{}"),
                  next: JSON.parse(rowData.dataNew || "{}"),
                });
              } catch (e) {
                console.error("Parse JSON error", e);
              }
            }}
          />
        ),
      },
    ],
    [],
  );

  const paginationConfig = useMemo<PaginationConfig>(
    () => ({
      total: total || 0,
      current: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      showSizeChanger: true,
    }),
    [total, paginationState.pageIndex, paginationState.pageSize],
  );

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginationState({ pageIndex: page, pageSize: pageSize });
  };

  if (!functionId) return null;

  return (
    <div className="mt-2 rounded-xl overflow-hidden shadow-sm">
      <TableCustom<ActionLogDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        pagination={paginationConfig}
        onPageChange={handlePageChange}
        stripedRows
        rowActions={[]}
      />

      {/* Dialog xem chi tiết JSON */}
      <Dialog
        header="Chi tiết thay đổi dữ liệu"
        visible={!!selectedData}
        onHide={() => setSelectedData(null)}
        style={{ width: "60vw" }}
        maximizable
        modal
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Tag value="Dữ liệu cũ" severity="secondary" />
            <pre className="p-3 rounded-lg text-xs overflow-auto border border-slate-200 max-h-96">
              {JSON.stringify(selectedData?.old, null, 2)}
            </pre>
          </div>
          <div className="flex flex-col gap-2">
            <Tag value="Dữ liệu mới" severity="info" />
            <pre className="p-3 rounded-lg text-xs overflow-auto border border-blue-100 max-h-96">
              {JSON.stringify(selectedData?.next, null, 2)}
            </pre>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default memo(ActionLog);
