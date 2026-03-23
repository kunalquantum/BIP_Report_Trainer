export const LEVELS = [
  {
    level: 1,
    title: 'BIP Novice',
    badge: '🔰',
    minPoints: 0,
    maxPoints: 99,
    color: '#78909C',
    perks: ['Access to Beginner modules', 'Basic scenario challenges']
  },
  {
    level: 2,
    title: 'Report Analyst',
    badge: '📊',
    minPoints: 100,
    maxPoints: 299,
    color: '#1976D2',
    perks: ['Unlock Intermediate modules', 'Data Model scenarios', 'Performance benchmarking']
  },
  {
    level: 3,
    title: 'Data Architect',
    badge: '🏗️',
    minPoints: 300,
    maxPoints: 599,
    color: '#2E7D32',
    perks: ['Unlock Advanced modules', 'Bursting scenarios', 'Peer comparison dashboard']
  },
  {
    level: 4,
    title: 'BIP Expert',
    badge: '⭐',
    minPoints: 600,
    maxPoints: 999,
    color: '#E65100',
    perks: ['All modules unlocked', 'Expert challenge scenarios', 'Certification track eligible']
  },
  {
    level: 5,
    title: 'BIP Master',
    badge: '🏆',
    minPoints: 1000,
    maxPoints: Infinity,
    color: '#C74634',
    perks: ['Master badge on profile', 'Create custom scenarios', 'Mentor other learners']
  }
]

export function getLevelForPoints(points) {
  return LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0]
}

export function getNextLevel(points) {
  const current = getLevelForPoints(points)
  return LEVELS.find(l => l.level === current.level + 1) || null
}

export function getProgressToNext(points) {
  const current = getLevelForPoints(points)
  const next = getNextLevel(points)
  if (!next) return 100
  return Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100)
}