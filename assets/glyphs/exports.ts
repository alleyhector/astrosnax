import { ImageSourcePropType } from 'react-native'

/* eslint-disable @typescript-eslint/no-var-requires */
const Sun = require('@/assets/glyphs/planets/Sun.png')
const Moon = require('@/assets/glyphs/planets/Moon.png')
const Mercury = require('@/assets/glyphs/planets/Mercury.png')
const Venus = require('@/assets/glyphs/planets/Venus.png')
const Mars = require('@/assets/glyphs/planets/Mars.png')
const Jupiter = require('@/assets/glyphs/planets/Jupiter.png')
const Saturn = require('@/assets/glyphs/planets/Saturn.png')
const Uranus = require('@/assets/glyphs/planets/Uranus.png')
const Neptune = require('@/assets/glyphs/planets/Neptune.png')
const Pluto = require('@/assets/glyphs/planets/Pluto.png')

const Aries = require('@/assets/glyphs/signs/Aries.png')
const Taurus = require('@/assets/glyphs/signs/Taurus.png')
const Gemini = require('@/assets/glyphs/signs/Gemini.png')
const Cancer = require('@/assets/glyphs/signs/Cancer.png')
const Leo = require('@/assets/glyphs/signs/Leo.png')
const Virgo = require('@/assets/glyphs/signs/Virgo.png')
const Libra = require('@/assets/glyphs/signs/Libra.png')
const Scorpio = require('@/assets/glyphs/signs/Scorpio.png')
const Sagittarius = require('@/assets/glyphs/signs/Sagittarius.png')
const Capricorn = require('@/assets/glyphs/signs/Cap.png')
const Aquarius = require('@/assets/glyphs/signs/Aquarius.png')
const Pisces = require('@/assets/glyphs/signs/Pisces.png')

const conjunct = require('@/assets/glyphs/aspects/conjunction.png')
const sextile = require('@/assets/glyphs/aspects/sextile.png')
const square = require('@/assets/glyphs/aspects/square.png')
const trine = require('@/assets/glyphs/aspects/trine.png')
const opposition = require('@/assets/glyphs/aspects/opposition.png')
const ingress = require('@/assets/glyphs/aspects/ingress.png')

export const imagesMap: { [key: string]: ImageSourcePropType } = {
  Sun,
  Moon,
  Mercury,
  Venus,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
  Pluto,
  Aries,
  Taurus,
  Gemini,
  Cancer,
  Leo,
  Virgo,
  Libra,
  Scorpio,
  Sagittarius,
  Capricorn,
  Aquarius,
  Pisces,
  conjunct,
  sextile,
  square,
  trine,
  opposition,
  ingress,
}
