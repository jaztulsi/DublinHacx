import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useForm, type FieldErrors, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { registrationSchema, type RegistrationInput, HACKER_CAP } from "@/lib/registration-schema";
import { submitRegistration, getCapacity } from "@/lib/registration-client";

const GRAD_YEARS = ["2026", "2027", "2028", "2029", "2030"];
const DIETARY = [
  "None",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "Nut allergy",
  "Other",
];
const TSHIRTS = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const DRAFT_KEY = "dublin-hacks-registration-draft";

const defaultValues: RegistrationInput = {
  passcode: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  school: "",
  grad_year: "",
  exp_level: "Beginner",
  dietary: "None",
  tshirt: "M",
  idea: "",
  github: "",
  linkedin: "",
  parent_name: "",
  parent_email: "",
  parent_phone: "",
  emergency_contact: "",
  team_name: "",
  teammate_emails: "",
  code_of_conduct: false as unknown as true,
  photo_release: false as unknown as true,
  parent_signature: false as unknown as true,
};

const steps = [
  {
    title: "Hacker Info",
    fields: [
      "passcode",
      "first_name",
      "last_name",
      "email",
      "phone",
      "school",
      "grad_year",
      "exp_level",
      "dietary",
      "tshirt",
      "github",
      "linkedin",
      "idea",
    ] as const,
  },
  {
    title: "Parent / Guardian",
    fields: ["parent_name", "parent_email", "parent_phone", "emergency_contact"] as const,
  },
  {
    title: "Team (optional)",
    fields: ["team_name", "teammate_emails"] as const,
  },
  {
    title: "Agreements",
    fields: ["code_of_conduct", "photo_release", "parent_signature"] as const,
  },
];

type Result =
  | { type: "accepted"; name: string }
  | { type: "waitlisted"; name: string }
  | { type: "error"; message: string }
  | null;

export function RegistrationSection() {
  const submit = submitRegistration;
  const fetchCapacity = getCapacity;
  const [capacity, setCapacity] = useState({ count: 0, cap: HACKER_CAP });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const submitLockedRef = useRef(false);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    fetchCapacity()
      .then((c) => setCapacity(c))
      .catch(() => {});
  }, [fetchCapacity]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<RegistrationInput>;
        form.reset({ ...defaultValues, ...parsed });
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftLoaded(true);
    }
  }, [form]);

  useEffect(() => {
    if (!draftLoaded) return;
    const subscription = form.watch((values) => {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [draftLoaded, form]);

  const refreshCapacity = () =>
    fetchCapacity()
      .then(setCapacity)
      .catch(() => {});

  const filledPct = Math.min(100, Math.round((capacity.count / capacity.cap) * 100));
  const isFull = capacity.count >= capacity.cap;
  const activeStep = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const formatField = (
    field: "phone" | "parent_phone" | "email" | "parent_email" | "github" | "linkedin",
  ) => {
    const raw = String(form.getValues(field) ?? "");
    const next =
      field === "phone" || field === "parent_phone"
        ? formatPhone(raw)
        : field === "email" || field === "parent_email"
          ? raw.trim().toLowerCase()
          : normalizeProfileUrl(raw, field);

    form.setValue(field, next as RegistrationInput[typeof field], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const withFormat = (
    registration: UseFormRegisterReturn,
    field: Parameters<typeof formatField>[0],
  ) => ({
    ...registration,
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      registration.onBlur(event);
      formatField(field);
    },
  });

  const goToStep = async (targetStep: number) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    for (let step = currentStep; step < targetStep; step += 1) {
      const valid = await form.trigger([...steps[step].fields], {
        shouldFocus: step === currentStep,
      });
      if (!valid) return;
    }
    setCurrentStep(targetStep);
  };

  const nextStep = async () => {
    const valid = await form.trigger([...activeStep.fields], { shouldFocus: true });
    if (valid) setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const onInvalid = (errors: FieldErrors<RegistrationInput>) => {
    submitLockedRef.current = false;
    setSubmitting(false);
    const firstErrorStep = steps.findIndex((step) => step.fields.some((field) => errors[field]));
    if (firstErrorStep >= 0) setCurrentStep(firstErrorStep);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (submitLockedRef.current) return;
    submitLockedRef.current = true;
    setSubmitting(true);
    setResult(null);
    try {
      const parsed = registrationSchema.parse(data);
      const res = await submit({ data: parsed });
      if (!res.ok) {
        setResult({ type: "error", message: res.error });
        submitLockedRef.current = false;
      } else if (res.status === "accepted") {
        window.localStorage.removeItem(DRAFT_KEY);
        setResult({ type: "accepted", name: res.name });
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.55 },
          colors: ["#c084fc", "#f5c842", "#ffffff"],
        });
        form.reset(defaultValues);
      } else {
        window.localStorage.removeItem(DRAFT_KEY);
        setResult({ type: "waitlisted", name: res.name });
        form.reset(defaultValues);
      }
      refreshCapacity();
    } catch {
      setResult({ type: "error", message: "Something went wrong. Try again." });
      submitLockedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, onInvalid);

  const stepHasError = (index: number) =>
    steps[index].fields.some((field) => form.formState.errors[field]);

  if (result && result.type !== "error") {
    return (
      <section id="register" className="relative px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl rounded-3xl border border-primary/40 bg-card/40 p-12 text-center backdrop-blur-md purple-glow"
        >
          {result.type === "accepted" ? (
            <>
              <div className="text-6xl">🎉</div>
              <h3 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
                You're in, {result.name}!
              </h3>
              <p className="mt-4 text-muted-foreground">
                We've saved your spot at Dublin Hacx. Watch your email for confirmation and next
                steps in the coming weeks.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl">⏳</div>
              <h3 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
                You're on the waitlist, {result.name}.
              </h3>
              <p className="mt-4 text-muted-foreground">
                The event is full, but spots open up frequently. We'll reach out if one becomes
                available.
              </p>
            </>
          )}
          <button
            onClick={() => {
              submitLockedRef.current = false;
              setResult(null);
              setCurrentStep(0);
            }}
            className="mt-8 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium hover:bg-secondary/60"
          >
            Submit another
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="register" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
            Applications Open
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">
            Claim your <span className="text-gradient-primary">spot</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            All skill levels welcome. Free to attend. Bring your laptop and curiosity.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {capacity.count} / {capacity.cap} spots claimed
              </span>
              <span className="font-semibold text-primary">{filledPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${filledPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary-glow purple-glow"
              />
            </div>
            {isFull && (
              <p className="mt-3 text-xs text-gold">
                Event is full — submitting will add you to the waitlist.
              </p>
            )}
          </div>
        </div>

        <nav aria-label="Registration progress" className="mb-8">
          <ol className="grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => {
              const active = index === currentStep;
              const complete = index < currentStep;
              const hasError = stepHasError(index);
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      active
                        ? "border-primary bg-primary/15 text-foreground"
                        : complete
                          ? "border-primary/30 bg-card/40 text-foreground"
                          : "border-border bg-card/20 text-muted-foreground"
                    } ${hasError ? "border-destructive/60" : ""}`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span className="block text-xs font-semibold uppercase tracking-widest">
                      Step {index + 1}
                    </span>
                    <span className="mt-1 block font-display text-base font-bold">
                      {step.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary/50" aria-hidden="true">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground" aria-live="polite">
            Section {currentStep + 1} of {steps.length}
          </p>
        </nav>

        {result?.type === "error" && (
          <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            {result.message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          <FormBlock title={activeStep.title}>
            {currentStep === 0 && (
              <>
                <Field label="Event Passcode" full error={form.formState.errors.passcode?.message}>
                  <input
                    className={inputCls}
                    autoComplete="off"
                    {...form.register("passcode")}
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Ask a Dublin Hacx organizer for this.
                  </span>
                </Field>
                <Field label="First Name" error={form.formState.errors.first_name?.message}>
                  <input
                    className={inputCls}
                    autoComplete="given-name"
                    {...form.register("first_name")}
                  />
                </Field>
                <Field label="Last Name" error={form.formState.errors.last_name?.message}>
                  <input
                    className={inputCls}
                    autoComplete="family-name"
                    {...form.register("last_name")}
                  />
                </Field>
                <Field label="Email" error={form.formState.errors.email?.message}>
                  <input
                    type="email"
                    className={inputCls}
                    autoComplete="email"
                    inputMode="email"
                    {...withFormat(form.register("email"), "email")}
                  />
                </Field>
                <Field label="Phone" error={form.formState.errors.phone?.message}>
                  <input
                    type="tel"
                    className={inputCls}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(555) 555-1234"
                    {...withFormat(form.register("phone"), "phone")}
                  />
                </Field>
                <Field label="School" error={form.formState.errors.school?.message}>
                  <input
                    className={inputCls}
                    autoComplete="organization"
                    {...form.register("school")}
                  />
                </Field>
                <Field label="Graduation Year" error={form.formState.errors.grad_year?.message}>
                  <select className={inputCls} {...form.register("grad_year")}>
                    <option value="">Select...</option>
                    {GRAD_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Experience Level" error={form.formState.errors.exp_level?.message}>
                  <select className={inputCls} {...form.register("exp_level")}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </Field>
                <Field label="Dietary Restrictions" error={form.formState.errors.dietary?.message}>
                  <select className={inputCls} {...form.register("dietary")}>
                    {DIETARY.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="T-Shirt Size" error={form.formState.errors.tshirt?.message}>
                  <select className={inputCls} {...form.register("tshirt")}>
                    {TSHIRTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="GitHub URL (optional)" error={form.formState.errors.github?.message}>
                  <input
                    className={inputCls}
                    placeholder="https://github.com/..."
                    inputMode="url"
                    {...withFormat(form.register("github"), "github")}
                  />
                </Field>
                <Field
                  label="LinkedIn URL (optional)"
                  error={form.formState.errors.linkedin?.message}
                >
                  <input
                    className={inputCls}
                    placeholder="https://linkedin.com/in/..."
                    inputMode="url"
                    {...withFormat(form.register("linkedin"), "linkedin")}
                  />
                </Field>
                <Field
                  label="Project Idea (optional)"
                  full
                  error={form.formState.errors.idea?.message}
                >
                  <textarea rows={3} className={inputCls} {...form.register("idea")} />
                </Field>
              </>
            )}

            {currentStep === 1 && (
              <>
                <Field label="Parent Name" error={form.formState.errors.parent_name?.message}>
                  <input
                    className={inputCls}
                    autoComplete="name"
                    {...form.register("parent_name")}
                  />
                </Field>
                <Field label="Parent Email" error={form.formState.errors.parent_email?.message}>
                  <input
                    type="email"
                    className={inputCls}
                    autoComplete="email"
                    inputMode="email"
                    {...withFormat(form.register("parent_email"), "parent_email")}
                  />
                </Field>
                <Field label="Parent Phone" error={form.formState.errors.parent_phone?.message}>
                  <input
                    type="tel"
                    className={inputCls}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(555) 555-1234"
                    {...withFormat(form.register("parent_phone"), "parent_phone")}
                  />
                </Field>
                <Field
                  label="Emergency Contact (name, phone, relationship)"
                  full
                  error={form.formState.errors.emergency_contact?.message}
                >
                  <input
                    className={inputCls}
                    placeholder="Jane Doe, 555-555-1234, Aunt"
                    {...form.register("emergency_contact")}
                  />
                </Field>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Field label="Team Name" error={form.formState.errors.team_name?.message}>
                  <input className={inputCls} {...form.register("team_name")} />
                </Field>
                <Field
                  label="Teammate Emails (comma-separated, up to 3)"
                  error={form.formState.errors.teammate_emails?.message}
                >
                  <input
                    className={inputCls}
                    inputMode="email"
                    placeholder="a@x.com, b@y.com"
                    {...form.register("teammate_emails")}
                  />
                </Field>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Checkbox
                  label="I agree to the Code of Conduct."
                  error={form.formState.errors.code_of_conduct?.message}
                  {...form.register("code_of_conduct")}
                />
                <Checkbox
                  label="I consent to event photos / videos that may include me."
                  error={form.formState.errors.photo_release?.message}
                  {...form.register("photo_release")}
                />
                <Checkbox
                  label="My parent / guardian has reviewed and signed off on this submission."
                  error={form.formState.errors.parent_signature?.message}
                  {...form.register("parent_signature")}
                />
              </>
            )}
          </FormBlock>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
              disabled={currentStep === 0 || submitting}
              className="rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            {isLastStep ? (
              <button
                type="submit"
                disabled={submitting || submitLockedRef.current}
                aria-busy={submitting}
                className="group relative rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground purple-glow transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60 sm:min-w-56"
              >
                {submitting
                  ? "Submitting application…"
                  : isFull
                    ? "Join Waitlist →"
                    : "Submit Application →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={submitting}
                className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground purple-glow transition-transform hover:scale-[1.01] disabled:opacity-50 sm:min-w-40"
              >
                Continue →
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 backdrop-blur-md";

function FormBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md md:p-8"
    >
      <h3 className="mb-6 font-display text-xl font-bold">{title}</h3>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </motion.div>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`block text-sm ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block font-medium text-foreground/90">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

const Checkbox = ({
  label,
  error,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-input/30 p-4 text-sm md:col-span-2">
      <input
        type="checkbox"
        className="mt-0.5 h-5 w-5 rounded border-border bg-transparent text-primary focus:ring-primary/30"
        {...props}
      />
      <div>
        <span>{label}</span>
        {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
      </div>
    </label>
  );
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 0) {
    return value.trim();
  }
  return "";
}

function normalizeProfileUrl(value: string, field: "github" | "linkedin") {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!trimmed.includes(".") && !trimmed.includes("/")) {
    return field === "github"
      ? `https://github.com/${trimmed.replace(/^@/, "")}`
      : `https://linkedin.com/in/${trimmed.replace(/^@/, "")}`;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
