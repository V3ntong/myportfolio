"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "cn";

import { contactContent, labels } from "@/src/data/portfolio";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: FormValues = { name: "", email: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const { validation } = contactContent.form;

  if (values.name.trim().length < 2) {
    errors.name = validation.name;
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = validation.email;
  }

  if (values.message.trim().length < 10) {
    errors.message = validation.message;
  }

  return errors;
}

export function ContactForm() {
  const formId = useId();
  const copy = contactContent.form;
  const emailLink = contactContent.links.find((link) => link.id === "email");

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const submitting = status === "submitting";
  const fieldId = (field: keyof FormValues) => `${formId}-${field}`;
  const errorId = (field: keyof FormValues) => `${formId}-${field}-error`;

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFeedback(copy.validationSummary);
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      const serverError =
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof (payload as { error?: unknown }).error === "string"
          ? (payload as { error: string }).error
          : null;

      if (!response.ok) {
        setStatus("error");
        setFeedback(serverError ?? copy.errorFallback);
        return;
      }

      setStatus("success");
      setFeedback(copy.success);
      setValues(EMPTY_VALUES);
    } catch {
      setStatus("error");
      setFeedback(copy.errorFallback);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={submitting}
      className="rounded-3xl border border-border bg-background/50 p-6 backdrop-blur-[2px] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          label={copy.nameLabel}
          error={errors.name}
        >
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder={copy.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? errorId("name") : undefined}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          label={copy.emailLabel}
          error={errors.email}
        >
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder={copy.emailPlaceholder}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          id={fieldId("message")}
          errorId={errorId("message")}
          label={copy.messageLabel}
          error={errors.message}
        >
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            required
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={copy.messagePlaceholder}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? errorId("message") : undefined}
            className={cn(inputClass(Boolean(errors.message)), "resize-y")}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? copy.submitting : copy.submit}
        </button>
        <p className="text-xs text-muted-foreground">{copy.responseNote}</p>
      </div>

      {feedback ? (
        <div
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
          className={cn(
            "mt-5 rounded-2xl border px-4 py-3 text-sm leading-relaxed",
            status === "success"
              ? "border-accent/30 bg-accent/10 text-foreground"
              : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
          )}
        >
          <p>{feedback}</p>
          {status === "error" && emailLink ? (
            <p className="mt-2">
              {labels.directEmailPrefix}{" "}
              <a
                href={emailLink.href}
                className="font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {emailLink.value}
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "mt-2 w-full rounded-xl border bg-background/60 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    hasError ? "border-red-500/70" : "border-border",
  );
}

type FieldProps = {
  id: string;
  errorId: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, errorId, label, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-foreground"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
