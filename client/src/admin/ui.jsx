import { forwardRef } from "react";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, as: Tag = "div", ...rest }) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function SectionCard({ title, description, children, className }) {
  return (
    <Card className={className}>
      {(title || description) && (
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
          {title && (
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </Card>
  );
}

const buttonVariants = {
  primary:
    "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900 disabled:bg-gray-300",
  secondary:
    "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 disabled:bg-emerald-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 disabled:bg-red-300",
  warning:
    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 disabled:bg-amber-300",
  info:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 disabled:bg-blue-300",
  ghost:
    "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400 disabled:text-gray-400",
};

const buttonSizes = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3.5 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    type = "button",
    leftIcon,
    rightIcon,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...rest}
    >
      {leftIcon && <span className="-ml-0.5 flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="-mr-0.5 flex items-center">{rightIcon}</span>}
    </button>
  );
});

const pillTones = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  purple: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  slate: "bg-slate-100 text-slate-600",
};

export function Pill({ tone = "gray", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        pillTones[tone] || pillTones.gray,
        className
      )}
    >
      {children}
    </span>
  );
}

export function ErrorBanner({ children, onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <span className="mt-0.5" aria-hidden="true">⚠️</span>
      <div className="flex-1">{children}</div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md border border-red-300 bg-white px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function SuccessBanner({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <span aria-hidden="true">✓</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 ring-1 ring-gray-200">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ size = 16 }) {
  return (
    <svg
      className="animate-spin text-gray-400"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 00-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SkeletonRows({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid animate-pulse gap-px bg-gray-100" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={i} className="h-10 bg-white px-4 py-3">
            <div className="h-3 w-3/4 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500";

export const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

export function Field({ label, required, hint, error, className, children }) {
  return (
    <div className={className}>
      {label && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Table({ children, className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">{children}</table>
      </div>
    </div>
  );
}

export function TH({ children, className }) {
  return (
    <th className={cn("bg-gray-50 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500", className)}>
      {children}
    </th>
  );
}

export function TD({ children, className }) {
  return (
    <td className={cn("px-4 py-3 align-top text-gray-700", className)}>{children}</td>
  );
}
