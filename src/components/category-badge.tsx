interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-block text-[11px] font-semibold px-3 py-0.5 rounded-full border border-border-strong text-ink-soft">
      {category}
    </span>
  );
}
