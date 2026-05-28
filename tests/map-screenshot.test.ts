import { isScreenshotMostlyBlank } from '../src/utils/map-screenshot'

/** PNG 2×2 branco em base64. */
const WHITE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAADklEQVQI12P4z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('map-screenshot utilities', () => {
  it('isScreenshotMostlyBlank detects empty/white image', async () => {
    const blank = await isScreenshotMostlyBlank(WHITE_PNG)
    expect(blank).toBe(true)
  })

})
