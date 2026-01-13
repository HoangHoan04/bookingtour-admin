import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/main/dashboard";

import { AuthGuard } from "@/components/ui/wrappers/AuthGuard";
import PermissionManagerPage from "@/pages/main/role/permission-manager";
import PermissionAssignmentPage from "@/pages/main/role/perrmission-assign";
import RoleManagerPage from "@/pages/main/role/role-manager";

import EmployeeManager from "@/pages/main/human-resource/employee-manager";
import AddEmployeePage from "@/pages/main/human-resource/employee-manager/add";
import EmployeeDetailPage from "@/pages/main/human-resource/employee-manager/detail";
import EditEmployeePage from "@/pages/main/human-resource/employee-manager/edit";
import BranchManager from "@/pages/main/settings/branch-manager";
import AddBranchPage from "@/pages/main/settings/branch-manager/add";
import BranchDetailPage from "@/pages/main/settings/branch-manager/detail";
import EditBranchPage from "@/pages/main/settings/branch-manager/edit";
import CompanyManager from "@/pages/main/settings/comany-manager";
import AddCompanyPage from "@/pages/main/settings/comany-manager/add";
import CompanyDetailPage from "@/pages/main/settings/comany-manager/detail";
import EditCompanyPage from "@/pages/main/settings/comany-manager/edit";
import DepartmentManagerPage from "@/pages/main/settings/department-manager";
import AddDepartmentTypePage from "@/pages/main/settings/department-manager/department-type/add";
import DepartmentTypeDetailPage from "@/pages/main/settings/department-manager/department-type/detail";
import EditDepartmentTypePage from "@/pages/main/settings/department-manager/department-type/edit";
import AddDepartmentPage from "@/pages/main/settings/department-manager/department/add";
import DepartmentDetailPage from "@/pages/main/settings/department-manager/department/detail";
import EditDepartmentPage from "@/pages/main/settings/department-manager/department/edit";

import SettingLanguagePage from "@/pages/main/setting-system/setting-language";
import SettingStringPage from "@/pages/main/setting-system/setting-string";
import PartManagerPage from "@/pages/main/settings/part-manager";
import AddPartMasterPage from "@/pages/main/settings/part-manager/part-master/add";
import PartMasterDetailPage from "@/pages/main/settings/part-manager/part-master/detail";
import EditPartMasterPage from "@/pages/main/settings/part-manager/part-master/edit";
import AddPartPage from "@/pages/main/settings/part-manager/part/add";
import PartDetailPage from "@/pages/main/settings/part-manager/part/detail";
import EditPartPage from "@/pages/main/settings/part-manager/part/edit";
import PositionManagerPage from "@/pages/main/settings/position-manager";
import AddPositionMasterPage from "@/pages/main/settings/position-manager/position-master/add";
import PositionMasterDetailPage from "@/pages/main/settings/position-manager/position-master/detail";
import EditPositionMasterPage from "@/pages/main/settings/position-manager/position-master/edit";
import AddPositionPage from "@/pages/main/settings/position-manager/position/add";
import PositionDetailPage from "@/pages/main/settings/position-manager/position/detail";
import EditPositionPage from "@/pages/main/settings/position-manager/position/edit";
import NotFound from "@/pages/NotFound";
import ChatPage from "@/pages/other/ChatPage";
import NotificationListPage from "@/pages/other/NotificationList";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />

      {/* Route bảo vệ */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />

          <Route
            path={ROUTES.OTHER.NOTIFICATION.path}
            element={<NotificationListPage />}
          />

          <Route path={ROUTES.OTHER.CHAT.path} element={<ChatPage />} />

          {/* Quản lý Nhân viên*/}
          <Route
            path={ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.path}
            element={
              <AuthGuard requiredPermission="EMPLOYEE:VIEW">
                <EmployeeManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.children
                .ADD_EMPLOYEE.path
            }
            element={
              <AuthGuard requiredPermission="EMPLOYEE:CREATE">
                <AddEmployeePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.children
                .EDIT_EMPLOYEE.path
            }
            element={
              <AuthGuard requiredPermission="EMPLOYEE:UPDATE">
                <EditEmployeePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.HUMAN_RESOURCE.children.EMPLOYEE_MANAGER.children
                .DETAIL_EMPLOYEE.path
            }
            element={
              <AuthGuard requiredPermission="EMPLOYEE:VIEW_DETAILS">
                <EmployeeDetailPage />
              </AuthGuard>
            }
          />

          {/* Quản lý công ty */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .COMPANY_MANAGER.path
            }
            element={
              <AuthGuard requiredPermission="COMPANY:VIEW">
                <CompanyManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .COMPANY_MANAGER.children.ADD_COMPANY.path
            }
            element={
              <AuthGuard requiredPermission="COMPANY:CREATE">
                <AddCompanyPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .COMPANY_MANAGER.children.EDIT_COMPANY.path
            }
            element={
              <AuthGuard requiredPermission="COMPANY:UPDATE">
                <EditCompanyPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .COMPANY_MANAGER.children.DETAIL_COMPANY.path
            }
            element={
              <AuthGuard requiredPermission="COMPANY:VIEW_DETAILS">
                <CompanyDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý chi nhánh  */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .BRANCH_MANAGER.path
            }
            element={
              <AuthGuard requiredPermission="BRANCH:VIEW">
                <BranchManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .BRANCH_MANAGER.children.ADD_BRANCH.path
            }
            element={
              <AuthGuard requiredPermission="BRANCH:CREATE">
                <AddBranchPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .BRANCH_MANAGER.children.EDIT_BRANCH.path
            }
            element={
              <AuthGuard requiredPermission="BRANCH:UPDATE">
                <EditBranchPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .BRANCH_MANAGER.children.DETAIL_BRANCH.path
            }
            element={
              <AuthGuard requiredPermission="BRANCH:VIEW_DETAILS">
                <BranchDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý phòng ban  */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT:VIEW">
                <DepartmentManagerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.children.DEPARTMENT.children.ADD_DEPARTMENT
                .path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT:CREATE">
                <AddDepartmentPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.children.DEPARTMENT.children.EDIT_DEPARTMENT
                .path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT:UPDATE">
                <EditDepartmentPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.children.DEPARTMENT.children
                .DETAIL_DEPARTMENT.path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT:VIEW_DETAILS">
                <DepartmentDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý loại phòng ban */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.children.DEPARTMENT_TYPE.children
                .ADD_DEPARTMENT_TYPE.path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT_TYPE:CREATE">
                <AddDepartmentTypePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.children.DEPARTMENT_TYPE.children
                .EDIT_DEPARTMENT_TYPE.path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT_TYPE:UPDATE">
                <EditDepartmentTypePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .DEPARTMENT_MANAGER.children.DEPARTMENT_TYPE.children
                .DETAIL_DEPARTMENT_TYPE.path
            }
            element={
              <AuthGuard requiredPermission="DEPARTMENT_TYPE:VIEW_DETAILS">
                <DepartmentTypeDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý bộ phận */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.path
            }
            element={
              <AuthGuard requiredPermission="PART:VIEW">
                <PartManagerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.children.PART.children.ADD_PART.path
            }
            element={
              <AuthGuard requiredPermission="PART:CREATE">
                <AddPartPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.children.PART.children.EDIT_PART.path
            }
            element={
              <AuthGuard requiredPermission="PART:UPDATE">
                <EditPartPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.children.PART.children.DETAIL_PART.path
            }
            element={
              <AuthGuard requiredPermission="PART:VIEW_DETAILS">
                <PartDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý bộ phận mẫu */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.children.PART_MASTER.children.ADD_PART_MASTER.path
            }
            element={
              <AuthGuard requiredPermission="PART_MASTER:CREATE">
                <AddPartMasterPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.children.PART_MASTER.children.EDIT_PART_MASTER
                .path
            }
            element={
              <AuthGuard requiredPermission="PART_MASTER:UPDATE">
                <EditPartMasterPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .PART_MANAGER.children.PART_MASTER.children.DETAIL_PART_MASTER
                .path
            }
            element={
              <AuthGuard requiredPermission="PART_MASTER:VIEW_DETAILS">
                <PartMasterDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý vị trí */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.path
            }
            element={
              <AuthGuard requiredPermission="POSITION:VIEW">
                <PositionManagerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.children.POSITION.children.ADD_POSITION.path
            }
            element={
              <AuthGuard requiredPermission="POSITION:CREATE">
                <AddPositionPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.children.POSITION.children.EDIT_POSITION.path
            }
            element={
              <AuthGuard requiredPermission="POSITION:UPDATE">
                <EditPositionPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.children.POSITION.children.DETAIL_POSITION
                .path
            }
            element={
              <AuthGuard requiredPermission="POSITION:VIEW_DETAILS">
                <PositionDetailPage />
              </AuthGuard>
            }
          />
          {/* Quản lý bộ phận mẫu */}
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.children.POSITION_MASTER.children
                .ADD_POSITION_MASTER.path
            }
            element={
              <AuthGuard requiredPermission="POSITION_MASTER:CREATE">
                <AddPositionMasterPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.children.POSITION_MASTER.children
                .EDIT_POSITION_MASTER.path
            }
            element={
              <AuthGuard requiredPermission="POSITION_MASTER:UPDATE">
                <EditPositionMasterPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.SETTINGS.children.COMPANY_SETTING.children
                .POSITION_MANAGER.children.POSITION_MASTER.children
                .DETAIL_POSITION_MASTER.path
            }
            element={
              <AuthGuard requiredPermission="POSITION_MASTER:VIEW_DETAILS">
                <PositionMasterDetailPage />
              </AuthGuard>
            }
          />
          {/* Vai trò */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.path}
            element={
              <AuthGuard requiredPermission="ROLE:VIEW">
                <RoleManagerPage />
              </AuthGuard>
            }
          />

          {/* Quyền */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.path}
            element={
              <AuthGuard requiredPermission="PERMISSION:VIEW">
                <PermissionManagerPage />
              </AuthGuard>
            }
          />

          {/* Phân quyền */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ASSIGN_PERMISSION.path}
            element={
              <AuthGuard requiredPermission="PERMISSION:ASSIGN">
                <PermissionAssignmentPage />
              </AuthGuard>
            }
          />

          {/* Thiết lập ngôn ngữ */}
          <Route
            path={ROUTES.MAIN.SETTING_SYSTEM.children.SETTING_LANGUAGE.path}
            element={
              <AuthGuard requiredPermission="SETTING_LANGUAGE:VIEW">
                <SettingLanguagePage />
              </AuthGuard>
            }
          />

          {/* Thiết lập động */}
          <Route
            path={ROUTES.MAIN.SETTING_SYSTEM.children.SETTING_STRING.path}
            element={
              <AuthGuard requiredPermission="SETTING_STRING:VIEW">
                <SettingStringPage />
              </AuthGuard>
            }
          />
        </Route>
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
