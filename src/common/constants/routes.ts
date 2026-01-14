export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      translationKey: "auth.login",
      path: "/login",
      isShow: false,
    },
  },

  OTHER: {
    NOTIFICATION: {
      key: "NOTIFICATION",
      translationKey: "menu.notification",
      path: "/notifications",
      isShow: false,
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      translationKey: "menu.home",
      path: "/",
      icon: "pi pi-home",
    },

    TOUR_MANAGER: {
      key: "TOUR_MANAGER",
      translationKey: "menu.tourManager",
      icon: "pi pi-users",
      path: "/tour-manager",
      children: {
        TOUR_LIST: {
          key: "TOUR_LIST",
          translationKey: "menu.tourList",
          path: "/tour-list",
          children: {
            ADD_TOUR: {
              key: "ADD_TOUR",
              translationKey: "tour.add",
              path: "/tour/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_TOUR: {
              key: "EDIT_TOUR",
              translationKey: "tour.edit",
              path: "/tour/edit",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_TOUR: {
              key: "DETAIL_TOUR",
              translationKey: "tour.detail",
              path: "/tour/detail",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
        BOOKING_MANAGER: {
          key: "BOOKING_MANAGER",
          translationKey: "menu.bookingManager",
          path: "/booking-manager",
          children: {
            BOOKING_LIST: {
              key: "BOOKING_LIST",
              translationKey: "menu.bookingList",
              path: "/booking-manager/booking-list",
              isShow: true,
            },
          },
        },
      },
    },

    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      translationKey: "menu.roleManager",
      icon: "pi pi-shield",
      children: {
        ROLE_MANAGER: {
          key: "ROLE_MANAGER",
          translationKey: "menu.role",
          path: "/role",
          children: {
            ADD_ROLE: {
              key: "ADD_ROLE",
              translationKey: "role.add",
              path: "/role/add",
              isShow: false,
            },
            EDIT_ROLE: {
              key: "EDIT_ROLE",
              translationKey: "role.edit",
              path: "/role/edit",
              isShow: false,
            },
            DETAIL_ROLE: {
              key: "DETAIL_ROLE",
              translationKey: "role.detail",
              path: "/role/detail",
              isShow: false,
            },
          },
        },
        ASSIGN_PERMISSION: {
          key: "ASSIGN_PERMISSION",
          translationKey: "menu.roleManager",
          path: "/assign-permission",
          isShow: true,
        },
      },
    },

    SETTING_SYSTEM: {
      key: "SETTING_SYSTEM",
      translationKey: "menu.systemSettings",
      icon: "pi pi-cog",
      children: {
        SETTING_LANGUAGE: {
          key: "SETTING_LANGUAGE",
          translationKey: "settings.language",
          path: "setting-system/setting-language",
        },
        SETTING_STRING: {
          key: "SETTING_STRING",
          translationKey: "settings.dynamicConfig",
          path: "setting-system/setting-string",
        },
      },
    },
  },
};
