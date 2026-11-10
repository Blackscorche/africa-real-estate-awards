import { createFileRoute, notFound } from "@tanstack/react-router";
import { findCollection } from "@/lib/admin-config";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/$section")({
  beforeLoad: ({ params }) => {
    if (!findCollection(params.section)) throw notFound();
  },
  component: SectionPage,
});

function SectionPage() {
  const { section } = Route.useParams();
  const config = findCollection(section)!;
  return (
    <div>
      <p className="eyebrow text-primary">{config.group}</p>
      <h1 className="mt-1 font-display text-4xl uppercase">{config.label}</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">{config.description}</p>
      <CollectionManager key={config.key} config={config} />
    </div>
  );
}
