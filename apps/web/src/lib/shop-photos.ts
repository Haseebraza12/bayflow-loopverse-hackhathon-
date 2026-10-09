/**
 * Cover photos for shop cards, the shop page and the booking summary. The API has no shop photo
 * yet (E-08 carries `logo_url` only), so a shop gets one of these by slug: the six seeded shops
 * have a fixed pick and any other shop gets a stable one from the same set.
 *
 * Every photo is by the City of Greenville, NC (Public Works Fleet Division) and carries the
 * Public Domain Mark 1.0 on Flickr: no rights reserved and no credit required. The source page of
 * each is kept here anyway, so anyone can check it.
 */

export interface ShopPhoto {
  src: string
  /** Width and height of the file, so `next/image` reserves the space (no layout shift). */
  width: number
  height: number
  alt: string
  source: string
}

const PHOTOS = {
  engineBay: {
    src: '/shops/engine-bay.webp',
    width: 1599,
    height: 1064,
    alt: 'A mechanic working in an open engine bay',
    source: 'https://www.flickr.com/photos/cityofgreenvillenc/50211831712/',
  },
  brakeService: {
    src: '/shops/brake-service.webp',
    width: 1599,
    height: 1064,
    alt: 'A mechanic fitting a brake disc with an impact driver',
    source: 'https://www.flickr.com/photos/cityofgreenvillenc/50211555201/',
  },
  diagnostics: {
    src: '/shops/diagnostics.webp',
    width: 1599,
    height: 1064,
    alt: 'A mechanic checking the engine oil, with a diagnostic screen on the bench',
    source: 'https://www.flickr.com/photos/cityofgreenvillenc/52087642980/',
  },
  engineInspection: {
    src: '/shops/engine-inspection.webp',
    width: 1599,
    height: 1064,
    alt: 'A mechanic inspecting an engine with a torch',
    source: 'https://www.flickr.com/photos/cityofgreenvillenc/50211035828/',
  },
  underLift: {
    src: '/shops/under-lift.webp',
    width: 1599,
    height: 1064,
    alt: 'A mechanic checking the underside of a car on a lift',
    source: 'https://www.flickr.com/photos/cityofgreenvillenc/50211558806/',
  },
  drivetrain: {
    src: '/shops/drivetrain.webp',
    width: 1599,
    height: 1064,
    alt: 'A mechanic working on the drivetrain from under a car',
    source: 'https://www.flickr.com/photos/cityofgreenvillenc/50211830327/',
  },
} satisfies Record<string, ShopPhoto>

export const SHOP_PHOTOS: ReadonlyArray<ShopPhoto> = Object.values(PHOTOS)

/** The seeded shops (spec 11) each get a photo that suits them. */
const BY_SLUG: Record<string, ShopPhoto> = {
  'lahore-auto-care': PHOTOS.engineBay,
  'raza-auto-works': PHOTOS.brakeService,
  'clifton-car-clinic': PHOTOS.diagnostics,
  'margalla-motor-works': PHOTOS.engineInspection,
  'pindi-auto-garage': PHOTOS.underLift,
  'lyallpur-motors': PHOTOS.drivetrain,
}

/** A shop's cover photo: its own pick, or a stable one chosen from its slug. */
export function shopPhoto(slug: string): ShopPhoto {
  const own = BY_SLUG[slug]
  if (own) return own
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return SHOP_PHOTOS[hash % SHOP_PHOTOS.length]!
}
