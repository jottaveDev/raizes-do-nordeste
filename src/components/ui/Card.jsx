export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-marrom/10 bg-white p-5 shadow-cartao ${className}`}
    >
      {children}
    </div>
  )
}
