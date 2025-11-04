import FeatureCard from "./FeatureCard.jsx";
import { WHY_ITEMS } from "../../data/whyChooseUs.js";

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Why Choose Us
        </h2>
        <p className="mt-3 text-gray-600">
          We focus on transparent service, long-term savings, and responsive support.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_ITEMS.map((item) => (
          <FeatureCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
