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

    // Quản lý người dùng
    USER_MANAGER: {
      key: "USER_MANAGER",
      translationKey: "menu.userManager",
      icon: "pi pi-user",
      path: "/user-manager",
      children: {
        CUSTOMER_MANAGER: {
          key: "CUSTOMER_MANAGER",
          translationKey: "menu.customerManager",
          path: "/customer-manager",
          children: {
            ADD_CUSTOMER: {
              key: "ADD_CUSTOMER",
              translationKey: "customer.add",
              path: "/customer/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_CUSTOMER: {
              key: "EDIT_CUSTOMER",
              translationKey: "customer.edit",
              path: "/customer/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_CUSTOMER: {
              key: "DETAIL_CUSTOMER",
              translationKey: "customer.detail",
              path: "/customer/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
        TOUR_GUIDE_MANAGER: {
          key: "TOUR_GUIDE_MANAGER",
          translationKey: "menu.tourguideManager",
          path: "/tourguide-manager",
          children: {
            ADD_TOUR_GUIDE: {
              key: "ADD_TOUR_GUIDE",
              translationKey: "tourguide.add",
              path: "/tourguide/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_TOUR_GUIDE: {
              key: "EDIT_TOUR_GUIDE",
              translationKey: "tourguide.edit",
              path: "/tourguide/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_TOUR_GUIDE: {
              key: "DETAIL_TOUR_GUIDE",
              translationKey: "tourguide.detail",
              path: "/tourguide/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý tour
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
              path: "/tour/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_TOUR: {
              key: "DETAIL_TOUR",
              translationKey: "tour.detail",
              path: "/tour/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
        DESTINATION_MANAGER: {
          key: "DESTINATION_MANAGER",
          translationKey: "menu.destinationManager",
          path: "/destination-manager",
          children: {
            ADD_DESTINATION: {
              key: "ADD_DESTINATION",
              translationKey: "menu.addDestination",
              path: "/destination-manager/add",
              isShow: false,
            },
            EDIT_DESTINATION: {
              key: "EDIT_DESTINATION",
              translationKey: "menu.editDestination",
              path: "/destination-manager/edit/:id",
              isShow: false,
            },
            DETAIL_DESTINATION: {
              key: "DETAIL_DESTINATION",
              translationKey: "menu.detailDestination",
              path: "/destination-manager/detail/:id",
              isShow: false,
            },
          },
        },
        BOOKING_MANAGER: {
          key: "BOOKING_MANAGER",
          translationKey: "menu.bookingManager",
          path: "/booking-manager",
          children: {
            ADD_BOOKING: {
              key: "ADD_BOOKING",
              translationKey: "menu.addBooking",
              path: "/booking-manager/add",
              isShow: false,
            },
            EDIT_BOOKING: {
              key: "EDIT_BOOKING",
              translationKey: "menu.editBooking",
              path: "/booking-manager/edit/:id",
              isShow: false,
            },
            DETAIL_BOOKING: {
              key: "DETAIL_BOOKING",
              translationKey: "menu.detailBooking",
              path: "/booking-manager/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý tin tức
    NEW_MANAGER: {
      key: "NEW_MANAGER",
      translationKey: "menu.newManager",
      icon: "pi pi-images",
      path: "/new-manager",
      children: {
        // Banner
        BANNER_MANAGER: {
          key: "BANNER_MANAGER",
          translationKey: "menu.bannerManager",
          path: "/banner-manager",
          children: {
            ADD_BANNER: {
              key: "ADD_BANNER",
              translationKey: "menu.addBanner",
              path: "/banner/add",
              isShow: false,
            },
            EDIT_BANNER: {
              key: "EDIT_BANNER",
              translationKey: "menu.editBanner",
              path: "/banner/edit/:id",
              isShow: false,
            },
            DETAIL_BANNER: {
              key: "DETAIL_BANNER",
              translationKey: "menu.detailBanner",
              path: "/banner/detail/:id",
              isShow: false,
            },
          },
        },
        NEW_LIST: {
          key: "NEW_LIST",
          translationKey: "menu.newManager",
          path: "/new-list",
          children: {
            ADD_NEW: {
              key: "ADD_NEW",
              translationKey: "menu.addNew",
              path: "/new/add",
              isShow: false,
            },
            EDIT_NEW: {
              key: "EDIT_NEW",
              translationKey: "menu.editNew",
              path: "/new/edit/:id",
              isShow: false,
            },
            DETAIL_NEW: {
              key: "DETAIL_NEW",
              translationKey: "menu.detailNew",
              path: "/new/detail/:id",
              isShow: false,
            },
          },
        },
        BLOG_MANAGER: {
          key: "BLOG_MANAGER",
          translationKey: "menu.blogManager",
          path: "/blog-manager",
          children: {
            ADD_BLOG: {
              key: "ADD_BLOG",
              translationKey: "menu.addBlog",
              path: "/blog/add",
              isShow: false,
            },
            EDIT_BLOG: {
              key: "EDIT_BLOG",
              translationKey: "menu.editBlog",
              path: "/blog/edit/:id",
              isShow: false,
            },
            DETAIL_BLOG: {
              key: "DETAIL_BLOG",
              translationKey: "menu.detailBlog",
              path: "/blog/detail/:id",
              isShow: false,
            },
          },
        },
        TRAVEL_HINT_MANAGER: {
          key: "TRAVEL_HINT_MANAGER",
          translationKey: "menu.travelHintManager",
          path: "/travel-hint-manager",
          children: {
            ADD_TRAVEL_HINT: {
              key: "ADD_TRAVEL_HINT",
              translationKey: "menu.addTravelHint",
              path: "/travel-hint/add",
              isShow: false,
            },
            EDIT_TRAVEL_HINT: {
              key: "EDIT_TRAVEL_HINT",
              translationKey: "menu.editTravelHint",
              path: "/travel-hint/edit/:id",
              isShow: false,
            },
            DETAIL_TRAVEL_HINT: {
              key: "DETAIL_TRAVEL_HINT",
              translationKey: "menu.detailTravelHint",
              path: "/travel-hint/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý vai trò - quyền
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
