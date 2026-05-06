export function StatCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tighter">{value}</p>
      {subtext && <p className="text-[10px] text-gray-400 font-medium mt-2">{subtext}</p>}
    </div>
  )
}
