import type { ReactNode } from 'react';
import { BookingWidget } from './components/BookingWidget';
import { CategoryStrip } from './components/CategoryStrip';
import { DestinationCard } from './components/DestinationCard';
import { FeatureCard } from './components/FeatureCard';
import { Hero } from './components/Hero';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { SearchResults } from './components/SearchResults';
import { Zap, CheckCircle, Headphones, Home, Heart, MessageCircle, Calendar, ShieldCheck, Rocket, BookOpen, Info, Bookmark, Star, CreditCard, Check, XCircle, BarChart3, CalendarDays } from 'lucide-react';
import type { Route } from './router';

interface PageProps {
  onNavigate?: (route: Route) => void;
}

const popularListings = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
    title: 'Appartement moderne · Haie Vive',
    type: 'Appartement entier',
    rating: 4.87,
    reviewCount: 124,
    price: 45000,
    priceEur: 69,
    badge: 'Certifié Bluefin',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format',
    title: 'Villa spacieuse · Fidjrossè',
    type: 'Villa entière',
    rating: 4.92,
    reviewCount: 89,
    price: 85000,
    priceEur: 130,
    badge: 'Hôte vérifié',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format',
    title: 'Studio meublé · Cocotiers',
    type: 'Studio privé',
    rating: 4.75,
    reviewCount: 56,
    price: 32000,
    priceEur: 49,
    badge: 'Populaire',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format',
    title: 'Chambre confort · Cadjèhoun',
    type: 'Chambre privée',
    rating: 4.68,
    reviewCount: 43,
    price: 18000,
    priceEur: 27,
    badge: 'New',
  },
];

const destinations = [
  { name: 'Ouidah', subtitle: 'Histoire & Culture', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop&auto=format' },
  { name: 'Abomey', subtitle: 'Palais Royaux', image: 'https://images.unsplash.com/photo-1590759668628-05b3b8986301?w=600&h=400&fit=crop&auto=format' },
  { name: 'Porto-Novo', subtitle: 'Capitale béninoise', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop&auto=format' },
  { name: 'Grand-Popo', subtitle: 'Plages & Détente', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format' },
  { name: 'Pendjari', subtitle: 'Safari & Nature', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format' },
];

const blogArticles = [
  { title: 'Top 10 quartiers pour séjourner à Cotonou', excerpt: 'Découvrez les quartiers les plus prisés pour votre séjour dans la capitale économique du Bénin.' },
  { title: 'Visiter Ouidah : guide complet', excerpt: 'Itinéraire, sites historiques et conseils pratiques pour une escapade réussie.' },
  { title: 'Route des Pêches : que faire ?', excerpt: 'Plages, villages de pêcheurs et expériences locales le long du littoral béninois.' },
];

function PageSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Bluefin-Immo</p>
        <h2 className="text-2xl lg:text-4xl font-bold text-[#0f2940]">{title}</h2>
        {subtitle && <p className="text-sm lg:text-base text-[#6b7280] mt-3 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function HomePage({ onNavigate }: PageProps) {
  return (
    <div className="space-y-12">
      <Hero onSearch={() => onNavigate?.({ name: 'search-logements' })} />
      <CategoryStrip />

      <PageSection
        title="Hébergements populaires à Cotonou"
        subtitle="Les meilleures annonces Bluefin-Immo, sélectionnées pour votre séjour."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {popularListings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}
            />
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Découvrez le Bénin"
        subtitle="Destinations incontournables, du littoral aux parcs naturels."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {destinations.map((dest) => (
            <DestinationCard key={dest.name} {...dest} onClick={() => onNavigate?.({ name: 'search-logements' })} />
          ))}
        </div>
      </PageSection>

      <PageSection title="Pourquoi choisir Bluefin-Immo ?">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
            icon={Zap}
            title="Paiement Mobile Money"
            description="MTN MoMo, Moov Money et Orange Money acceptés pour les voyageurs et les hôtes."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Hôtes vérifiés"
            description="Toutes nos annonces sont certifiées Bluefin pour plus de confiance."
          />
          <FeatureCard
            icon={Headphones}
            title="Support local 24/7"
            description="Assistance béninoise disponible par WhatsApp, SMS et email."
          />
        </div>
      </PageSection>

      <PageSection
        title="Devenez hôte sur Bluefin"
        subtitle="Publiez votre première annonce, atteignez des voyageurs locaux et internationaux."
      >
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-center">
          <div className="space-y-4 text-[#0f2940]">
            <p className="text-base lg:text-lg leading-relaxed">
              Obtenez une visibilité immédiate au Bénin et gérez vos réservations plus facilement grâce à notre dashboard hôte.
            </p>
            <ul className="grid gap-2 text-sm text-[#6b7280]">
              <li>✔️ Publication d'annonce simplifiée</li>
              <li>✔️ Calendrier de disponibilité</li>
              <li>✔️ Paiements Mobile Money et virement</li>
            </ul>
            <button
              onClick={() => onNavigate?.({ name: 'publish' })}
              className="bg-[#00c9a7] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00b396] transition-colors"
            >
              Publier une annonce
            </button>
          </div>
          <div className="rounded-3xl bg-[#f4fffe] p-6 border border-[#e2f5f2]">
            <div className="text-sm text-[#6b7280] mb-2">Estimation de revenus</div>
            <div className="text-3xl font-bold text-[#0f2940] mb-1">120 000 XOF+</div>
            <div className="text-sm text-[#00c9a7]">par semaine pour une villa bien située</div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}

interface SearchPageProps extends PageProps {
  mode: 'logements' | 'hotels';
}

export function SearchPage({ mode, onNavigate }: SearchPageProps) {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <p className="text-sm text-[#00c9a7] uppercase tracking-[0.3em]">Recherche</p>
            <h1 className="text-2xl lg:text-4xl font-bold text-[#0f2940]">{mode === 'hotels' ? 'Hôtels et résidences' : 'Logements au Bénin'}</h1>
            <p className="text-sm text-[#6b7280] mt-2">Filtres locaux, recherche rapide et résultats adaptés.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate?.({ name: 'search-logements' })}
              className={`px-4 py-2 rounded-full border ${mode === 'logements' ? 'bg-[#00c9a7] text-white border-[#00c9a7]' : 'border-[#e2f5f2] text-[#0f2940]'}`}
            >
              Logements
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'search-hotels' })}
              className={`px-4 py-2 rounded-full border ${mode === 'hotels' ? 'bg-[#00c9a7] text-white border-[#00c9a7]' : 'border-[#e2f5f2] text-[#0f2940]'}`}
            >
              Hôtels
            </button>
          </div>
        </div>

        <SearchResults
          mode={mode}
          onBack={() => onNavigate?.({ name: 'home' })}
          onSelectListing={() => onNavigate?.({ name: 'listing', id: '1' })}
        />
      </div>
    </div>
  );
}

export function ListingPage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-white">
      <ListingDetail
        onBack={() => onNavigate?.({ name: 'search-logements' })}
        onOpenBooking={() => onNavigate?.({ name: 'booking', id: '1' })}
      />
    </div>
  );
}

export function BookingPage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-12">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(15,41,64,0.08)] overflow-hidden">
          <div className="bg-[#0f2940] text-white px-6 py-6 sm:px-8">
            <div className="text-xs uppercase tracking-[0.35em] text-[#00c9a7]/90">Tunnel de réservation</div>
            <h1 className="text-3xl lg:text-4xl font-bold mt-3">Réserver votre séjour</h1>
            <p className="mt-2 text-sm text-white/80">Confirmez vos dates, voyageurs et payez en toute sécurité.</p>
          </div>
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <div className="text-sm text-[#6b7280] mb-3">Résumé du séjour</div>
                <div className="space-y-3 text-sm text-[#0f2940]">
                  <div className="flex justify-between"><span>Destination</span><span>Haie Vive, Cotonou</span></div>
                  <div className="flex justify-between"><span>Dates</span><span>6 mai - 9 mai</span></div>
                  <div className="flex justify-between"><span>Voyageurs</span><span>2 adultes</span></div>
                  <div className="flex justify-between"><span>Type</span><span>Appartement entier</span></div>
                </div>
              </div>
              <div className="rounded-3xl border border-[#e2f5f2] p-6 bg-white">
                <BookingWidget price={45000} priceEur={69} />
              </div>
            </div>
            <div className="text-sm text-[#6b7280] leading-relaxed">
              <p className="font-semibold text-[#0f2940] mb-3">Modes de paiement disponibles</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">MTN MoMo</div>
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">Moov Money</div>
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">Orange Money</div>
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">Carte</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => onNavigate?.({ name: 'confirmation', id: '1' })}
                className="w-full sm:w-auto bg-[#00c9a7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#00b396] transition-colors"
              >
                Valider la réservation
              </button>
              <button
                onClick={() => onNavigate?.({ name: 'listing', id: '1' })}
                className="w-full sm:w-auto border border-[#e2f5f2] text-[#0f2940] px-6 py-3 rounded-full hover:bg-[#f4fffe] transition-colors"
              >
                Retour à l'annonce
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmationPage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-[#e8fffb] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white shadow-[0_20px_80px_rgba(15,41,64,0.08)] p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00c9a7]/10 text-[#00c9a7]">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2940] mb-3">Réservation confirmée !</h1>
          <p className="text-sm text-[#6b7280] mb-6">Votre réservation pour l'annonce a bien été prise en compte. Un message de confirmation a été envoyé sur WhatsApp et par email.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => onNavigate?.({ name: 'account-reservations' })}
              className="bg-[#0f2940] text-white px-6 py-3 rounded-full hover:bg-[#1a3a52] transition-colors"
            >
              Voir mes réservations
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'home' })}
              className="border border-[#e2f5f2] text-[#0f2940] px-6 py-3 rounded-full hover:bg-[#f4fffe] transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="bg-[#f4fffe] rounded-[2rem] p-8 flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#0f2940] flex items-center justify-center text-white text-2xl font-bold">M</div>
              <div>
                <h1 className="text-2xl font-bold text-[#0f2940]">Marie Dupont</h1>
                <p className="text-sm text-[#6b7280]">Voyageuse & Superhost</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 border border-[#e2f5f2]">
                <div className="text-xs uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Contact</div>
                <p className="text-sm text-[#0f2940]">marie@bluefin-immo.com</p>
                <p className="text-sm text-[#0f2940]">+229 90 00 00 00</p>
              </div>
              <div className="rounded-3xl bg-white p-5 border border-[#e2f5f2]">
                <div className="text-xs uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Langues</div>
                <p className="text-sm text-[#0f2940]">Français, Anglais, Fon</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <button
              onClick={() => onNavigate?.({ name: 'account' })}
              className="w-full bg-[#00c9a7] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#00b396] transition-colors"
            >
              Mon compte
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'messages' })}
              className="w-full border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-full hover:bg-[#f4fffe] transition-colors"
            >
              Messages
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'favorites' })}
              className="w-full border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-full hover:bg-[#f4fffe] transition-colors"
            >
              Favoris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mon compte" subtitle="Gestion de votre profil, réservations et préférences." >
          <div className="grid gap-6 lg:grid-cols-3">
            <button
              onClick={() => onNavigate?.({ name: 'account-reservations' })}
              className="rounded-3xl bg-white p-6 border border-[#e2f5f2] text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-xl font-semibold text-[#0f2940]">Mes réservations</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Voir l'historique de vos voyages et les prochaines séjours.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'favorites' })}
              className="rounded-3xl bg-white p-6 border border-[#e2f5f2] text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-xl font-semibold text-[#0f2940]">Favoris</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Retrouvez vos annonces sauvegardées et préparez votre prochaine réservation.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'help' })}
              className="rounded-3xl bg-white p-6 border border-[#e2f5f2] text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-xl font-semibold text-[#0f2940]">Aide & support</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Accédez à notre centre d'aide et posez toutes vos questions.</p>
            </button>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function AccountReservationsPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mes réservations" subtitle="Suivez vos voyages passés et futurs." >
          <div className="space-y-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0f2940]">{listing.title}</h3>
                    <p className="text-sm text-[#6b7280]">6 mai - 9 mai · {listing.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}
                      className="text-[#0f2940] border border-[#e2f5f2] rounded-full px-5 py-3 hover:bg-white transition-colors"
                    >
                      Voir l'annonce
                    </button>
                    <span className="text-sm text-[#00c9a7]">Confirmée</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function HostDashboardPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Tableau de bord hôte" subtitle="Gérez vos annonces, revenus et réservations depuis un seul endroit." >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6">
              <div className="text-sm text-[#6b7280]">Revenus du mois</div>
              <div className="text-3xl font-bold text-[#0f2940] mt-3">1 250 000 XOF</div>
            </div>
            <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6">
              <div className="text-sm text-[#6b7280]">Arrivées prévues</div>
              <div className="text-3xl font-bold text-[#0f2940] mt-3">8</div>
            </div>
            <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6">
              <div className="text-sm text-[#6b7280]">Messages non lus</div>
              <div className="text-3xl font-bold text-[#0f2940] mt-3">3</div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <button
              onClick={() => onNavigate?.({ name: 'host-annonces' })}
              className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Mes annonces</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Gérez les offres publiées et leurs performances.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'host-calendrier' })}
              className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Calendrier</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Bloquez des dates et gérez les disponibilités.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'host-reservations' })}
              className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Réservations</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Consultez les demandes et les séjours en cours.</p>
            </button>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function HostListingsPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mes annonces hôte" subtitle="Gestion de vos annonces publiées et de leur visibilité." >
          <div className="space-y-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-[#e2f5f2] p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#0f2940]">{listing.title}</h3>
                  <p className="text-sm text-[#6b7280]">Statut : Publiée · {listing.rating} étoiles</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}
                    className="border border-[#e2f5f2] rounded-full px-5 py-3 text-sm hover:bg-[#f4fffe] transition-colors"
                  >
                    Voir
                  </button>
                  <button className="bg-[#00c9a7] text-white rounded-full px-5 py-3 text-sm hover:bg-[#00b396] transition-colors">Statistiques</button>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function HostCalendarPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Calendrier hôte" subtitle="Organisez votre disponibilité et bloquez des dates importantes." >
          <div className="rounded-[2rem] bg-white border border-[#e2f5f2] p-8">
            <p className="text-sm text-[#6b7280] mb-4">Vue mensuelle avec blocs de disponibilités et tarifs spéciaux.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-[#f4fffe] p-6">
                <h3 className="font-semibold text-[#0f2940] mb-3">Disponibilités</h3>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li>✅ 6 mai - 9 mai : disponible</li>
                  <li>🔴 15 mai : bloqué pour entretien</li>
                  <li>⭐ 20 mai - 22 mai : taux weekend</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-[#f4fffe] p-6">
                <h3 className="font-semibold text-[#0f2940] mb-3">Tarifs</h3>
                <p className="text-sm text-[#6b7280]">Personnalisez vos prix selon la saison et les événements locaux.</p>
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function HostReservationsPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Réservations hôte" subtitle="Suivez les demandes et les séjours en cours." >
          <div className="space-y-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0f2940]">{listing.title}</h3>
                    <p className="text-sm text-[#6b7280]">Demande de réservation reçue · 4 voyageurs · 3 nuits</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-full border border-[#e2f5f2] px-5 py-3 text-sm hover:bg-white transition-colors">Accepter</button>
                    <button className="rounded-full border border-[#e2f5f2] px-5 py-3 text-sm hover:bg-white transition-colors">Refuser</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function MessagesPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Messagerie" subtitle="Conversations entre voyageurs et hôtes." >
          <div className="space-y-4">
            {['Marie', 'Jean', 'Hotel Azalaï', 'Samira'].map((name) => (
              <div key={name} className="rounded-3xl bg-white border border-[#e2f5f2] p-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-[#0f2940]">{name}</div>
                  <div className="text-sm text-[#6b7280]">Bonjour, je souhaite réserver du 10 au 12 mai...</div>
                </div>
                <div className="text-sm text-[#00c9a7]">1 non lu</div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function FavoritesPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Favoris" subtitle="Vos annonces sauvegardées pour planifier votre prochain séjour." >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl overflow-hidden border border-[#e2f5f2] shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}>
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <div className="p-4 bg-[#f4fffe]">
                  <h3 className="font-semibold text-[#0f2940] mb-1">{listing.title}</h3>
                  <p className="text-sm text-[#6b7280]">{listing.type} · {listing.rating} étoiles</p>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function PublishListingPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[950px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Publier une annonce" subtitle="Wizard de création d'annonce pour hôtes et propriétaires." >
          <div className="rounded-[2rem] bg-white border border-[#e2f5f2] p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {['Type', 'Localisation', 'Photos', 'Équipements', 'Tarifs', 'Disponibilités', 'Règlement', 'Publication'].map((step) => (
                <div key={step} className="rounded-3xl bg-[#f4fffe] p-5 border border-[#e2f5f2]">
                  <div className="text-sm text-[#6b7280]">Étape</div>
                  <div className="font-semibold text-[#0f2940] mt-2">{step}</div>
                </div>
              ))}
            </div>
            <div className="text-sm text-[#6b7280] leading-relaxed">
              Commencez par décrire votre logement, chargez des photos mobiles-friendly, ajoutez vos équipements et tarifs en FCFA, puis publiez rapidement sur Bluefin-Immo.
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Centre d'aide" subtitle="FAQ, guides et contact support pour les voyageurs et hôtes." >
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Réservations', desc: 'Modifier vos dates, annuler une réservation ou obtenir un remboursement.' },
              { title: 'Paiements', desc: 'Tout sur Mobile Money, carte bancaire et facturation en FCFA.' },
              { title: 'Hôtes', desc: 'Gérer une annonce, vérifier un voyageur ou configurer un calendrier.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <h3 className="text-lg font-semibold text-[#0f2940] mb-3">{item.title}</h3>
                <p className="text-sm text-[#6b7280]">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[2rem] bg-[#f4fffe] border border-[#e2f5f2] p-8">
            <h3 className="text-xl font-semibold text-[#0f2940] mb-3">Contact support</h3>
            <p className="text-sm text-[#6b7280] mb-4">Chat WhatsApp disponible 8h-20h GMT+1. Email support@bluefin-immo.com</p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[#00c9a7] text-white px-6 py-3">WhatsApp</button>
              <button className="rounded-full border border-[#e2f5f2] px-6 py-3 text-[#0f2940]">Email</button>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="À propos de Bluefin-Immo" subtitle="La mission, l'histoire et l'engagement de Bluefin pour le Bénin." >
          <div className="space-y-6 text-[#0f2940] text-sm leading-relaxed">
            <p>Bluefin-Immo connecte les hébergements béninois au monde entier. Nous permettons aux voyageurs d'accéder à des annonces locales de qualité, tout en aidant les hôtes à digitaliser leur gestion de réservations et de paiements.</p>
            <p>Notre plateforme privilégie le marché local du Bénin, avec un focus sur la sécurité, le paiement Mobile Money et l'expérience mobile-first.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 border border-[#e2f5f2]">
                <div className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Vision</div>
                <p>Devenir la plateforme de référence de l'hébergement au Bénin.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 border border-[#e2f5f2]">
                <div className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Valeurs</div>
                <p>Ouverture, confiance, chaleur locale et performance digitale.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 border border-[#e2f5f2]">
                <div className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Local</div>
                <p>Un ancrage profond au Bénin avec des services adaptés au marché béninois.</p>
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function BlogPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Blog & Guides" subtitle="Des conseils de voyage au Bénin et des idées d'itinéraires." >
          <div className="grid gap-6">
            {blogArticles.map((article) => (
              <button
                key={article.title}
                onClick={() => onNavigate?.({ name: 'about' })}
                className="text-left rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe] hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#0f2940] mb-2">{article.title}</h3>
                <p className="text-sm text-[#6b7280]">{article.excerpt}</p>
              </button>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mentions légales" subtitle="CGU, CGV, confidentialité et politique de cookies." >
          <div className="space-y-6 text-sm text-[#0f2940] leading-relaxed">
            <p><strong>Bluefin-Immo</strong> est une plateforme de réservation d'hébergements opérant depuis Cotonou, République du Bénin. Les services proposés sont destinés aux voyageurs et hôtes du Bénin et de l'international.</p>
            <p>Notre politique de confidentialité respecte la loi n°2009-09 du Bénin sur la protection des données personnelles. Toutes les données utilisateur sont traitées avec sécurité et transparence.</p>
            <p>Toutes les transactions sont facturées en FCFA et peuvent être accompagnées de frais de service Bluefin. Les conditions d'annulation et les modalités de paiement sont précisées sur chaque annonce.</p>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

export function NotFoundPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#e8fffb] flex items-center justify-center px-4">
      <div className="max-w-lg text-center rounded-[2rem] bg-white p-10 shadow-[0_20px_80px_rgba(15,41,64,0.08)]">
        <XCircle className="mx-auto mb-6 w-16 h-16 text-[#00c9a7]" />
        <h1 className="text-3xl font-bold text-[#0f2940] mb-3">Page introuvable</h1>
        <p className="text-sm text-[#6b7280] mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button
          onClick={() => onNavigate?.({ name: 'home' })}
          className="bg-[#00c9a7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#00b396] transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
