import { login } from "@/assets/animations";
import LoginForm from "@/components/auth/LoginForm";
import ConfigSetting from "@/components/layout/ConfigSetting";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";
import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { useState } from "react";

export default function LoginPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className="login-page flex flex-col md:flex-row relative"
      data-theme={theme}
    >
      <Button
        icon="pi pi-cog"
        rounded
        text
        severity="secondary"
        onClick={() => setShowSettings(true)}
        tooltip={t("login.settings_tooltip")}
        tooltipOptions={{ position: "left" }}
        className="settings-btn"
      />

      <ConfigSetting
        visible={showSettings}
        onHide={() => setShowSettings(false)}
      />

      <div className="hero-section flex-1 flex flex-col justify-center items-center p-8">
        <div className="max-w-[600px] w-full text-center">
          <div className="logo-icon mb-4">
            <i className="pi pi-building"></i>
          </div>

          <div className="max-w-[400px] mx-auto">
            <Lottie animationData={login} loop />
          </div>

          <div className="mt-8">
            <h1 className="hero-title mb-4">
              {t("login.hero_title", { year: 2025 })}
            </h1>
            <p className="hero-description max-w-[500px] mx-auto">
              {t("login.hero_description")}
            </p>
          </div>
        </div>
      </div>

      <div className="login-section flex-1 flex justify-center items-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}
