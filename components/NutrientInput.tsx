type NutrientInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function NutrientInput({
  id,
  label,
  value,
  onChange,
  error,
  disabled = false,
  children,
}: NutrientInputProps) {
  return (
    <div className="flex flex-col">
      <label
        className="block mb-2.5 text-base font-bold text-primary-900"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type="number"
        step="any"
        min="0"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-base text-primary-900 focus:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-400/40 disabled:bg-primary-50 disabled:text-primary-300"
        placeholder=""
        disabled={disabled}
      />

      {error && <p className="mt-1 text-base text-red-600">{error}</p>}

      {children}
    </div>
  );
}
