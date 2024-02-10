/** Envelopes the content in a string of a certain length */
export function formatString(text: string, count: number): string {
  const spaceString = ' '.repeat(count)
  return text + spaceString.substring(text.length)
}

/** Converts milliseconds into a conveniently readable unit */
export function fromMsToUp(ms: number): { value: number; unit: 'ms' | 's' | 'm' | 'h' } {
  if (ms < 1000) return { value: ms, unit: 'ms' }
  if (ms < 60000) return { value: ms / 1000, unit: 's' }
  if (ms < 3600000) return { value: ms / 60000, unit: 'm' }

  return { value: ms / 3600000, unit: 'h' }
}
