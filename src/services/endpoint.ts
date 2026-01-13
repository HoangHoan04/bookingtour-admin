export const API_ROUTES = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3300",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    ME: "/api/auth/me",
    UPDATE_PASSWORD: "/api/auth/update-password",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },

  ACTION_LOG: "/api/action-log/pagination",

  NOTIFICATION: {
    PAGINATION: "/api/notify/pagination",
    COUNT_UNREAD: "/api/notify/find-count-notify-not-seen",
    MARK_ALL_READ: "/api/notify/update-seen-all",
    MARK_READ_LIST: "/api/notify/update-seen-list",
  },

  EMPLOYEE: {
    PAGINATION: "/api/employee/pagination",
    CREATE: "/api/employee/create",
    UPDATE: "/api/employee/update",
    ACTIVATE: "/api/employee/activate",
    DEACTIVATE: "/api/employee/deactivate",
    FIND_BY_ID: "/api/employee/find-by-id",
    SELECT_BOX: "/api/employee/select-box",
    CHANGE_PASSWORD: "/api/employee/change-password",
  },

  COMPANY: {
    PAGINATION: "/api/company/pagination",
    CREATE: "/api/company/create",
    UPDATE: "/api/company/update",
    ACTIVATE: "/api/company/activate",
    DEACTIVATE: "/api/company/deactivate",
    FIND_BY_ID: "/api/company/find-by-id",
    SELECT_BOX: "/api/company/select-box",
    IMPORT: "/api/company/import",
  },

  DEPARTMENT: {
    PAGINATION: "/api/department/pagination",
    CREATE: "/api/department/create",
    UPDATE: "/api/department/update",
    ACTIVATE: "/api/department/activate",
    DEACTIVATE: "/api/department/deactivate",
    FIND_BY_ID: "/api/department/find-by-id",
    SELECT_BOX: "/api/department/select-box",
  },

  DEPARTMENT_TYPE: {
    PAGINATION: "/api/department-type/pagination",
    CREATE: "/api/department-type/create",
    UPDATE: "/api/department-type/update",
    ACTIVATE: "/api/department-type/activate",
    DEACTIVATE: "/api/department-type/deactivate",
    FIND_BY_ID: "/api/department-type/find-by-id",
    SELECT_BOX: "/api/department-type/select-box",
  },

  UPLOAD_FILE: {
    SINGLE: "/api/upload-files/upload-single",
    MULTI: "/api/upload-files/upload-multi",
  },

  ROLE: {
    PAGINATION: "/api/role/pagination",
    FIND_ALL: "/api/role/find-all",
    CREATE: "/api/role/create",
    UPDATE: "/api/role/update",
    DEACTIVATE: "/api/role/delete",
    FIND_BY_ID: "/api/role/find-by-id",
    SELECT_BOX: "/api/role/select-box",
    ASSIGN_PERMISSIONS: "/api/role/assign-permissions",
    FIND_EMPLOYEES_BY_ROLE: "/api/role/users-by-role",
  },

  PERMISSION: {
    PAGINATION: "/api/permission/pagination",
    FIND_ALL_GROUPED: "/api/permission/find-all-grouped",
    CREATE: "/api/permission/create",
    UPDATE: "/api/permission/update",
    DELETE: "/api/permission/delete",
  },

  BRANCH: {
    PAGINATION: "/api/branch/pagination",
    CREATE: "/api/branch/create",
    UPDATE: "/api/branch/update",
    ACTIVATE: "/api/branch/activate",
    DEACTIVATE: "/api/branch/deactivate",
    FIND_BY_ID: "/api/branch/find-by-id",
    SELECT_BOX: "/api/branch/select-box",
  },

  POSITION: {
    PAGINATION: "/api/position/pagination",
    CREATE: "/api/position/create",
    UPDATE: "/api/position/update",
    ACTIVATE: "/api/position/activate",
    DEACTIVATE: "/api/position/deactivate",
    FIND_BY_ID: "/api/position/find-by-id",
    SELECT_BOX: "/api/position/select-box",
  },

  POSITION_MASTER: {
    PAGINATION: "/api/position-master/pagination",
    CREATE: "/api/position-master/create",
    UPDATE: "/api/position-master/update",
    ACTIVATE: "/api/position-master/activate",
    DEACTIVATE: "/api/position-master/deactivate",
    FIND_BY_ID: "/api/position-master/find-by-id",
    SELECT_BOX: "/api/position-master/select-box",
  },

  PART: {
    PAGINATION: "/api/part/pagination",
    CREATE: "/api/part/create",
    UPDATE: "/api/part/update",
    ACTIVATE: "/api/part/activate",
    DEACTIVATE: "/api/part/deactivate",
    FIND_BY_ID: "/api/part/find-by-id",
    SELECT_BOX: "/api/part/select-box",
  },

  PART_MASTER: {
    PAGINATION: "/api/part-master/pagination",
    CREATE: "/api/part-master/create",
    UPDATE: "/api/part-master/update",
    ACTIVATE: "/api/part-master/activate",
    DEACTIVATE: "/api/part-master/deactivate",
    FIND_BY_ID: "/api/part-master/find-by-id",
    SELECT_BOX: "/api/part-master/select-box",
  },

  TRANSLATIONS: {
    PAGINATION: "/api/translations/pagination",
    CREATE: "/api/translations/create",
    UPDATE: "/api/translations/update",
    DELETE: "/api/translations/delete",
    FIND_BY_KEY: "/api/translations/find-by-key",
  },

  CHATBOT: {
    CHAT: "/api/chatbot/chat",
    STATS: "/api/chatbot/stats",
    CLEAR_HISTORY: "/api/chatbot/clear-history",
    HISTORY_LIST: "/api/chatbot/history",
    HISTORY_SEARCH: "/api/chatbot/history/search",
    HISTORY_DELETE_ITEM: "/api/chatbot/history/delete-item",
  },

  CHAT: {
    ROOM_PAGINATION: "/api/chat/rooms/pagination",
    ROOM_DETAIL: "/api/chat/rooms/find-by-id",
    MESSAGES: "/api/chat/messages/pagination",
    CREATE_DIRECT: "/api/chat/rooms/direct/create",
    CREATE_GROUP: "/api/chat/rooms/group",
    DELETE_MESSAGE: "/api/chat/messages/delete",
    CALL_HISTORY: "/api/chat/calls/history",
    EDIT_MESSAGE: "/api/chat/messages/edit",
    SEARCH_EMPLOYEES: "/api/chat/search/employees",
    UNREAD_COUNT: "/api/chat/messages/unread-count",
    MARK_ROOM_READ: "/api/chat/rooms/mark-read",
  },
};
