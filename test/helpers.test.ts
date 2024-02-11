import { describe, it, expect } from 'vitest'
import { formatString, fromMsToUp } from '../src/helpers'

describe('helpers', () => {
  describe('formatString', () => {
    it('should correspond to the specified length', () => {
      // Act
      const string = formatString('eventName', 10)

      // Assert
      expect(string).toHaveLength(10)
    })

    it('should contain the original content', () => {
      // Act
      const string = formatString('eventName', 10)

      // Assert
      expect(string).toContain('eventName')
    })

    it('should return a string, exactly as expected', () => {
      // Act
      const string = formatString('eventName', 10)

      // Assert
      expect(string).toBe('eventName ')
    })
  })

  describe('fromMsToUp', () => {
    it('should return milliseconds', () => {
      // Act
      const { value, unit } = fromMsToUp(1)

      // Assert
      expect(value).toBe(1)
      expect(unit).toBe('ms')
    })

    it('should round milliseconds to seconds', () => {
      // Act
      const { value, unit } = fromMsToUp(1000)

      // Assert
      expect(value).toBe(1)
      expect(unit).toBe('s')
    })

    it('should round milliseconds to minutes', () => {
      // Act
      const { value, unit } = fromMsToUp(60000)

      // Assert
      expect(value).toBe(1)
      expect(unit).toBe('m')
    })

    it('should round milliseconds to hours', () => {
      // Act
      const { value, unit } = fromMsToUp(3600000)

      // Assert
      expect(value).toBe(1)
      expect(unit).toBe('h')
    })
  })
})
