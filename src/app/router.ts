export type Page =
  | 'home'
  | 'search-logements'
  | 'search-hotels'
  | 'listing'
  | 'booking'
  | 'confirmation'
  | 'profile'
  | 'account'
  | 'account-reservations'
  | 'host-dashboard'
  | 'host-annonces'
  | 'host-calendrier'
  | 'host-reservations'
  | 'messages'
  | 'favorites'
  | 'publish'
  | 'help'
  | 'about'
  | 'blog'
  | 'terms'
  | 'not-found';

export type Route = {
  name: Page;
  id?: string;
};

export function parseRoute(path: string): Route {
  const cleaned = path.replace(/\/+/g, '/').replace(/^(\/+)/, '').replace(/(\/+)$/, '');
  const segments = cleaned.split('/').filter(Boolean);

  if (segments.length === 0) return { name: 'home' };
  if (segments[0] === 's') {
    return { name: segments[1] === 'hotels' ? 'search-hotels' : 'search-logements' };
  }
  if (segments[0] === 'annonce') {
    return { name: 'listing', id: segments[1] ?? '1' };
  }
  if (segments[0] === 'reserver') {
    if (segments[1] === 'confirmation') return { name: 'confirmation', id: segments[2] ?? '1' };
    return { name: 'booking', id: segments[1] ?? '1' };
  }
  if (segments[0] === 'profil') {
    return { name: 'profile', id: segments[1] ?? 'me' };
  }
  if (segments[0] === 'mon-compte') {
    return { name: segments[1] === 'reservations' ? 'account-reservations' : 'account' };
  }
  if (segments[0] === 'hote') {
    if (segments[1] === 'tableau-de-bord') return { name: 'host-dashboard' };
    if (segments[1] === 'annonces') return { name: 'host-annonces' };
    if (segments[1] === 'calendrier') return { name: 'host-calendrier' };
    if (segments[1] === 'reservations') return { name: 'host-reservations' };
    return { name: 'host-dashboard' };
  }
  if (segments[0] === 'messages') return { name: 'messages' };
  if (segments[0] === 'favoris') return { name: 'favorites' };
  if (segments[0] === 'publier-annonce') return { name: 'publish' };
  if (segments[0] === 'aide') return { name: 'help' };
  if (segments[0] === 'a-propos') return { name: 'about' };
  if (segments[0] === 'blog') return { name: 'blog' };
  if (segments[0] === 'mentions-legales') return { name: 'terms' };

  return { name: 'not-found' };
}

export function routeToPath(route: Route): string {
  switch (route.name) {
    case 'home':
      return '/';
    case 'search-logements':
      return '/s/logements';
    case 'search-hotels':
      return '/s/hotels';
    case 'listing':
      return `/annonce/${route.id ?? '1'}`;
    case 'booking':
      return `/reserver/${route.id ?? '1'}`;
    case 'confirmation':
      return `/reserver/confirmation/${route.id ?? '1'}`;
    case 'profile':
      return `/profil/${route.id ?? 'me'}`;
    case 'account':
      return '/mon-compte';
    case 'account-reservations':
      return '/mon-compte/reservations';
    case 'host-dashboard':
      return '/hote/tableau-de-bord';
    case 'host-annonces':
      return '/hote/annonces';
    case 'host-calendrier':
      return '/hote/calendrier';
    case 'host-reservations':
      return '/hote/reservations';
    case 'messages':
      return '/messages';
    case 'favorites':
      return '/favoris';
    case 'publish':
      return '/publier-annonce';
    case 'help':
      return '/aide';
    case 'about':
      return '/a-propos';
    case 'blog':
      return '/blog';
    case 'terms':
      return '/mentions-legales';
    default:
      return '/404';
  }
}

export function tabFromPage(page: Page) {
  if (page === 'favorites') return 'favorites';
  if (page === 'messages') return 'messages';
  if (page === 'account' || page === 'account-reservations') return 'trips';
  if (page === 'profile') return 'profile';
  return 'explore';
}

export function routeFromTab(tab: 'explore' | 'favorites' | 'trips' | 'messages' | 'profile'): Route {
  switch (tab) {
    case 'favorites':
      return { name: 'favorites' };
    case 'trips':
      return { name: 'account' };
    case 'messages':
      return { name: 'messages' };
    case 'profile':
      return { name: 'profile' };
    default:
      return { name: 'home' };
  }
}
