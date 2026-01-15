export const API_ROUTES = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4300",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/admin/auth/login",
    LOGOUT: "/api/admin/auth/logout",
    REFRESH_TOKEN: "/api/admin/auth/refresh-token",
    ME: "/api/admin/auth/me",
    UPDATE_PASSWORD: "/api/admin/auth/update-password",
    CHANGE_PASSWORD: "/api/admin/auth/change-password",
  },

  ACTION_LOG: "/api/admin/action-log/pagination",

  NOTIFICATION: {
    PAGINATION: "/api/admin/notify/pagination",
    COUNT_UNREAD: "/api/admin/notify/find-count-notify-not-seen",
    MARK_ALL_READ: "/api/admin/notify/update-seen-all",
    MARK_READ_LIST: "/api/admin/notify/update-seen-list",
    CREATE: "/api/admin/notify/create",
    UPDATE: "/api/admin/notify/update/:id",
    DELETE: "/api/admin/notify/delete/:id",
    DETAIL: "/api/admin/notify/detail/:id",
    GET_SETTINGS: "/api/admin/notify/get-settings",
    UPDATE_SETTINGS: "/api/admin/notify/update-settings",
  },

  CUSTOMER: {
    PAGINATION: "/api/admin/employee/pagination",
    CREATE: "/api/admin/employee/create",
    UPDATE: "/api/admin/employee/update",
    ACTIVATE: "/api/admin/employee/activate",
    DEACTIVATE: "/api/admin/employee/deactivate",
    FIND_BY_ID: "/api/admin/employee/find-by-id",
    SELECT_BOX: "/api/admin/employee/select-box",
    CHANGE_PASSWORD: "/api/admin/employee/change-password",
  },

  UPLOAD_FILE: {
    SINGLE: "/api/admin/upload-files/upload-single",
    MULTI: "/api/admin/upload-files/upload-multi",
  },

  ROLE: {
    PAGINATION: "/api/admin/role/pagination",
    FIND_ALL: "/api/admin/role/find-all",
    CREATE: "/api/admin/role/create",
    UPDATE: "/api/admin/role/update",
    DEACTIVATE: "/api/admin/role/delete",
    FIND_BY_ID: "/api/admin/role/find-by-id",
    SELECT_BOX: "/api/admin/role/select-box",
    ASSIGN_PERMISSIONS: "/api/admin/role/assign-permissions",
    FIND_EMPLOYEES_BY_ROLE: "/api/admin/role/users-by-role",
  },

  TRANSLATIONS: {
    PAGINATION: "/api/admin/translations/pagination",
    CREATE: "/api/admin/translations/create",
    UPDATE: "/api/admin/translations/update",
    DELETE: "/api/admin/translations/delete",
    FIND_BY_KEY: "/api/admin/translations/find-by-key",
  },
};
