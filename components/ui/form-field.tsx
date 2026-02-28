/** Props for the FormField wrapper component */
interface FormFieldProps {
  /** Label text displayed above the field */
  label: string;
  /** Unique ID for the form field */
  htmlFor: string;
  /** Error message to display below the field */
  error?: string;
  /** Help text displayed below the field */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** The form control element (input, select, etc.) */
  children: React.ReactNode;
}

/**
 * Wrapper component that composes label + input + error message.
 * Use this for custom form controls that don't have built-in label/error support.
 */
function FormField({ label, htmlFor, error, description, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {description && !error && (
        <p id={`${htmlFor}-desc`} className="text-xs text-gray-500">
          {description}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
