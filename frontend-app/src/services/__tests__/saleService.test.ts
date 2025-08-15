import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saleService } from '../saleService'
import { supabase } from '../../supabaseClient'
import { productService } from '../productService'
import type { Sale, SaleItem, Product, DetailedSaleItem, SaleWithSaleItems } from '../../types'

// Mock the supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
        in: vi.fn(() => ({
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      eq: vi.fn(() => ({
        data: [],
        error: null,
      })),
      in: vi.fn(() => ({
        data: [],
        error: null,
      })),
    })),
  },
}))

// Mock the product service
vi.mock('../productService', () => ({
  productService: {
    decrementProductStock: vi.fn(),
  },
}))

describe('Sale Service', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  }

  const mockProduct: Product = {
    id: 'product123',
    user_id: 'user123',
    name: 'Test Product',
    description: 'Test Description',
    price: 10.99,
    cost: 5.99,
    stock_quantity: 100,
    category_id: 'cat1',
    category_name: 'Test Category',
  }

  const mockSale: Sale = {
    id: 'sale123',
    user_id: 'user123',
    event_id: 'event123',
    timestamp: '2024-01-01T10:00:00Z',
    total_amount: 21.98,
    comment: 'Test sale',
  }

  const mockSaleItem: SaleItem = {
    id: 'item123',
    sale_id: 'sale123',
    product_id: 'product123',
    quantity: 2,
    price_at_sale: 10.99,
  }

  const mockDetailedSaleItem: DetailedSaleItem = {
    ...mockSaleItem,
    product_name: 'Test Product',
    product_image_url: 'https://example.com/image.jpg',
    product_cost: 5.99,
  }

  const mockSaleWithItems: SaleWithSaleItems = {
    ...mockSale,
    items: [mockDetailedSaleItem],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  describe('addSale', () => {
    it('should add sale successfully', async () => {
      const newSale = {
        event_id: 'event123',
        total_amount: 21.98,
        comment: 'Test sale',
      }

      const newItems = [
        {
          product_id: 'product123',
          quantity: 2,
          price_at_sale: 10.99,
        },
      ]

      const mockInsertSale = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [mockSale],
          error: null,
        }),
      })

      const mockInsertItems = vi.fn().mockResolvedValue({
        error: null,
      })

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          insert: mockInsertSale,
        } as any)
        .mockReturnValueOnce({
          insert: mockInsertItems,
        } as any)

      // Mock the fetchSaleDetails method
      vi.spyOn(saleService, 'fetchSaleDetails').mockResolvedValue({
        sale: mockSale,
        items: [mockDetailedSaleItem],
      })

      const result = await saleService.addSale(newSale, newItems)

      expect(supabase.from).toHaveBeenCalledWith('sales')
      expect(mockInsertSale).toHaveBeenCalledWith([
        {
          user_id: 'user123',
          event_id: newSale.event_id,
          timestamp: expect.any(String),
          total_amount: newSale.total_amount,
          comment: newSale.comment,
        },
      ])

      expect(supabase.from).toHaveBeenCalledWith('sale_items')
      expect(mockInsertItems).toHaveBeenCalledWith([
        {
          ...newItems[0],
          sale_id: mockSale.id,
        },
      ])

      expect(productService.decrementProductStock).toHaveBeenCalledWith(
        'product123',
        2
      )

      expect(result).toEqual(mockSaleWithItems)
    })

    it('should throw error when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null as any },
        error: null,
      })

      const newSale = {
        event_id: 'event123',
        total_amount: 21.98,
        comment: 'Test sale',
      }

      const newItems = [
        {
          product_id: 'product123',
          quantity: 2,
          price_at_sale: 10.99,
        },
      ]

      await expect(saleService.addSale(newSale, newItems)).rejects.toThrow(
        'User not authenticated for sale recording.'
      )
    })

    it('should throw error when sale insert fails', async () => {
      const newSale = {
        event_id: 'event123',
        total_amount: 21.98,
        comment: 'Test sale',
      }

      const newItems = [
        {
          product_id: 'product123',
          quantity: 2,
          price_at_sale: 10.99,
        },
      ]

      const mockInsertSale = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Sale insert failed' },
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsertSale,
      } as any)

      await expect(saleService.addSale(newSale, newItems)).rejects.toThrow('Sale insert failed')
    })

    it('should throw error when items insert fails', async () => {
      const newSale = {
        event_id: 'event123',
        total_amount: 21.98,
        comment: 'Test sale',
      }

      const newItems = [
        {
          product_id: 'product123',
          quantity: 2,
          price_at_sale: 10.99,
        },
      ]

      const mockInsertSale = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [mockSale],
          error: null,
        }),
      })

      const mockInsertItems = vi.fn().mockResolvedValue({
        error: { message: 'Items insert failed' },
      })

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          insert: mockInsertSale,
        } as any)
        .mockReturnValueOnce({
          insert: mockInsertItems,
        } as any)

      await expect(saleService.addSale(newSale, newItems)).rejects.toThrow('Items insert failed')
    })
  })

  describe('fetchSales', () => {
    it('should fetch sales successfully', async () => {
      const mockSalesData = [
        {
          ...mockSale,
          items: [mockSaleItem],
        },
      ]

      const mockProductsData = [mockProduct]

      const mockSelectSales = vi.fn().mockReturnValue({
        data: mockSalesData,
        error: null,
      })

      const mockSelectProducts = vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({
          data: mockProductsData,
          error: null,
        }),
      })

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelectSales,
        } as any)
        .mockReturnValueOnce({
          select: mockSelectProducts,
        } as any)

      const result = await saleService.fetchSales()

      expect(supabase.from).toHaveBeenCalledWith('sales')
      expect(mockSelectSales).toHaveBeenCalledWith('*, items:sale_items(*)')

      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockSelectProducts).toHaveBeenCalledWith('id, name, image_url, cost')

      expect(result).toEqual([
        {
          ...mockSale,
          items: [
            {
              ...mockDetailedSaleItem,
              product_image_url: 'https://via.placeholder.com/50?text=N/A',
            },
          ],
        },
      ])
    })

    it('should handle sales without items', async () => {
      const mockSalesData = [
        {
          ...mockSale,
          items: [],
        },
      ]

      const mockSelectSales = vi.fn().mockReturnValue({
        data: mockSalesData,
        error: null,
      })

      const mockSelectProducts = vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      })

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelectSales,
        } as any)
        .mockReturnValueOnce({
          select: mockSelectProducts,
        } as any)

      const result = await saleService.fetchSales()

      expect(result).toEqual([
        {
          ...mockSale,
          items: [],
        },
      ])
    })

    it('should throw error when sales fetch fails', async () => {
      const mockSelectSales = vi.fn().mockReturnValue({
        data: null,
        error: { message: 'Sales fetch failed' },
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelectSales,
      } as any)

      await expect(saleService.fetchSales()).rejects.toThrow('Sales fetch failed')
    })

    it('should throw error when products fetch fails', async () => {
      const mockSalesData = [
        {
          ...mockSale,
          items: [mockSaleItem],
        },
      ]

      const mockSelectSales = vi.fn().mockReturnValue({
        data: mockSalesData,
        error: null,
      })

      const mockSelectProducts = vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Products fetch failed' },
        }),
      })

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelectSales,
        } as any)
        .mockReturnValueOnce({
          select: mockSelectProducts,
        } as any)

      await expect(saleService.fetchSales()).rejects.toThrow('Products fetch failed')
    })
  })

  describe('fetchSaleItems', () => {
    it('should fetch sale items successfully', async () => {
      const mockItemsData = [mockSaleItem]

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: mockItemsData,
          error: null,
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await saleService.fetchSaleItems('sale123')

      expect(supabase.from).toHaveBeenCalledWith('sale_items')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toEqual(mockItemsData)
    })

    it('should throw error when fetch fails', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Fetch failed' },
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      await expect(saleService.fetchSaleItems('sale123')).rejects.toThrow('Fetch failed')
    })
  })

  describe('fetchSaleDetails', () => {
    it('should fetch sale details successfully', async () => {
      const mockSaleData = mockSale
      const mockItemsData = [mockSaleItem]

      // Clear all mocks first
      vi.clearAllMocks()

      // Mock the global supabase.from to return our custom mock
      const mockFrom = vi.fn()
      vi.mocked(supabase.from).mockImplementation(mockFrom)

      // Set up the mock chain for the three calls
      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockSaleData,
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockItemsData,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [mockProduct],
              error: null,
            }),
          }),
        })

      const result = await saleService.fetchSaleDetails('sale123')

      // Test the result structure and data
      expect(result).toHaveProperty('sale')
      expect(result).toHaveProperty('items')
      expect(result.sale).toEqual(mockSale)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toHaveProperty('product_image_url')
    })
  })
})
