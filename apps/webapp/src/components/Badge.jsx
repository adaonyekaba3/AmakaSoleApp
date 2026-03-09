const variantStyles = {
  success: 'bg-emerald-100 text-emerald-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-primary-100 text-primary-800',
  neutral: 'bg-gray-100 text-gray-800',
};

export default function Badge({ label, variant = 'neutral' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant] || variantStyles.neutral}`}>
      {label}
    </span>
  );
}
