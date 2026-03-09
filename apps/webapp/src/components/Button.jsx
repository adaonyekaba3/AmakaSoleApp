const variantStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  title,
  variant = 'primary',
  size = 'lg',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full text-center ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.lg} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children || title
      )}
    </button>
  );
}
