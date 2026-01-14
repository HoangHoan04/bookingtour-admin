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
  },

  EMPLOYEE: {
    PAGINATION: "/api/admin/employee/pagination",
    CREATE: "/api/admin/employee/create",
    UPDATE: "/api/admin/employee/update",
    ACTIVATE: "/api/admin/employee/activate",
    DEACTIVATE: "/api/admin/employee/deactivate",
    FIND_BY_ID: "/api/admin/employee/find-by-id",
    SELECT_BOX: "/api/admin/employee/select-box",
    CHANGE_PASSWORD: "/api/admin/employee/change-password",
  },

  COMPANY: {
    PAGINATION: "/api/admin/company/pagination",
    CREATE: "/api/admin/company/create",
    UPDATE: "/api/admin/company/update",
    ACTIVATE: "/api/admin/company/activate",
    DEACTIVATE: "/api/admin/company/deactivate",
    FIND_BY_ID: "/api/admin/company/find-by-id",
    SELECT_BOX: "/api/admin/company/select-box",
    IMPORT: "/api/admin/company/import",
  },

  DEPARTMENT: {
    PAGINATION: "/api/admin/department/pagination",
    CREATE: "/api/admin/department/create",
    UPDATE: "/api/admin/department/update",
    ACTIVATE: "/api/admin/department/activate",
    DEACTIVATE: "/api/admin/department/deactivate",
    FIND_BY_ID: "/api/admin/department/find-by-id",
    SELECT_BOX: "/api/admin/department/select-box",
  },

  DEPARTMENT_TYPE: {
    PAGINATION: "/api/admin/department-type/pagination",
    CREATE: "/api/admin/department-type/create",
    UPDATE: "/api/admin/department-type/update",
    ACTIVATE: "/api/admin/department-type/activate",
    DEACTIVATE: "/api/admin/department-type/deactivate",
    FIND_BY_ID: "/api/admin/department-type/find-by-id",
    SELECT_BOX: "/api/admin/department-type/select-box",
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

  PERMISSION: {
    PAGINATION: "/api/admin/permission/pagination",
    FIND_ALL_GROUPED: "/api/admin/permission/find-all-grouped",
    CREATE: "/api/admin/permission/create",
    UPDATE: "/api/admin/permission/update",
    DELETE: "/api/admin/permission/delete",
  },

  BRANCH: {
    PAGINATION: "/api/admin/branch/pagination",
    CREATE: "/api/admin/branch/create",
    UPDATE: "/api/admin/branch/update",
    ACTIVATE: "/api/admin/branch/activate",
    DEACTIVATE: "/api/admin/branch/deactivate",
    FIND_BY_ID: "/api/admin/branch/find-by-id",
    SELECT_BOX: "/api/admin/branch/select-box",
  },

  POSITION: {
    PAGINATION: "/api/admin/position/pagination",
    CREATE: "/api/admin/position/create",
    UPDATE: "/api/admin/position/update",
    ACTIVATE: "/api/admin/position/activate",
    DEACTIVATE: "/api/admin/position/deactivate",
    FIND_BY_ID: "/api/admin/position/find-by-id",
    SELECT_BOX: "/api/admin/position/select-box",
  },

  POSITION_MASTER: {
    PAGINATION: "/api/admin/position-master/pagination",
    CREATE: "/api/admin/position-master/create",
    UPDATE: "/api/admin/position-master/update",
    ACTIVATE: "/api/admin/position-master/activate",
    DEACTIVATE: "/api/admin/position-master/deactivate",
    FIND_BY_ID: "/api/admin/position-master/find-by-id",
    SELECT_BOX: "/api/admin/position-master/select-box",
  },

  PART: {
    PAGINATION: "/api/admin/part/pagination",
    CREATE: "/api/admin/part/create",
    UPDATE: "/api/admin/part/update",
    ACTIVATE: "/api/admin/part/activate",
    DEACTIVATE: "/api/admin/part/deactivate",
    FIND_BY_ID: "/api/admin/part/find-by-id",
    SELECT_BOX: "/api/admin/part/select-box",
  },

  PART_MASTER: {
    PAGINATION: "/api/admin/part-master/pagination",
    CREATE: "/api/admin/part-master/create",
    UPDATE: "/api/admin/part-master/update",
    ACTIVATE: "/api/admin/part-master/activate",
    DEACTIVATE: "/api/admin/part-master/deactivate",
    FIND_BY_ID: "/api/admin/part-master/find-by-id",
    SELECT_BOX: "/api/admin/part-master/select-box",
  },

  TRANSLATIONS: {
    PAGINATION: "/api/admin/translations/pagination",
    CREATE: "/api/admin/translations/create",
    UPDATE: "/api/admin/translations/update",
    DELETE: "/api/admin/translations/delete",
    FIND_BY_KEY: "/api/admin/translations/find-by-key",
  },

  CHATBOT: {
    CHAT: "/api/admin/chatbot/chat",
    STATS: "/api/admin/chatbot/stats",
    CLEAR_HISTORY: "/api/admin/chatbot/clear-history",
    HISTORY_LIST: "/api/admin/chatbot/history",
    HISTORY_SEARCH: "/api/admin/chatbot/history/search",
    HISTORY_DELETE_ITEM: "/api/admin/chatbot/history/delete-item",
  },

  CHAT: {
    ROOM_PAGINATION: "/api/admin/chat/rooms/pagination",
    ROOM_DETAIL: "/api/admin/chat/rooms/find-by-id",
    MESSAGES: "/api/admin/chat/messages/pagination",
    CREATE_DIRECT: "/api/admin/chat/rooms/direct/create",
    CREATE_GROUP: "/api/admin/chat/rooms/group",
    DELETE_MESSAGE: "/api/admin/chat/messages/delete",
    CALL_HISTORY: "/api/admin/chat/calls/history",
    EDIT_MESSAGE: "/api/admin/chat/messages/edit",
    SEARCH_EMPLOYEES: "/api/admin/chat/search/employees",
    UNREAD_COUNT: "/api/admin/chat/messages/unread-count",
    MARK_ROOM_READ: "/api/admin/chat/rooms/mark-read",
  },
};
