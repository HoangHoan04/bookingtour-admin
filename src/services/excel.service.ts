import * as XLSX from "xlsx";

export interface ExcelColumn {
  field: string;
  header: string;
  width?: number;
  required?: boolean;
  formatter?: (value: any) => any;
}

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  totalRows: number;
  successRows: number;
  errorRows: number;
}

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  columns?: ExcelColumn[];
}

export interface ImportOptions<T> {
  columns: ExcelColumn[];
  validator?: (data: T) => { valid: boolean; errors: string[] };
  transformer?: (data: any) => T;
  onProgress?: (progress: number) => void;
}

class ExcelService {
  async exportToExcel<T>(
    data: T[],
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      filename = `export_${new Date().getTime()}.xlsx`,
      sheetName = "Sheet1",
      columns,
    } = options;

    try {
      let exportData: any[] = [];

      if (columns) {
        exportData = data.map((item: any) => {
          const row: any = {};
          columns.forEach((col) => {
            const value = this.getNestedValue(item, col.field);
            row[col.header] = col.formatter ? col.formatter(value) : value;
          });
          return row;
        });
      } else {
        exportData = data;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      if (columns) {
        const colWidths = columns.map((col) => ({
          wch: col.width || 15,
        }));
        worksheet["!cols"] = colWidths;
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi xuất file Excel");
    }
  }

  async importFromExcel<T>(
    file: File,
    options: ImportOptions<T>
  ): Promise<ImportResult<T>> {
    const { columns, validator, transformer, onProgress } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

          const result: ImportResult<T> = {
            success: true,
            data: [],
            errors: [],
            totalRows: rawData.length,
            successRows: 0,
            errorRows: 0,
          };

          rawData.forEach((row, index) => {
            if (onProgress) {
              onProgress(((index + 1) / rawData.length) * 100);
            }

            try {
              const mappedData: any = {};
              const rowErrors: string[] = [];
              columns.forEach((col) => {
                const value = row[col.header];
                if (
                  col.required &&
                  (value === undefined || value === null || value === "")
                ) {
                  rowErrors.push(`Trường "${col.header}" là bắt buộc`);
                }

                mappedData[col.field] = col.formatter
                  ? col.formatter(value)
                  : value;
              });
              if (rowErrors.length > 0) {
                rowErrors.forEach((error) => {
                  result.errors.push({
                    row: index + 2,
                    field: "",
                    message: error,
                  });
                });
                result.errorRows++;
                return;
              }

              const transformedData = transformer
                ? transformer(mappedData)
                : mappedData;

              if (validator) {
                const validation = validator(transformedData);
                if (!validation.valid) {
                  validation.errors.forEach((error) => {
                    result.errors.push({
                      row: index + 2,
                      field: "",
                      message: error,
                    });
                  });
                  result.errorRows++;
                  return;
                }
              }

              result.data.push(transformedData);
              result.successRows++;
            } catch (error: any) {
              result.errors.push({
                row: index + 2,
                field: "",
                message: error.message || "Lỗi không xác định",
              });
              result.errorRows++;
            }
          });

          result.success = result.errorRows === 0;
          resolve(result);
        } catch (error) {
          reject(new Error("Có lỗi xảy ra khi đọc file Excel"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Có lỗi xảy ra khi đọc file"));
      };

      reader.readAsBinaryString(file);
    });
  }

  async downloadTemplate(
    columns: ExcelColumn[],
    filename: string = "template.xlsx",
    sampleData?: any[]
  ): Promise<void> {
    try {
      const headers = columns.map((col) =>
        col.required ? `${col.header} *` : col.header
      );
      const worksheet = XLSX.utils.aoa_to_sheet([headers]);
      if (sampleData && sampleData.length > 0) {
        const data = sampleData.map((item: any) => {
          return columns.map((col) => {
            const value = this.getNestedValue(item, col.field);
            return col.formatter ? col.formatter(value) : value;
          });
        });
        XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 1 });
      }
      const colWidths = columns.map((col) => ({
        wch: col.width || 20,
      }));
      worksheet["!cols"] = colWidths;
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!worksheet[address]) continue;
        if (columns[C]?.required) {
          worksheet[address].s = {
            font: {
              bold: true,
              color: { rgb: "FF0000" },
            },
          };
        } else {
          worksheet[address].s = {
            font: {
              bold: true,
            },
          };
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi tải template");
    }
  }

  validateExcelFile(file: File): { valid: boolean; error?: string } {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      return {
        valid: false,
        error:
          "File không đúng định dạng. Vui lòng chọn file Excel (.xlsx, .xls)",
      };
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File quá lớn. Kích thước tối đa là 10MB",
      };
    }

    return { valid: true };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }
}

export const excelService = new ExcelService();
