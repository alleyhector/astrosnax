import { FC, memo } from 'react'
import { Transit, TransitsProps } from '@/types/contentful'
import TransitCard from './ui/TransitCard'

const getFood = (foods: string) => {
  switch (foods) {
    case 'Sun':
      return ['lemon', 'mexican']
    case 'Moon':
    case 'New Moon':
    case 'Full Moon':
      return ['rice', 'indian']
    case 'Mercury':
      return ['quick', 'american']
    case 'Venus':
      return ['egg', 'french']
    case 'Mars':
      return ['cheese', 'italian']
    case 'Jupiter':
      return ['chicken', 'greek']
    case 'Saturn':
      return ['potato', 'central europe']
    case 'Uranus':
      return ['spicy', 'caribbean']
    case 'Neptune':
      return ['seafood', 'mediterranean']
    case 'Pluto':
      return ['mushroom', 'asian']
    case 'Aries':
      return ['beans', 'american']
    case 'Taurus':
      return ['butter', 'french']
    case 'Gemini':
      return ['onion', 'middle eastern']
    case 'Cancer':
      return ['bread', 'italian']
    case 'Leo':
      return ['honey', 'mexican']
    case 'Virgo':
      return ['tomato', 'nordic']
    case 'Libra':
      return ['oregano', 'south american']
    case 'Scorpio':
      return ['oil', 'indian']
    case 'Sagittarius':
      return ['pepper', 'caribbean']
    case 'Capricorn':
      return ['garlic', 'british']
    case 'Aquarius':
      return ['vinegar', 'asian']
    case 'Pisces':
      return ['fish', 'eastern europe']
    case 'trine':
      return 'orange'
    case 'sextile':
      return 'sweet'
    case 'square':
      return 'salt'
    case 'opposition':
      return 'nut'
    case 'conjunction':
      return 'sandwich'
    case 'ingress':
      return 'salad'
    case 'retrograde':
      return 'sour'
    case 'direct':
      return 'fresh'
    default:
      return ''
  }
}

const buildQuery = (transit: Transit) => {
  if (transit.foods !== undefined && transit.foods !== null) {
    return transit.foods.toString()
  } else {
    const planetFood = getFood(transit.planet)
    const signFood = getFood(transit.sign)
    const transitingPlanetFood = getFood(transit.transitingPlanet)
    const transitingSignFood = getFood(transit.transitingSign)
    const aspectFood = getFood(transit.aspect)

    // Ingress, retrograde, and direct are single-planet events
    if (
      transit.aspect === 'ingress' ||
      transit.aspect === 'retrograde' ||
      transit.aspect === 'direct'
    ) {
      return `${planetFood[0]},${signFood[0]},${aspectFood}`
    }

    return `${planetFood[0]},${signFood[0]},${transitingPlanetFood[0] ?? ''},${transitingSignFood[0] ?? ''},${aspectFood}`
  }
}

const getTransitText = (transit: Transit) => {
  if (transit.aspect === 'ingress') {
    return `${transit.planet} enters ${transit.sign}`
  }

  if (transit.aspect === 'retrograde') {
    return `${transit.planet} stations retrograde in ${transit.sign}`
  }

  if (transit.aspect === 'direct') {
    return `${transit.planet} stations direct in ${transit.sign}`
  }

  return `${transit.planet} in ${transit.sign} ${transit.transitingPlanet ? `${transit.aspect} ${transit.transitingPlanet} in ${transit.transitingSign}` : ''}`
}

const getGlyphs = (transit: Transit): string[] => {
  // Single-planet events: ingress, retrograde, direct
  if (
    transit.aspect === 'ingress' ||
    transit.aspect === 'retrograde' ||
    transit.aspect === 'direct'
  ) {
    return [transit.planet, transit.aspect, transit.sign]
  }

  // Moon phases (New Moon / Full Moon)
  if (transit.planet === 'New Moon' || transit.planet === 'Full Moon') {
    return ['Moon', transit.sign]
  }

  // Regular transits with aspects
  return [
    transit.planet,
    transit.sign,
    transit.aspect,
    transit.transitingPlanet,
    transit.transitingSign,
  ]
}

const getSpotifyQuery = (transit: Transit) => {
  if (transit.aspect === 'ingress') {
    return `${transit.planet} enters ${transit.sign}`
  }

  if (transit.aspect === 'retrograde') {
    return `${transit.planet} retrograde in ${transit.sign}`
  }

  if (transit.aspect === 'direct') {
    return `${transit.planet} direct in ${transit.sign}`
  }

  if (transit.planet === 'New Moon' || transit.planet === 'Full Moon') {
    return `${transit.planet} in ${transit.sign}`
  }

  return `${transit.planet} in ${transit.sign} ${transit.aspect} ${transit.transitingPlanet} in ${transit.transitingSign}`
}

const Transits: FC<TransitsProps> = ({ transits }) => {
  return (
    <>
      {transits &&
        transits.map((transit, index) => (
          <TransitCard
            key={index}
            transitText={getTransitText(transit)}
            glyphs={getGlyphs(transit)}
            recipeQuery={buildQuery(transit)}
            recipeFallbackFood={getFood(transit.aspect)}
            spotifyQuery={getSpotifyQuery(transit)}
          />
        ))}
    </>
  )
}

export default memo(Transits)
