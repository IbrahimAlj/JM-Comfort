export default function FeatureCard({ item }) {
  const { title, desc } = item;
  return (
    <article className="rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
    </article>
  );
}
