import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/context/TranslationContext";
import dayjs from "dayjs";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FileUploadCustom from "./FileUpload";
import type { FormField } from "./FormCustom";

const isDeepEqual = (a: any, b: any) => {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
};

const RequiredLabel = memo(
  ({ label, required }: { label: string; required?: boolean }) => (
    <label className="mb-2 block font-medium">
      {label}
      {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
    </label>
  )
);

interface FieldItemProps {
  field: FormField;
  value: any;
  onChange: (key: string, value: any) => void;
  setRef: (name: string, el: any) => void;
  getValues: () => any;
}

const FieldItem = memo(
  ({ field, value, onChange, setRef, getValues }: FieldItemProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const commonProps = {
      style: { width: "100%", ...(field.inputStyle || {}) },
      disabled: field.disabled,
    };

    const handleSetRef = (el: any) => setRef(field.name, el);

    switch (field.type) {
      case "input":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputText
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              {...commonProps}
            />
          </div>
        );
      case "email":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputText
              value={value || ""}
              placeholder={field.placeholder || "example@email.com"}
              onChange={(e) => onChange(field.name, e.target.value)}
              {...commonProps}
            />
          </div>
        );

      case "phoneNumber":
        return (
          <div ref={handleSetRef} className="phone-input-container">
            <RequiredLabel label={field.label} required={field.required} />
            <PhoneInput
              country={"vn"}
              value={value}
              onChange={(phone) => onChange(field.name, phone)}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "6px",
                borderColor: theme === "dark" ? "#424b57" : "#ced4da",
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              buttonStyle={{
                borderColor: theme === "dark" ? "#424b57" : "#ced4da",
                backgroundColor: theme === "dark" ? "#262626" : "#f8f9fa",
              }}
              dropdownStyle={{
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              searchStyle={{
                backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholder={field.placeholder || t("form.phone_placeholder")}
              disabled={field.disabled}
              enableSearch={true}
            />
          </div>
        );
      case "textarea":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputTextarea
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              rows={4}
              {...commonProps}
            />
          </div>
        );
      case "number":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <InputNumber
              value={value}
              onValueChange={(e) => onChange(field.name, e.value)}
              {...commonProps}
            />
          </div>
        );
      case "select":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Dropdown
              value={value}
              options={
                field.options && field.options.length > 0
                  ? field.options.map((o) => ({
                      label: o.name,
                      value: o.value,
                    }))
                  : [{ label: t("form.no_options"), value: "" }]
              }
              onChange={(e) => onChange(field.name, e.value)}
              placeholder={field.placeholder ?? t("form.no_options")}
              {...commonProps}
            />
          </div>
        );
      case "multiselect":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <MultiSelect
              value={value || []}
              options={field.options?.map((o) => ({
                label: o.name,
                value: o.value,
              }))}
              onChange={(e) => onChange(field.name, e.value)}
              placeholder={field.placeholder}
              display="chip"
              {...commonProps}
            />
          </div>
        );
      case "datepicker":
      case "datetimepicker":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <Calendar
              value={value ? dayjs(value).toDate() : null}
              onChange={(e) => onChange(field.name, e.value)}
              showTime={field.type === "datetimepicker"}
              dateFormat={field.dateFormat || "dd/mm/yy"}
              {...commonProps}
              placeholder={
                field.rangePlaceholder?.join(" - ") ||
                t("form.select_date_range")
              }
            />
          </div>
        );
      case "switch":
        return (
          <div className="flex align-items-center" ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <div className="ml-2">
              <InputSwitch
                checked={!!value}
                onChange={(e) => onChange(field.name, e.value)}
                {...commonProps}
              />
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div
            className="flex align-items-center h-full pt-14"
            ref={handleSetRef}
          >
            <Checkbox
              inputId={field.name}
              checked={value || false}
              onChange={(e) => onChange(field.name, e.checked)}
            />
            <label
              htmlFor={field.name}
              className="ml-2 select-none cursor-pointer"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      case "radioGroup":
        return (
          <div ref={handleSetRef}>
            <RequiredLabel label={field.label} required={field.required} />
            <div className="flex flex-wrap gap-3">
              {field.options?.map((opt) => (
                <div key={opt.value} className="flex align-items-center">
                  <RadioButton
                    inputId={`${field.name}_${opt.value}`}
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => onChange(field.name, e.value)}
                  />
                  <label
                    htmlFor={`${field.name}_${opt.value}`}
                    className="ml-2 cursor-pointer"
                  >
                    {opt.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case "file":
      case "image":
        return (
          <div ref={handleSetRef} className="w-full">
            <FileUploadCustom
              label={field.label}
              required={field.required}
              initValue={value}
              onFileUploaded={(uploadedData) =>
                onChange(field.name, uploadedData)
              }
              type={field.type === "image" ? "image" : field.fileType || "all"}
              mode={field.isSingle ? "single" : "multi"}
              maxSize={field.maxSize || 10}
              disabled={field.disabled}
              className="w-full"
            />
          </div>
        );
      case "action":
        return (
          <div ref={handleSetRef}>
            <Button
              label={field.buttonText || field.label || t("form.action")}
              icon="pi pi-check"
              onClick={() => field.onAction?.(getValues())}
            />
          </div>
        );
      case "custom":
        return field.render ? (
          <div>
            <RequiredLabel label={field.label} required={field.required} />
            {field.render({
              value,
              onChange: (val: any) => onChange(field.name, val),
            })}
          </div>
        ) : null;
      default:
        return null;
    }
  },
  (prev, next) => {
    return (
      isDeepEqual(prev.value, next.value) &&
      prev.field === next.field &&
      prev.field.disabled === next.field.disabled &&
      prev.field.options === next.field.options
    );
  }
);

function useRenderFormCustom(
  fields: FormField[],
  initialValues: Record<string, any> = {},
  onChangeValue?: (allValues: any) => void
) {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errorField, setErrorField] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, any>>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (errorField && fieldRefs.current[errorField]) {
      const element = fieldRefs.current[errorField];
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        if (element.focus) {
          element.focus();
        } else if (element.querySelector) {
          const input = element.querySelector("input, textarea, select");
          input?.focus();
        }
      }, 300);
      setErrorField(null);
    }
  }, [errorField]);

  const handleChange = useCallback(
    (key: string, value: any) => {
      setValues((prev) => {
        if (prev[key] === value) return prev;
        if (isDeepEqual(prev[key], value)) {
          return prev;
        }

        const newValues = { ...prev, [key]: value };
        if (onChangeValue) {
          onChangeValue(newValues);
        }
        return newValues;
      });
    },
    [onChangeValue]
  );

  const handleSetRef = useCallback((name: string, el: any) => {
    fieldRefs.current[name] = el;
  }, []);

  const getValues = useCallback(() => ({ ...values }), [values]);

  const setValuesExternal = useCallback(
    (newValues: any) => setValues(newValues),
    []
  );

  const resetFields = useCallback(
    () => setValues(initialValues),
    [initialValues]
  );

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateFields = useCallback(async () => {
    for (const field of fields) {
      const val = values[field.name];

      if (
        field.required &&
        (val === undefined ||
          val === "" ||
          val === null ||
          (Array.isArray(val) && val.length === 0))
      ) {
        showToast({
          type: "error",
          title: t("common.error_title"),
          message: t("validation.required_field", { label: field.label }),
        });
        setErrorField(field.name);
        return false;
      }

      if (field.type === "email" && val) {
        if (!validateEmail(val)) {
          showToast({
            type: "error",
            title: t("common.error_title"),
            message: t("validation.invalid_email"),
          });
          setErrorField(field.name);
          return false;
        }
      }

      if (field.type === "phoneNumber" && val) {
        if (val.length < 8) {
          showToast({
            type: "error",
            title: t("common.error_title"),
            message: t("validation.invalid_phone"),
          });
          setErrorField(field.name);
          return false;
        }
      }
    }
    return true;
  }, [fields, values, showToast, t]);

  const renderField = useCallback(
    (field: FormField) => {
      return (
        <FieldItem
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={handleChange}
          setRef={handleSetRef}
          getValues={getValues}
        />
      );
    },
    [values, handleChange, handleSetRef, getValues]
  );

  return {
    renderField,
    getValues,
    setValues: setValuesExternal,
    resetFields,
    validateFields,
  };
}

export default useRenderFormCustom;
