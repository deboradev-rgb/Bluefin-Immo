interface DestinationCardProps {
  name: string;
  subtitle: string;
  image: string;
  onClick?: () => void;
}

export function DestinationCard({ name, subtitle, image, onClick }: DestinationCardProps) {
  return (
    <div className="relative h-40 sm:h-52 lg:h-64 rounded-2xl overflow-hidden cursor-pointer group bg-[#f4fffe]" onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2940]/90 via-[#0f2940]/40 to-transparent z-10"></div>
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute bottom-6 left-6 z-20">
        <h3 className="text-white font-bold text-2xl mb-1">{name}</h3>
        <p className="text-white/70 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
