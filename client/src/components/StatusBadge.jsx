const statusStyles = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}