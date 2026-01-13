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
    CHAT: {
      key: "CHAT",
      translationKey: "menu.chat",
      path: "/chat",
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

    HUMAN_RESOURCE: {
      key: "HUMAN_RESOURCE",
      translationKey: "menu.humanResource",
      icon: "pi pi-users",
      path: "/human-resource",
      children: {
        EMPLOYEE_MANAGER: {
          key: "EMPLOYEE_MANAGER",
          translationKey: "menu.employee",
          path: "/employee",
          children: {
            ADD_EMPLOYEE: {
              key: "ADD_EMPLOYEE",
              translationKey: "employee.add",
              path: "/employee/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_EMPLOYEE: {
              key: "EDIT_EMPLOYEE",
              translationKey: "employee.edit",
              path: "/employee/edit",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_EMPLOYEE: {
              key: "DETAIL_EMPLOYEE",
              translationKey: "employee.detail",
              path: "/employee/detail",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
      },
    },

    SHIFT_MANAGER: {
      key: "SHIFT_MANAGER",
      translationKey: "menu.shiftManager",
      icon: "pi pi-clock",
      path: "/shift-manager",
      children: {
        SHIFT: {
          key: "SHIFT",
          translationKey: "shift.shift",
          path: "/shift-manager/shift",
        },
        SHIFT_SHEDULE: {
          key: "SHIFT_SHEDULE",
          translationKey: "shift.schedule",
          path: "/shift-manager/shift-schedule",
        },
      },
    },

    SETTINGS: {
      key: "SETTINGS",
      translationKey: "menu.settings",
      icon: "pi pi-building",
      children: {
        COMPANY_SETTING: {
          key: "COMPANY_SETTING",
          translationKey: "settings.company",
          children: {
            COMPANY_MANAGER: {
              key: "COMPANY_MANAGER",
              translationKey: "menu.company",
              path: "/company",
              children: {
                ADD_COMPANY: {
                  key: "ADD_COMPANY",
                  translationKey: "company.add",
                  path: "/company/add",
                  isShow: false,
                },
                EDIT_COMPANY: {
                  key: "EDIT_COMPANY",
                  translationKey: "company.edit",
                  path: "/company/edit/:id",
                  isShow: false,
                },
                DETAIL_COMPANY: {
                  key: "DETAIL_COMPANY",
                  translationKey: "company.detail",
                  path: "/company/detail/:id",
                  isShow: false,
                },
              },
            },
            BRANCH_MANAGER: {
              key: "BRANCH_MANAGER",
              translationKey: "menu.branch",
              path: "/branch",
              children: {
                ADD_BRANCH: {
                  key: "ADD_BRANCH",
                  translationKey: "branch.add",
                  path: "/branch/add",
                  isShow: false,
                },
                EDIT_BRANCH: {
                  key: "EDIT_BRANCH",
                  translationKey: "branch.edit",
                  path: "/branch/edit/:id",
                  isShow: false,
                },
                DETAIL_BRANCH: {
                  key: "DETAIL_BRANCH",
                  translationKey: "branch.detail",
                  path: "/branch/detail/:id",
                  isShow: false,
                },
              },
            },
            DEPARTMENT_MANAGER: {
              key: "DEPARTMENT_MANAGER",
              translationKey: "menu.department",
              path: "/department-manager",
              children: {
                DEPARTMENT: {
                  key: "DEPARTMENT",
                  translationKey: "menu.department",
                  path: "department-manager/department",
                  children: {
                    ADD_DEPARTMENT: {
                      key: "ADD_DEPARTMENT",
                      translationKey: "department.add",
                      path: "/department-manager/department/add",
                      isShow: false,
                    },
                    EDIT_DEPARTMENT: {
                      key: "EDIT_DEPARTMENT",
                      translationKey: "department.edit",
                      path: "/department-manager/department/edit/:id",
                      isShow: false,
                    },
                    DETAIL_DEPARTMENT: {
                      key: "DETAIL_DEPARTMENT",
                      translationKey: "department.detail",
                      path: "/department-manager/department/detail/:id",
                      isShow: false,
                    },
                  },
                },
                DEPARTMENT_TYPE: {
                  key: "DEPARTMENT_TYPE",
                  translationKey: "menu.departmentType",
                  path: "department-manager/department-type",
                  children: {
                    ADD_DEPARTMENT_TYPE: {
                      key: "ADD_DEPARTMENT_TYPE",
                      translationKey: "departmentType.add",
                      path: "/department-manager/department-type/add",
                      isShow: false,
                    },
                    EDIT_DEPARTMENT_TYPE: {
                      key: "EDIT_DEPARTMENT_TYPE",
                      translationKey: "departmentType.edit",
                      path: "/department-manager/department-type/edit/:id",
                      isShow: false,
                    },
                    DETAIL_DEPARTMENT_TYPE: {
                      key: "DETAIL_DEPARTMENT_TYPE",
                      translationKey: "departmentType.detail",
                      path: "/department-manager/department-type/detail/:id",
                      isShow: false,
                    },
                  },
                },
              },
            },
            PART_MANAGER: {
              key: "PART_MANAGER",
              translationKey: "menu.part",
              path: "/part-manager",
              children: {
                PART: {
                  key: "PART",
                  translationKey: "menu.part",
                  path: "/part-manager/part",
                  children: {
                    ADD_PART: {
                      key: "ADD_PART",
                      translationKey: "part.add",
                      path: "/part-manager/part/add",
                      isShow: false,
                    },
                    EDIT_PART: {
                      key: "EDIT_PART",
                      translationKey: "part.edit",
                      path: "/part-manager/part/edit/:id",
                      isShow: false,
                    },
                    DETAIL_PART: {
                      key: "DETAIL_PART",
                      translationKey: "part.detail",
                      path: "/part-manager/part/detail/:id",
                      isShow: false,
                    },
                  },
                },
                PART_MASTER: {
                  key: "PART_MASTER",
                  translationKey: "menu.partMaster",
                  path: "/part-manager/part-master",
                  children: {
                    ADD_PART_MASTER: {
                      key: "ADD_PART_MASTER",
                      translationKey: "partMaster.add",
                      path: "/part-manager/part-master/add",
                      isShow: false,
                    },
                    EDIT_PART_MASTER: {
                      key: "EDIT_PART_MASTER",
                      translationKey: "partMaster.edit",
                      path: "/part-manager/part-master/edit/:id",
                      isShow: false,
                    },
                    DETAIL_PART_MASTER: {
                      key: "DETAIL_PART_MASTER",
                      translationKey: "partMaster.detail",
                      path: "/part-manager/part-master/detail/:id",
                      isShow: false,
                    },
                  },
                },
              },
            },
            POSITION_MANAGER: {
              key: "POSITION_MANAGER",
              translationKey: "menu.position",
              path: "/position",
              children: {
                POSITION: {
                  key: "POSITION",
                  translationKey: "menu.position",
                  path: "/position-manager/position",
                  children: {
                    ADD_POSITION: {
                      key: "ADD_POSITION",
                      translationKey: "position.add",
                      path: "/position/add",
                      isShow: false,
                    },
                    EDIT_POSITION: {
                      key: "EDIT_POSITION",
                      translationKey: "position.edit",
                      path: "/position/edit/:id",
                      isShow: false,
                    },
                    DETAIL_POSITION: {
                      key: "DETAIL_POSITION",
                      translationKey: "position.detail",
                      path: "/position/detail/:id",
                      isShow: false,
                    },
                  },
                },
                POSITION_MASTER: {
                  key: "POSITION_MASTER",
                  translationKey: "menu.positionMaster",
                  path: "/position-manager/position-master",
                  children: {
                    ADD_POSITION_MASTER: {
                      key: "ADD_POSITION_MASTER",
                      translationKey: "positionMaster.add",
                      path: "/position-manager/position-master/add",
                      isShow: false,
                    },
                    EDIT_POSITION_MASTER: {
                      key: "EDIT_POSITION_MASTER",
                      translationKey: "positionMaster.edit",
                      path: "/position-manager/position-master/edit/:id",
                      isShow: false,
                    },
                    DETAIL_POSITION_MASTER: {
                      key: "DETAIL_POSITION_MASTER",
                      translationKey: "positionMaster.detail",
                      path: "/position-manager/position-master/detail/:id",
                      isShow: false,
                    },
                  },
                },
              },
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
        PERMISSION_MANAGER: {
          key: "PERMISSION_MANAGER",
          translationKey: "menu.permission",
          path: "/permission",
          children: {
            ADD_PERMISSION: {
              key: "ADD_PERMISSION",
              translationKey: "permission.add",
              path: "/permission/add",
              isShow: false,
            },
            EDIT_PERMISSION: {
              key: "EDIT_PERMISSION",
              translationKey: "permission.edit",
              path: "/permission/edit",
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
