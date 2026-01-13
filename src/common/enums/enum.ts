export const enumData = {
  maxSizeUpload: 10,
  PAGE: {
    PAGEINDEX: 1,
    PAGESIZE: 10,
    PAGESIZE_MAX: 1000000,
    LST_PAGESIZE: [10, 20, 50, 100],
    TOTAL: 0,
  },

  TRUE_FALSE: {
    TRUE: { value: "true", code: "TRUE", name: "Có" },
    FALSE: { value: "false", code: "FALSE", name: "Không" },
  },

  STATUS_FILTER: {
    ALL: { value: undefined, code: "ALL", name: "Tất cả" },
    ACTIVE: { value: false, code: "ACTIVE", name: "Đang hoạt động" },
    INACTIVE: { value: true, code: "INACTIVE", name: "Ngưng hoạt động" },
  },

  DATA_TYPE: {
    STRING: { code: "STRING", name: "Kiểu chuỗi", format: "" },
    INT: { code: "INT", name: "Kiểu sổ nguyên", format: "" },
    FLOAT: { code: "FLOAT", name: "Kiểu sổ thập phân", format: "" },
    DATE: { code: "DATE", name: "Kiểu ngày", format: "dd/MM/yyyy" },
    DATETIME: {
      code: "DATETIME",
      name: "Kiểu ngày giờ",
      format: "dd/MM/yyyy HH:mm:ss",
    },
    TIME: { code: "TIME", name: "Kiểu giờ", format: "HH:mm:ss" },
    BOOLEAN: { code: "BOOLEAN", name: "Kiểu checkbox", format: "" },
  },

  DAY_IN_WEEK: {
    SUNDAY: { code: "SUNDAY", name: "Chủ nhật" },
    MONDAY: { code: "MONDAY", name: "Thứ hai" },
    TUESDAY: { code: "TUESDAY", name: "Thứ ba" },
    WEDNESDAY: { code: "WEDNESDAY", name: "Thứ tư" },
    THURSDAY: { code: "THURSDAY", name: "Thứ năm" },
    FRIDAY: { code: "FRIDAY", name: "Thứ sáu" },
    SATURDAY: { code: "SATURDAY", name: "Thứ bảy" },
  },

  GENDER: {
    MALE: { code: "MALE", name: "Nam" },
    FEMALE: { code: "FEMALE", name: "Nữ" },
  },

  USER_TYPE: {
    EMPLOYEE: { code: "EMPLOYEE", name: "Nhân viên", description: "" },
    ADMIN: { code: "ADMIN", name: "Admin", description: "" },
  },

  ACTION_LOG_TYPE: {
    ADD: { code: "ADD", name: "Thêm mới", type: "ThemMoi" },
    DELETE: { code: "DELETE", name: "Xoá bỏ", type: "XoaBo" },
    UPDATE: { code: "UPDATE", name: "Cập nhật", type: "CapNhat" },
    SYNC: { code: "SYNC", name: "Đồng bộ", type: "DongBo" },
    EDIT: { code: "EDIT", name: "Chỉnh sửa", type: "ChinhSua" },
    APPROVE: { code: "APPROVE", name: "Duyệt", type: "Duyet" },
    SEND_APPROVE: { code: "SEND_APPROVE", name: "Gửi Duyệt", type: "GuiDuyet" },
    REJECT: { code: "REJECT", name: "Từ chối", type: "TuChoi" },
    CANCEL: { code: "CANCEL", name: "Huỷ", type: "Huy" },
    IMPORT_EXCEL: {
      code: "IMPORT_EXCEL",
      name: "Nhập excel",
      type: "NhapExcel",
    },
    ACTIVATE: { code: "ACTIVATE", name: "Kích hoạt", type: "KichHoat" },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      type: "NgungHoatDong",
    },
  },

  EMPLOYEE_STATUS: {
    PENDING: { code: "PENDING", name: "Chờ duyệt", color: "#e8af4f" },
    RECRUITED: { code: "RECRUITED", name: "Đã trúng tuyển", color: "#3794bf" },
    WORKING: { code: "WORKING", name: "Đang làm việc", color: "#0b5a23" },
    STOP_WORKING: { code: "STOP_WORKING", name: "Thôi việc", color: "#f13060" },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      color: "#bf4537",
    },
    NOT_APPROVED: {
      code: "NOT_APPROVED",
      name: "Từ chối duyệt trúng tuyển",
      color: "red",
    },
  },

  BRANCH_TYPE: {
    HEAD_OFFICE: { code: "HEAD_OFFICE", name: "Trụ sở chính" },
    BRANCH: { code: "BRANCH", name: "Chi nhánh" },
  },

  MARITAL_STATUS: {
    SINGLE: { code: "SINGLE", name: "Độc thân" },
    MARRIED: { code: "MARRIED", name: "Đã kết hôn" },
    DIVORCED: { code: "DIVORCED", name: "Ly dị" },
    WIDOWED: { code: "WIDOWED", name: "Góa" },
  },

  EMPLOYEE_LEVEL: {
    INTERN: { code: "INTERN", name: "Thực tập sinh" },
    FRESHER: { code: "FRESHER", name: "Nhân viên mới" },
    JUNIOR: { code: "JUNIOR", name: "Nhân viên cấp thấp" },
    MIDDLE: { code: "MIDDLE", name: "Nhân viên cấp trung" },
    SENIOR: { code: "SENIOR", name: "Nhân viên cấp cao" },
    LEAD: { code: "LEAD", name: "Trưởng nhóm" },
    MANAGER: { code: "MANAGER", name: "Quản lý" },
    DIRECTOR: { code: "DIRECTOR", name: "Giám đốc" },
  },

  WORKING_MODEL: {
    FULLTIME: { code: "FULLTIME", name: "Toàn thời gian" },
    PARTTIME: { code: "PARTTIME", name: "Bán thời gian" },
    CONTRACT: { code: "CONTRACT", name: "Hợp đồng" },
    FREELANCE: { code: "FREELANCE", name: "Tự do" },
  },

  CONTRACT_TYPE: {
    PROBATION: { code: "PROBATION", name: "Thử việc" },
    DEFINITE: { code: "DEFINITE", name: "Xác định thời hạn" },
    INDEFINITE: { code: "INDEFINITE", name: "Không xác định thời hạn" },
    SEASONAL: { code: "SEASONAL", name: "Theo mùa vụ" },
  },

  PROBATION_STATUS: {
    PENDING: { code: "PENDING", name: "Chờ duyệt" },
    PASSED: { code: "PASSED", name: "Đã hoàn thành" },
    FAILED: { code: "FAILED", name: "Không đạt" },
  },
};

export const millisecondInDay = 86400000;

type GenderKey = keyof typeof enumData.GENDER;
export const getGenderName = (key: GenderKey): string => {
  return enumData.GENDER[key]?.name || "N/A";
};
