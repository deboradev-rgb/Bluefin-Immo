import { Search, SlidersHorizontal } from 'lucide-react';

export function MobileSearchBar() {
  return (
    <div className="px-4 py-3">
      <div className="bg-[#f4fffe] border border-[#e2f5f2] rounded-full shadow-md p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#00c9a7]" />
        <span className="text-[#6b7280] flex-1">📍 Où allez-vous au Bénin ?</span>
        <SlidersHorizontal className="w-5 h-5 text-[#0f2940]" />
      </div>
    </div>
  );
}
