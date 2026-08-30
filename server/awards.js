// Awards computed from a station's confirmed QSL cards. Coarse continent
// classification from grid-center coordinates — good enough for a trophy.

import { gridToLatLon } from './geo.js';

function continentOf(grid) {
  const { lat, lon } = gridToLatLon(grid);
  if (lat < -10 && lon > 110) return 'OC';
  if (lon > -30 && lon < 55 && lat < 12 && lat > -40) return 'AF';
  if (lon >= -30 && lon <= 42 && lat >= 34) return 'EU';
  if (lon > 42 && lat > 0) return 'AS';
  if (lon < -30 && lat > 12) return 'NA';
  if (lon < -30 && lat <= 12) return 'SA';
  if (lat < 12 && lon >= 55 && lon <= 110) return 'AS';
  return 'OC';
}

const AWARDS = [
  {
    id: 'first-contact',
    name: 'First Contact',
    rule: 'One confirmed QSO',
    earned: (cards) => cards.length >= 1,
  },
  {
    id: 'dx-hound',
    name: 'DX Hound',
    rule: 'A confirmed path over 5,000 km',
    earned: (cards) => cards.some((c) => c.km > 5000),
  },
  {
    id: 'storm-rider',
    name: 'Storm Rider',
    rule: 'A contact made at K 5 or worse',
    earned: (cards) => cards.some((c) => c.k >= 5),
  },
  {
    id: 'ragchewer',
    name: 'Ragchewer',
    rule: 'Ten confirmed QSOs',
    earned: (cards) => cards.length >= 10,
  },
  {
    id: 'three-continents',
    name: 'Worked 3 Continents',
    rule: 'Confirmed contacts on three continents',
    earned: (cards, mine) => {
      const set = new Set(cards.map((c) => continentOf(c.them.grid)));
      return set.size >= 3;
    },
  },
];

export function awardsFor(cards) {
  return AWARDS.map((a) => ({
    id: a.id,
    name: a.name,
    rule: a.rule,
    earned: a.earned(cards),
  }));
}
