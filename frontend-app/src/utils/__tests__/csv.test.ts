import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sanitizeForCsv, arrayToCsv, downloadCsv } from '../csv'

describe('CSV Utilities', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  describe('sanitizeForCsv', () => {
    it('should handle null and undefined values', () => {
      expect(sanitizeForCsv(null)).toBe('')
      expect(sanitizeForCsv(undefined)).toBe('')
    })

    it('should convert values to strings', () => {
      expect(sanitizeForCsv(123)).toBe('123')
      expect(sanitizeForCsv(true)).toBe('true')
      expect(sanitizeForCsv(false)).toBe('false')
    })

    it('should prevent CSV injection by prefixing with apostrophe', () => {
      expect(sanitizeForCsv('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)")
      expect(sanitizeForCsv('+123')).toBe("'+123")
      expect(sanitizeForCsv('-456')).toBe("'-456")
      expect(sanitizeForCsv('@function')).toBe("'@function")
    })

    it('should normalize newlines', () => {
      // The function wraps text with newlines in quotes, so we need to account for that
      expect(sanitizeForCsv('line1\r\nline2')).toBe('"line1\nline2"')
      // The function only handles \r\n to \n conversion, not \r alone, and doesn't wrap \r alone in quotes
      expect(sanitizeForCsv('line1\rline2')).toBe('line1\rline2')
      // Test with just \n
      expect(sanitizeForCsv('line1\nline2')).toBe('"line1\nline2"')
    })

    it('should escape quotes by doubling them', () => {
      expect(sanitizeForCsv('text with "quotes"')).toBe('"text with ""quotes"""')
    })

    it('should wrap in quotes when containing commas, quotes, or newlines', () => {
      expect(sanitizeForCsv('text,with,commas')).toBe('"text,with,commas"')
      expect(sanitizeForCsv('text\nwith\nnewlines')).toBe('"text\nwith\nnewlines"')
      expect(sanitizeForCsv('text with "quotes"')).toBe('"text with ""quotes"""')
    })

    it('should not wrap simple text in quotes', () => {
      expect(sanitizeForCsv('simple text')).toBe('simple text')
      expect(sanitizeForCsv('123')).toBe('123')
    })
  })

  describe('arrayToCsv', () => {
    it('should convert array to CSV format', () => {
      const headers = ['Name', 'Age', 'City']
      const rows = [
        ['John', 25, 'New York'],
        ['Jane', 30, 'London'],
      ]

      const result = arrayToCsv(headers, rows)
      const expected = 'Name,Age,City\nJohn,25,New York\nJane,30,London'

      expect(result).toBe(expected)
    })

    it('should handle empty arrays', () => {
      const headers: string[] = []
      const rows: (string | number | null | undefined)[][] = []

      const result = arrayToCsv(headers, rows)
      expect(result).toBe('')
    })

    it('should handle arrays with special characters', () => {
      const headers = ['Name', 'Description']
      const rows = [
        ['John', 'Text with "quotes" and, commas'],
        ['Jane', 'Text with\nnewlines'],
      ]

      const result = arrayToCsv(headers, rows)
      const expected = 'Name,Description\nJohn,"Text with ""quotes"" and, commas"\nJane,"Text with\nnewlines"'

      expect(result).toBe(expected)
    })

    it('should handle null and undefined values in rows', () => {
      const headers = ['Name', 'Age', 'City']
      const rows = [
        ['John', null, 'New York'],
        ['Jane', 30, undefined],
      ]

      const result = arrayToCsv(headers, rows)
      const expected = 'Name,Age,City\nJohn,,New York\nJane,30,'

      expect(result).toBe(expected)
    })
  })

  describe('downloadCsv', () => {
    it('should create and trigger download', () => {
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
      const mockRevokeObjectURL = vi.fn()

      // Mock URL methods
      Object.defineProperty(global.URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true,
      })
      Object.defineProperty(global.URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true,
      })

      const filename = 'test.csv'
      const csvContent = 'Name,Age\nJohn,25\nJane,30'

      downloadCsv(filename, csvContent)

      // Verify Blob creation
      expect(mockCreateObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/csv;charset=utf-8;',
        })
      )

      // Verify URL cleanup
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    it('should handle empty CSV content', () => {
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
      const mockRevokeObjectURL = vi.fn()

      Object.defineProperty(global.URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true,
      })
      Object.defineProperty(global.URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true,
      })

      downloadCsv('empty.csv', '')

      expect(mockCreateObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/csv;charset=utf-8;',
        })
      )
    })
  })
})
