interface Category {
  icon: string;
  label: string;
  active?: boolean;
}

const categories: Category[] = [
  { icon: '🏖️', label: 'Plage & Mer', active: true },
  { icon: '🏙️', label: 'Cotonou Centre' },
  { icon: '✈️', label: 'Près aéroport' },
  { icon: '💼', label: 'Business' },
  { icon: '🌿', label: 'Éco-tourisme' },
  { icon: '🏛️', label: 'Culturel' },
  { icon: '🏊', label: 'Piscine' },
  { icon: '👑', label: 'Luxe' },
  { icon: '💰', label: 'Petit budget' },
  { icon: '🏡', label: 'Villa entière' },
];

export function CategoryStrip() {
  return (
    <div className="bg-[#f4fffe] border-y border-[#e2f5f2] overflow-x-auto scrollbar-hide">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex gap-2 lg:gap-3">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`
              flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all
              ${cat.active
                ? 'bg-[#00c9a7] text-white shadow-md'
                : 'bg-white text-[#0f2940] border border-[#e2f5f2] hover:border-[#00c9a7] hover:shadow-sm'
              }
            `}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
