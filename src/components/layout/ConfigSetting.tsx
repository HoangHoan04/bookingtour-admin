import { enFlag, viFlag } from "@/assets/icons";
import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { type FC } from "react";
import SmoothSlider from "../ui/Slider";

type ConfigSettingProps = {
  visible: boolean;
  onHide: () => void;
};

const ConfigSetting: FC<ConfigSettingProps> = ({ visible, onHide }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { language, setLanguage } = useTranslation();
  const {
    settings,
    footerSettings,
    updateSettings,
    updateFooterSettings,
    resetSettings,
  } = useConfig();

  const languageOptions = [
    { label: "Tiếng Việt", value: "vi", icon: viFlag },
    { label: "English", value: "en", icon: enFlag },
  ];

  const fontSizeOptions = [
    { label: "Nhỏ", value: "small" },
    { label: "Trung bình", value: "medium" },
    { label: "Lớn", value: "large" },
  ];

  const sidebarPositionOptions = [
    { label: "Trái", value: "left" },
    { label: "Phải", value: "right" },
  ];

  const settingsPanelPositionOptions = [
    { label: "Trái", value: "left" },
    { label: "Phải", value: "right" },
  ];

  const handleFooterSettingChange = (
    key: keyof typeof footerSettings,
    value: any,
  ) => {
    updateFooterSettings({ ...footerSettings, [key]: value });
  };

  const handleResetSettings = () => {
    if (window.confirm("Bạn có chắc chắn muốn reset cài đặt?")) {
      resetSettings();
    }
  };

  const selectedCountryTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="flex items-center gap-2">
          <img alt={option.label} src={option.icon} style={{ width: "18px" }} />
          <div>{option.label}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option: any) => {
    return (
      <div className="flex items-center gap-2">
        <img alt={option.label} src={option.icon} style={{ width: "18px" }} />
        <div>{option.label}</div>
      </div>
    );
  };

  const hrClass = `my-4 border-t ${
    isDark ? "border-[#404040]" : "border-[#e0e6ed]"
  }`;

  const sectionTitleClass = `text-sm font-bold mb-3 flex items-center gap-2 ${
    isDark ? "text-blue-400" : "text-blue-600"
  }`;

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position={settings.settingsPanelPosition || "right"}
      className={`w-full sm:w-125! md:w-150! transition-all duration-300 ${
        isDark ? "bg-[#1a1a1a]" : "bg-white"
      }`}
      header={
        <div className="flex items-center gap-2">
          <i className="pi pi-cog text-[#1890ff] text-xl"></i>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-[#f0f0f0]" : "text-[#262626]"
            }`}
          >
            Cài đặt
          </h2>
        </div>
      }
      style={{ backgroundColor: isDark ? "#1a1a1a" : "white" }}
    >
      <div
        className={`space-y-5 p-6 max-h-[calc(100vh-100px)] overflow-y-auto ${
          isDark ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? " border-[#404040] bg-[#1a1a1a]"
              : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-palette"></i>
            Giao diện
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-lg">
              <div className="flex items-center gap-3">
                <i
                  className={`pi pi-moon text-lg ${
                    isDark ? "text-yellow-400" : "text-blue-500"
                  }`}
                ></i>
                <span className="font-medium">Chế độ tối</span>
              </div>
              <InputSwitch
                checked={isDark}
                onChange={(e) => setTheme(e.value ? "dark" : "light")}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Kích thước chữ</span>
              <Dropdown
                value={settings.fontSize || "medium"}
                onChange={(e) => updateSettings("fontSize", e.value)}
                options={fontSizeOptions}
                className="w-56!"
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Vị trí Sidebar</span>
              <Dropdown
                value={settings.sidebarPosition || "left"}
                onChange={(e) => updateSettings("sidebarPosition", e.value)}
                options={sidebarPositionOptions}
                className="w-56!"
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Vị trí Panel Settings</span>
              <Dropdown
                value={settings.settingsPanelPosition || "right"}
                onChange={(e) =>
                  updateSettings("settingsPanelPosition", e.value)
                }
                options={settingsPanelPositionOptions}
                className="w-56!"
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "border-[#404040] bg-[#1a1a1a]"
              : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-sliders-h"></i>
            Hành vi
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-lg">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Số tab tối đa</span>
                <p className="text-xs opacity-70">Giới hạn từ 3 đến 20 tab</p>
              </div>

              <InputNumber
                value={settings.maxTabs || 10}
                onValueChange={(e) => {
                  if (e.value !== null) updateSettings("maxTabs", e.value);
                }}
                showButtons
                buttonLayout="horizontal"
                step={1}
                min={3}
                max={20}
                inputClassName="w-12 text-center font-semibold"
                incrementButtonClassName="p-button-text p-1"
                decrementButtonClassName="p-button-text p-1"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                size={2}
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg">
              <span className="font-medium">Hiển thị tab</span>
              <InputSwitch
                checked={settings.showTabHeader}
                onChange={(e) => updateSettings("showTabHeader", e.value)}
              />
            </div>
          </div>
        </div>
        <div className={hrClass} />

        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "border-[#404040] bg-[#1a1a1a]"
              : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-bell"></i>
            Thông báo
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-lg">
              <span className="font-medium">Thông báo</span>
              <InputSwitch
                checked={settings.notifications}
                onChange={(e) => updateSettings("notifications", e.value)}
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "border-[#404040] bg-[#1a1a1a]"
              : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-shield"></i>
            Bảo mật
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Tự động đăng xuất</span>
                  <p className="text-xs opacity-70">
                    Tự động đăng xuất khi không hoạt động. Cảnh báo trước 30
                    giây.
                  </p>
                </div>
              </div>
              <SmoothSlider
                label={`${settings.autoLogout} phút`}
                value={settings.autoLogout || 30}
                unit={"phút"}
                min={1}
                max={120}
                step={5}
                onChange={(val) => updateSettings("autoLogout", val)}
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "border-[#404040] bg-[#1a1a1a]"
              : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-bars"></i>
            Tùy chỉnh Sidebar
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <SmoothSlider
                label={`Độ rộng Sidebar (${settings.sidebarWidth} px)`}
                value={settings.sidebarWidth || 270}
                unit={"px"}
                min={200}
                max={350}
                onChange={(val) => updateSettings("sidebarWidth", val)}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Hiển thị Icon</span>
              <InputSwitch
                checked={settings.showSidebarIcon}
                onChange={(e) => updateSettings("showSidebarIcon", e.value)}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Chế độ Accordion</span>
                <p className="text-[10px] opacity-60">
                  Chỉ mở duy nhất 1 menu con
                </p>
              </div>
              <InputSwitch
                checked={settings.sidebarAccordion}
                onChange={(e) => updateSettings("sidebarAccordion", e.value)}
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <i className="pi pi-globe text-[#1890ff]"></i>
            <span className="font-medium">Ngôn ngữ ứng dụng</span>
          </div>
          <Dropdown
            value={language}
            onChange={(e) => setLanguage(e.value)}
            options={languageOptions}
            optionLabel="label"
            valueTemplate={selectedCountryTemplate}
            itemTemplate={countryOptionTemplate}
            className="w-56!"
            pt={{
              root: {
                className: isDark ? "bg-[#1a1a1a] border-[#404040]" : "",
              },
              input: { className: "py-2 px-3" },
            }}
          />
        </div>

        <div className={hrClass} />

        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "border-[#404040] bg-[#1a1a1a]"
              : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-window-maximize"></i>
            Cấu hình chân trang
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Hiển thị chân trang</p>
              <InputSwitch
                checked={footerSettings.showFooter}
                onChange={(e) =>
                  handleFooterSettingChange("showFooter", e.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase opacity-60">
                Nội dung chân trang
              </label>
              <InputText
                value={footerSettings.footerContent}
                onChange={(e) =>
                  handleFooterSettingChange("footerContent", e.target.value)
                }
                placeholder="Nhập nội dung chân trang"
                className="w-full text-sm"
                disabled={!footerSettings.showFooter}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-2 rounded-md">
                <span className="text-xs">Hiển thị phiên bản</span>
                <InputSwitch
                  className="scale-75"
                  checked={footerSettings.showVersion}
                  onChange={(e) =>
                    handleFooterSettingChange("showVersion", e.value)
                  }
                  disabled={!footerSettings.showFooter}
                />
              </div>
              <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-2 rounded-md">
                <span className="text-xs">Hiển thị bản quyền</span>
                <InputSwitch
                  className="scale-75"
                  checked={footerSettings.showCopyright}
                  onChange={(e) =>
                    handleFooterSettingChange("showCopyright", e.value)
                  }
                  disabled={!footerSettings.showFooter}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <Button
            label="Khôi phục cài đặt gốc"
            icon="pi pi-refresh"
            severity="danger"
            outlined
            onClick={handleResetSettings}
            className="w-full"
            style={{ color: "white" }}
          />
          <div
            className={`p-3 rounded-lg border border-dashed flex items-start gap-3 ${
              isDark
                ? "border-gray-700 bg-gray-800/30"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <i className="pi pi-info-circle text-blue-500 mt-0.5"></i>
            <p className="text-xs leading-relaxed opacity-80">
              Cài đặt sẽ được lưu tự động sau 2 giây
            </p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default ConfigSetting;
