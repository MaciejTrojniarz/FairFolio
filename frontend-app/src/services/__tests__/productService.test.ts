import { describe, it, expect, vi, beforeEach } from 'vitest'
import { productService } from '../productService'
import { supabase } from '../../supabaseClient'
import type { Product } from '../../types'

// Mock the supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}))

describe('Product Service', () => {
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

  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset all mocks to their initial state
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  describe('uploadProductImage', () => {
    it('should upload image successfully', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ error: null })
      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/image.jpg' },
      })

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      } as any)

      const result = await productService.uploadProductImage(mockFile, 'product123')

      expect(supabase.storage.from).toHaveBeenCalledWith('product-images')
      expect(mockUpload).toHaveBeenCalledWith(
        'user123/product123.jpg',
        mockFile,
        {
          cacheControl: '3600',
          upsert: true,
        }
      )
      expect(mockGetPublicUrl).toHaveBeenCalledWith('user123/product123.jpg')
      expect(result).toBe('https://example.com/image.jpg')
    })

    it('should throw error when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null as any },
        error: null,
      })

      await expect(
        productService.uploadProductImage(mockFile, 'product123')
      ).rejects.toThrow('User not authenticated for image upload.')
    })

    it('should throw error when upload fails', async () => {
      const mockUpload = vi.fn().mockResolvedValue({
        error: { message: 'Upload failed' },
      })

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: mockUpload,
      } as any)

      await expect(
        productService.uploadProductImage(mockFile, 'product123')
      ).rejects.toThrow('Upload failed')
    })

    it('should throw error when getting public URL fails', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ error: null })
      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: null,
      })

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      } as any)

      await expect(
        productService.uploadProductImage(mockFile, 'product123')
      ).rejects.toThrow('Could not get public URL for image.')
    })
  })

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      const mockData = [
        {
          ...mockProduct,
          category: { name: 'Test Category' },
        },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        data: mockData,
        error: null,
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await productService.fetchProducts()

      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        category:categories(name)
      `)
      expect(result).toEqual([
        {
          ...mockProduct,
          category: { name: 'Test Category' },
          category_name: 'Test Category',
        },
      ])
    })

    it('should handle products without category', async () => {
      const mockData = [
        {
          ...mockProduct,
          category: null,
        },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        data: mockData,
        error: null,
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await productService.fetchProducts()

      expect(result[0].category_name).toBe('Unknown Category')
    })

    it('should throw error when fetch fails', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        data: null,
        error: { message: 'Fetch failed' },
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      await expect(productService.fetchProducts()).rejects.toThrow('Fetch failed')
    })
  })

  describe('addProduct', () => {
    it('should add product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 15.99,
        cost: 8.99,
        stock_quantity: 75,
        category_id: 'cat1',
      }

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ ...newProduct, id: 'new123', user_id: 'user123' }],
          error: null,
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any)

      const result = await productService.addProduct(newProduct)

      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockInsert).toHaveBeenCalledWith([
        {
          user_id: 'user123',
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          cost: newProduct.cost,
          image_url: undefined,
          notes: undefined,
          link: undefined,
          stock_quantity: newProduct.stock_quantity,
          category_id: newProduct.category_id,
        },
      ])
      expect(result).toEqual({
        ...newProduct,
        id: 'new123',
        user_id: 'user123',
      })
    })

    it('should throw error when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null as any },
        error: null,
      })

      const newProduct = {
        name: 'New Product',
        price: 15.99,
        cost: 8.99,
      }

      await expect(productService.addProduct(newProduct)).rejects.toThrow(
        'User not authenticated.'
      )
    })

    it('should throw error when insert fails', async () => {
      const newProduct = {
        name: 'New Product',
        price: 15.99,
        cost: 8.99,
      }

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Insert failed' },
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any)

      await expect(productService.addProduct(newProduct)).rejects.toThrow('Insert failed')
    })
  })

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Product' }

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: [updatedProduct],
            error: null,
          }),
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as any)

      const result = await productService.updateProduct(updatedProduct)

      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockUpdate).toHaveBeenCalledWith({
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        cost: updatedProduct.cost,
        image_url: updatedProduct.image_url,
        notes: updatedProduct.notes,
        link: updatedProduct.link,
        stock_quantity: updatedProduct.stock_quantity,
        category_id: updatedProduct.category_id,
      })
      expect(result).toEqual(updatedProduct)
    })

    it('should throw error when update fails', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Product' }

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Update failed' },
          }),
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as any)

      await expect(productService.updateProduct(updatedProduct)).rejects.toThrow('Update failed')
    })
  })

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any)

      await productService.deleteProduct('product123')

      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockDelete).toHaveBeenCalled()
    })

    it('should throw error when delete fails', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: { message: 'Delete failed' },
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any)

      await expect(productService.deleteProduct('product123')).rejects.toThrow('Delete failed')
    })
  })
})
