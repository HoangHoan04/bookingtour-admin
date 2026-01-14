import { ROUTES } from "@/common/constants/routes";
import { AuthGuard } from "@/components/ui/wrappers/AuthGuard";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/main/dashboard";
import PermissionAssignmentPage from "@/pages/main/role/perrmission-assign";
import RoleManagerPage from "@/pages/main/role/role-manager";

import SettingLanguagePage from "@/pages/main/setting-system/setting-language";
import SettingStringPage from "@/pages/main/setting-system/setting-string";

import NotFound from "@/pages/NotFound";
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

          {/* Quản lý khách hàng*/}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.path}
            element={
              <AuthGuard requiredPermission="EMPLOYEE:VIEW">
                <NotificationListPage />
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
