import { ArrowLeft, Phone, Mail, MapPin, CheckCircle, Award } from 'lucide-react';

type PageProps = {
  onNavigate?: (route: any) => void;
};

export function CompanyInfoPage({ onNavigate }: PageProps) {
  const infoItems = [
    { label: "Nom légal", value: "Blufin-Immo SARL" },
    { label: "Forme juridique", value: "Société à Responsabilité Limitée" },
    { label: "Capital social", value: "10 000 000 FCFA" },
    { label: "RCCM", value: "RB/COT/2024/B/00123" },
    { label: "IFU", value: "1234567890123" },
    { label: "Siège social", value: "Cotonou, Bénin, 01 BP 1234" }
  ];

  const contacts = [
    { icon: Phone, label: "Téléphone", value: "+229 01 23 45 67", desc: "Lun-Ven, 8h-18h" },
    { icon: Mail, label: "Email", value: "contact@blufin-immo.com", desc: "Réponse sous 24h" },
    { icon: MapPin, label: "Adresse", value: "Haie Vive, Cotonou, Bénin", desc: "En face de la mairie" }
  ];

  const missions = [
    "Faciliter la location de logements courte durée en Afrique de l'Ouest",
    "Sécuriser les transactions entre hôtes et voyageurs",
    "Promouvoir le tourisme local et l'hospitalité africaine",
    "Créer des opportunités économiques pour les propriétaires"
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <h1 className="text-2xl text-[#0F2940]">Informations sur l'entreprise</h1>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Logo et introduction */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#00c9a7] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h2 className="text-3xl font-bold text-[#0F2940] mb-2">Blufin-Immo</h2>
          <p className="text-gray-500">La référence de la location courte durée en Afrique de l'Ouest</p>
        </div>

        {/* Cartes info */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {infoItems.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">{item.label}</p>
              <p className="font-semibold text-[#0F2940]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contacts */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Nous contacter</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 text-center">
                  <Icon className="w-8 h-8 text-[#00c9a7] mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{contact.label}</p>
                  <p className="font-semibold text-[#0F2940]">{contact.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{contact.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notre mission */}
        <div className="bg-[#f4fffe] rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Notre mission</h3>
          <ul className="space-y-3">
            {missions.map((mission, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#00c9a7] mt-0.5" />
                <span className="text-gray-700">{mission}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Certifications et agréments</h3>
          <div className="flex flex-wrap gap-4">
            {["Agrément tourisme", "Certification PCI DSS", "Membre ANTT", "Label Confiance Bénin"].map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <Award className="w-4 h-4 text-[#00c9a7]" />
                <span className="text-sm text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}