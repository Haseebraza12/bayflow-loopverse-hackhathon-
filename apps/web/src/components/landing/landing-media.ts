/**
 * Every image on the landing page (`app/(public)/page.tsx`) and where it comes from. All of it is
 * BayFlow's own material:
 *
 * - **Photos** are crops of the workshop photos in `public/shops` (City of Greenville, NC, Public
 *   Works Fleet Division; Public Domain Mark 1.0 on Flickr, so no rights reserved and no credit
 *   required). The source page of each photo is kept below, as in `lib/shop-photos.ts`.
 * - **Screens** are screenshots of BayFlow itself, taken from the running web app with its demo
 *   data (desktop: a 1280 × 720 viewport saved at 2×; phone: a 390 × 844 viewport saved at 2×).
 *
 * Floating chips, stat badges and mini cards around them are HTML, so they stay sharp, readable
 * and in the design tokens.
 */

export interface LandingImage {
  src: string
  /** Size of the file, so `next/image` can reserve the space. */
  width: number
  height: number
  alt: string
}

interface LandingPhoto extends LandingImage {
  /** Flickr page of the public-domain original. */
  source: string
}

const FLICKR = 'https://www.flickr.com/photos/cityofgreenvillenc'

export const LANDING_PHOTOS = {
  heroTechnician: {
    src: '/landing/hero-technician.webp',
    width: 600,
    height: 1000,
    alt: 'A technician fitting a brake disc with an impact driver',
    source: `${FLICKR}/50211555201/`,
  },
  heroInspection: {
    src: '/landing/hero-inspection.webp',
    width: 660,
    height: 1000,
    alt: 'A mechanic inspecting an engine with a torch',
    source: `${FLICKR}/50211035828/`,
  },
  roleOwner: {
    src: '/landing/role-owner.webp',
    width: 800,
    height: 1000,
    alt: '',
    source: `${FLICKR}/50211831712/`,
  },
  roleAdvisor: {
    src: '/landing/role-advisor.webp',
    width: 800,
    height: 1000,
    alt: '',
    source: `${FLICKR}/52087642980/`,
  },
  roleTechnician: {
    src: '/landing/role-technician.webp',
    width: 704,
    height: 880,
    alt: '',
    source: `${FLICKR}/50211555201/`,
  },
  roleQc: {
    src: '/landing/role-qc.webp',
    width: 736,
    height: 920,
    alt: '',
    source: `${FLICKR}/50211035828/`,
  },
  roleParts: {
    src: '/landing/role-parts.webp',
    width: 800,
    height: 1000,
    alt: '',
    source: `${FLICKR}/50211830327/`,
  },
  featureWorkflow: {
    src: '/landing/feature-workflow.webp',
    width: 774,
    height: 900,
    alt: '',
    source: `${FLICKR}/50211831712/`,
  },
  featureCustomer: {
    src: '/landing/feature-customer.webp',
    width: 774,
    height: 900,
    alt: '',
    source: `${FLICKR}/52087642980/`,
  },
  featureTechnician: {
    src: '/landing/feature-technician.webp',
    width: 774,
    height: 900,
    alt: '',
    source: `${FLICKR}/50211558806/`,
  },
} satisfies Record<string, LandingPhoto>

export const LANDING_SCREENS = {
  ownerOverview: {
    src: '/landing/screen-owner-overview.webp',
    width: 2560,
    height: 1440,
    alt: "BayFlow's owner overview for Lahore Auto Care: bookings that need action, jobs in progress, cars ready for pick-up, active bookings and the team",
  },
  bookingWizard: {
    src: '/landing/screen-booking-wizard.webp',
    width: 2560,
    height: 1440,
    alt: "BayFlow's booking wizard at Lahore Auto Care: step 2 of 5, choosing the services the car needs",
  },
  technicianJob: {
    src: '/landing/screen-technician-job.webp',
    width: 2560,
    height: 1440,
    alt: "A technician's job in BayFlow: a Honda Civic in repair, with its estimate lines for parts and labour",
  },
  estimateApproval: {
    src: '/landing/screen-estimate-approval.webp',
    width: 2560,
    height: 1440,
    alt: "A customer's booking in BayFlow, with the estimate waiting for approval and buttons to approve or decline it",
  },
  qcChecklist: {
    src: '/landing/screen-qc-checklist.webp',
    width: 2560,
    height: 1440,
    alt: "BayFlow's quality check for a Kia Sportage: the vehicle inspection checklist with a pass or fail for each item",
  },
  phoneBookAService: {
    src: '/landing/phone-book-a-service.webp',
    width: 780,
    height: 1688,
    alt: "BayFlow's Book a service page on a phone: search workshops by area and pick a city",
  },
  phoneMyBookings: {
    src: '/landing/phone-my-bookings.webp',
    width: 780,
    height: 1688,
    alt: '',
  },
  phoneTechnicianJobs: {
    src: '/landing/phone-technician-jobs.webp',
    width: 780,
    height: 1688,
    alt: "A technician's assigned jobs in BayFlow on a phone",
  },
} satisfies Record<string, LandingImage>
