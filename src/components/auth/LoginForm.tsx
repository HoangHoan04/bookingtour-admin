import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/context/TranslationContext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = t("login.errors.usernameRequired");
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = t("login.errors.passwordRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login({ username, password });
      showToast({
        type: "success",
        title: t("toast.successTitle"),
        message: t("login.toast.successMessage"),
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || t("login.toast.errorMessage");
      showToast({
        type: "error",
        title: t("login.toast.errorTitle"),
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      title={<h2 className="card-title">{t("login.title")}</h2>}
      className="login-card"
      data-theme={theme}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label htmlFor="username" className="form-label">
            {t("login.username")} <span className="required">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("login.usernamePlaceholder")}
            className={`form-input ${errors.username ? "error" : ""}`}
          />
          {errors.username && (
            <Message severity="error" text={errors.username} className="mt-2" />
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="form-label">
            {t("login.password")} <span className="required">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              className={`form-input with-icon ${
                errors.password ? "error" : ""
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={`password-toggle pi ${
                showPassword ? "pi-eye-slash" : "pi-eye"
              }`}
            />
          </div>
          {errors.password && (
            <Message severity="error" text={errors.password} className="mt-2" />
          )}
        </div>

        <Divider />

        <Button
          type="submit"
          label={t("login.submitButton")}
          icon="pi pi-sign-in"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="submit-btn"
        />
      </form>
    </Card>
  );
}
