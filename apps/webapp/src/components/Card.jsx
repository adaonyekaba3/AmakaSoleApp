export default function Card({ children, variant = 'elevated', className = '' }) {
  const base = 'rounded-xl p-4';
  const styles = {
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-white border border-gray-200',
  };

  return (
    <div className={`${base} ${styles[variant] || styles.elevated} ${className}`}>
      {children}
    </div>
  );
}
