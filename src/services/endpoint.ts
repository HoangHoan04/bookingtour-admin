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
    PAGINATION: "/api/admin/customer/pagination",
    CREATE: "/api/admin/customer/create",
    UPDATE: "/api/admin/customer/update",
    ACTIVATE: "/api/admin/customer/activate",
    DEACTIVATE: "/api/admin/customer/deactivate",
    FIND_BY_ID: "/api/admin/customer/find-by-id",
    SELECT_BOX: "/api/admin/customer/select-box",
    CHANGE_PASSWORD: "/api/admin/customer/change-password",
  },

  UPLOAD_FILE: {
    SINGLE: "/api/upload/uploadFiles/upload-single",
    MULTI: "/api/upload/uploadFiles/upload-multi",
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

  BANNER: {
    PAGINATION: "/api/admin/banner/pagination",
    CREATE: "/api/admin/banner/create",
    UPDATE: "/api/admin/banner/update",
    DELETE: "/api/admin/banner/delete",
    FIND_BY_ID: "/api/admin/banner/find-by-id",
    SELECT_BOX: "/api/admin/banner/select-box",
    ACTIVATE: "/api/admin/banner/activate",
    DEACTIVATE: "/api/admin/banner/deactivate",
  },

  NEWS: {
    PAGINATION: "/api/admin/news/pagination",
    CREATE: "/api/admin/news/create",
    UPDATE: "/api/admin/news/update",
    DELETE: "/api/admin/news/delete",
    FIND_BY_ID: "/api/admin/news/find-by-id",
    SELECT_BOX: "/api/admin/news/select-box",
    ACTIVATE: "/api/admin/news/activate",
    DEACTIVATE: "/api/admin/news/deactivate",
  },

  BLOG: {
    PAGINATION: "/api/admin/blog/pagination",
    CREATE: "/api/admin/blog/create",
    UPDATE: "/api/admin/blog/update",
    DELETE: "/api/admin/blog/delete",
    FIND_BY_ID: "/api/admin/blog/find-by-id",
    SELECT_BOX: "/api/admin/blog/select-box",
    ACTIVATE: "/api/admin/blog/activate",
    DEACTIVATE: "/api/admin/blog/deactivate",
    PAGINATION_BLOG_COMMENT: "/api/admin/blog/pagination-blog-comment",
    FIND_BLOG_COMMENT_BY_ID: "/api/admin/blog/find-blog-comment-by-id",
    DELETE_BLOG_COMMENT: "/api/admin/blog/delete-blog-comment",
    RESTORE_BLOG_COMMENT: "/api/admin/blog/restore-blog-comment",
  },

  TRAVEL_HINT: {
    PAGINATION: "/api/admin/travel-hint/pagination",
    CREATE: "/api/admin/travel-hint/create",
    UPDATE: "/api/admin/travel-hint/update",
    DELETE: "/api/admin/travel-hint/delete",
    FIND_BY_ID: "/api/admin/travel-hint/find-by-id",
    ACTIVATE: "/api/admin/travel-hint/activate",
    DEACTIVATE: "/api/admin/travel-hint/deactivate",
  },

  TOUR_GUIDE: {
    PAGINATION: "/api/admin/tour-guide/pagination",
    CREATE: "/api/admin/tour-guide/create",
    UPDATE: "/api/admin/tour-guide/update",
    ACTIVATE: "/api/admin/tour-guide/activate",
    DEACTIVATE: "/api/admin/tour-guide/deactivate",
    FIND_BY_ID: "/api/admin/tour-guide/find-by-id",
    SELECT_BOX: "/api/admin/tour-guide/select-box",
    CHANGE_PASSWORD: "/api/admin/tour-guide/change-password",
  },
};
