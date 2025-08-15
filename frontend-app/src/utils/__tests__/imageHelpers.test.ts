import { describe, it, expect } from 'vitest'
import { getInitials, generateSvgPlaceholder } from '../imageHelpers'

describe('Image Helpers', () => {
  describe('getInitials', () => {
    it('should return empty string for empty or null input', () => {
      expect(getInitials('')).toBe('')
      expect(getInitials('   ')).toBe('')
    })

    it('should return first letter for single word', () => {
      expect(getInitials('John')).toBe('J')
      expect(getInitials('jane')).toBe('J')
      expect(getInitials('TEST')).toBe('T')
    })

    it('should return first letters of each word for multiple words', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('jane smith')).toBe('JS')
      expect(getInitials('Mary Jane Watson')).toBe('MJW')
    })

    it('should handle extra spaces between words', () => {
      expect(getInitials('John   Doe')).toBe('JD')
      expect(getInitials('  Jane  Smith  ')).toBe('JS')
    })

    it('should handle special characters and numbers', () => {
      expect(getInitials('John-Doe')).toBe('J')
      expect(getInitials('John123')).toBe('J')
      expect(getInitials('John Doe-Smith')).toBe('JD')
    })
  })

  describe('generateSvgPlaceholder', () => {
    it('should generate SVG with initials for single word', () => {
      const result = generateSvgPlaceholder('John')
      expect(result).toContain('data:image/svg+xml,')
      expect(result).toContain('J')
      
      // Decode to check content
      const decoded = decodeURIComponent(result.replace('data:image/svg+xml,', ''))
      expect(decoded).toContain('width=\'150\'')
      expect(decoded).toContain('height=\'150\'')
      expect(decoded).toContain('fill=\'#e0e0e0\'')
      expect(decoded).toContain('fill=\'#757575\'')
    })

    it('should generate SVG with initials for multiple words', () => {
      const result = generateSvgPlaceholder('John Doe')
      expect(result).toContain('data:image/svg+xml,')
      expect(result).toContain('JD')
      
      // Decode to check content
      const decoded = decodeURIComponent(result.replace('data:image/svg+xml,', ''))
      expect(decoded).toContain('font-size=\'40\'')
      expect(decoded).toContain('text-anchor=\'middle\'')
      expect(decoded).toContain('dominant-baseline=\'middle\'')
    })

    it('should handle empty string input', () => {
      const result = generateSvgPlaceholder('')
      expect(result).toContain('data:image/svg+xml,')
      
      // Decode to check content
      const decoded = decodeURIComponent(result.replace('data:image/svg+xml,', ''))
      expect(decoded).toContain('width=\'150\'')
      expect(decoded).toContain('height=\'150\'')
      // Should contain empty text element
      expect(decoded).toContain('></text>')
    })

    it('should properly encode SVG content', () => {
      const result = generateSvgPlaceholder('Test User')
      expect(result).toContain('data:image/svg+xml,')
      
      // Decode the URI component to verify content
      const decoded = decodeURIComponent(result.replace('data:image/svg+xml,', ''))
      expect(decoded).toContain('<svg')
      expect(decoded).toContain('TU')
      expect(decoded).toContain('xmlns=\'http://www.w3.org/2000/svg\'')
    })

    it('should generate consistent SVG structure', () => {
      const result = generateSvgPlaceholder('Alice Bob')
      const decoded = decodeURIComponent(result.replace('data:image/svg+xml,', ''))
      
      // Check SVG structure
      expect(decoded).toMatch(/<svg[^>]*>/)
      expect(decoded).toMatch(/<rect[^>]*>/)
      expect(decoded).toMatch(/<text[^>]*>AB<\/text>/)
      
      // Check attributes
      expect(decoded).toContain('width=\'150\'')
      expect(decoded).toContain('height=\'150\'')
      expect(decoded).toContain('fill=\'#e0e0e0\'')
      expect(decoded).toContain('fill=\'#757575\'')
      expect(decoded).toContain('font-size=\'40\'')
      expect(decoded).toContain('text-anchor=\'middle\'')
      expect(decoded).toContain('dominant-baseline=\'middle\'')
    })
  })
})
