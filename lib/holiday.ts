// Holiday 2026 settings. All times are Central.
export const HOTPLATE_URL = 'https://www.hotplate.com/dogmomclub'

export const HOLIDAY_CODE = 'HOLIDAY'
/** Announcement bar for the HOLIDAY code disappears after this moment. */
export const HOLIDAY_CODE_ENDS = new Date('2027-01-01T00:00:00-06:00')

export const BOUTIQUE = {
  name: 'Kansas City Holiday Boutique',
  venue: 'Overland Park Convention Center',
  dates: 'November 18-22, 2026',
  booth: 'Booth 703A',
  url: 'https://www.kcholidayboutique.com/',
  /** Boutique promos disappear after the show ends. */
  ends: new Date('2026-11-23T00:00:00-06:00'),
}

export const SHIP_BY_MESSAGE = 'Order by Mon, Dec 14 to arrive before Christmas'

export const isBefore = (d: Date) => Date.now() < d.getTime()
