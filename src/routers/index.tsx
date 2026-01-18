import { ROUTES } from "@/common/constants/routes";
import { AuthGuard } from "@/components/ui/wrappers/AuthGuard";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/main/dashboard";

import SettingLanguagePage from "@/pages/main/setting-system/setting-language";
import SettingStringPage from "@/pages/main/setting-system/setting-string";

import BannerManager from "@/pages/main/news-manager/banners";
import AddBannerPage from "@/pages/main/news-manager/banners/add";
import DetailBannerPage from "@/pages/main/news-manager/banners/detail";
import EditBannerPage from "@/pages/main/news-manager/banners/edit";
import NewManager from "@/pages/main/news-manager/news";
import AddNewPage from "@/pages/main/news-manager/news/add";
import DetailNewPage from "@/pages/main/news-manager/news/detail";
import PermissionAssignmentPage from "@/pages/main/role-manager/perrmission-assign";
import RoleManagerPage from "@/pages/main/role-manager/role";
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

          {/* Quản lý banner*/}
          <Route
            path={ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.path}
            element={
              <AuthGuard>
                <BannerManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children
                .ADD_BANNER.path
            }
            element={
              <AuthGuard>
                <AddBannerPage />
              </AuthGuard>
            }
          />

          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children
                .EDIT_BANNER.path
            }
            element={
              <AuthGuard>
                <EditBannerPage />
              </AuthGuard>
            }
          />

          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children
                .DETAIL_BANNER.path
            }
            element={
              <AuthGuard>
                <DetailBannerPage />
              </AuthGuard>
            }
          />

          {/* Quản lý tin tức*/}
          <Route
            path={ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.path}
            element={
              <AuthGuard>
                <NewManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.ADD_NEW.path
            }
            element={
              <AuthGuard>
                <AddNewPage />
              </AuthGuard>
            }
          />

          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.EDIT_NEW.path
            }
            element={
              <AuthGuard>
                <EditBannerPage />
              </AuthGuard>
            }
          />

          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.DETAIL_NEW.path
            }
            element={
              <AuthGuard>
                <DetailNewPage />
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
