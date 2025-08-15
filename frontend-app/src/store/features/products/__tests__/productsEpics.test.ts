import { describe, it, expect, vi, beforeEach } from 'vitest'
import { of } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'
import { fetchProductsEpic, addProductEpic, updateProductEpic, deleteProductEpic } from '../productsEpics'
import {
  fetchProductsCommand,
  addProductCommand,
  updateProductCommand,
  deleteProductCommand,
  productsFetchedEvent,
  productAddedEvent,
  productUpdatedEvent,
  productDeletedEvent,
  productsErrorEvent,
} from '../productsSlice'
import { productService } from '../../../../services/productService'
import type { Product } from '../../../../types'

// Mock the product service
vi.mock('../../../../services/productService', () => ({
  productService: {
    fetchProducts: vi.fn(),
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}))

describe('Products Epics', () => {
  const mockProduct: Product = {
    id: '1',
    user_id: 'user1',
    name: 'Test Product',
    description: 'Test Description',
    price: 10.99,
    cost: 5.99,
    stock_quantity: 100,
    category_id: 'cat1',
    category_name: 'Test Category',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchProductsEpic', () => {
    it('should handle successful fetch products', async () => {
      const mockProducts = [mockProduct]
      vi.mocked(productService.fetchProducts).mockResolvedValue(mockProducts)

      const action$ = of(fetchProductsCommand())
      const epic$ = fetchProductsEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productsFetchedEvent(mockProducts))
      expect(productService.fetchProducts).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch products error', async () => {
      const errorMessage = 'Failed to fetch products'
      vi.mocked(productService.fetchProducts).mockRejectedValue(new Error(errorMessage))

      const action$ = of(fetchProductsCommand())
      const epic$ = fetchProductsEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productsErrorEvent(errorMessage))
      expect(productService.fetchProducts).toHaveBeenCalledTimes(1)
    })
  })

  describe('addProductEpic', () => {
    it('should handle successful add product', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 15.99,
        cost: 8.99,
        stock_quantity: 75,
        category_id: 'cat1',
      }

      const addedProduct = { ...newProduct, id: '2', user_id: 'user1' }
      vi.mocked(productService.addProduct).mockResolvedValue(addedProduct)

      const action$ = of(addProductCommand(newProduct))
      const epic$ = addProductEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productAddedEvent(addedProduct))
      expect(productService.addProduct).toHaveBeenCalledWith(newProduct)
    })

    it('should handle add product error', async () => {
      const newProduct = {
        name: 'New Product',
        price: 15.99,
        cost: 8.99,
      }

      const errorMessage = 'Failed to add product'
      vi.mocked(productService.addProduct).mockRejectedValue(new Error(errorMessage))

      const action$ = of(addProductCommand(newProduct))
      const epic$ = addProductEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productsErrorEvent(errorMessage))
      expect(productService.addProduct).toHaveBeenCalledWith(newProduct)
    })
  })

  describe('updateProductEpic', () => {
    it('should handle successful update product', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Product' }
      vi.mocked(productService.updateProduct).mockResolvedValue(updatedProduct)

      const action$ = of(updateProductCommand(updatedProduct))
      const epic$ = updateProductEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productUpdatedEvent(updatedProduct))
      expect(productService.updateProduct).toHaveBeenCalledWith(updatedProduct)
    })

    it('should handle update product error', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Product' }
      const errorMessage = 'Failed to update product'
      vi.mocked(productService.updateProduct).mockRejectedValue(new Error(errorMessage))

      const action$ = of(updateProductCommand(updatedProduct))
      const epic$ = updateProductEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productsErrorEvent(errorMessage))
      expect(productService.updateProduct).toHaveBeenCalledWith(updatedProduct)
    })
  })

  describe('deleteProductEpic', () => {
    it('should handle successful delete product', async () => {
      const productId = '1'
      vi.mocked(productService.deleteProduct).mockResolvedValue(undefined)

      const action$ = of(deleteProductCommand(productId))
      const epic$ = deleteProductEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productDeletedEvent(productId))
      expect(productService.deleteProduct).toHaveBeenCalledWith(productId)
    })

    it('should handle delete product error', async () => {
      const productId = '1'
      const errorMessage = 'Failed to delete product'
      vi.mocked(productService.deleteProduct).mockRejectedValue(new Error(errorMessage))

      const action$ = of(deleteProductCommand(productId))
      const epic$ = deleteProductEpic(action$)

      const result = await epic$.toPromise()
      expect(result).toEqual(productsErrorEvent(errorMessage))
      expect(productService.deleteProduct).toHaveBeenCalledWith(productId)
    })
  })

  describe('Epic Integration', () => {
    it('should handle multiple actions in sequence', async () => {
      // Mock successful responses
      vi.mocked(productService.fetchProducts).mockResolvedValue([mockProduct])
      vi.mocked(productService.addProduct).mockResolvedValue(mockProduct)
      vi.mocked(productService.updateProduct).mockResolvedValue(mockProduct)
      vi.mocked(productService.deleteProduct).mockResolvedValue(undefined)

      // Test fetch
      const fetchAction$ = of(fetchProductsCommand())
      const fetchResult = await fetchProductsEpic(fetchAction$).toPromise()
      expect(fetchResult).toEqual(productsFetchedEvent([mockProduct]))

      // Test add
      const newProduct = { name: 'New Product', price: 15.99, cost: 8.99 }
      const addAction$ = of(addProductCommand(newProduct))
      const addResult = await addProductEpic(addAction$).toPromise()
      expect(addResult).toEqual(productAddedEvent(mockProduct))

      // Test update
      const updatedProduct = { ...mockProduct, name: 'Updated Product' }
      const updateAction$ = of(updateProductCommand(updatedProduct))
      const updateResult = await updateProductEpic(updateAction$).toPromise()
      expect(updateResult).toEqual(productUpdatedEvent(mockProduct))

      // Test delete
      const deleteAction$ = of(deleteProductCommand('1'))
      const deleteResult = await deleteProductEpic(deleteAction$).toPromise()
      expect(deleteResult).toEqual(productDeletedEvent('1'))
    })

    it('should handle mixed success and error scenarios', async () => {
      // Mock mixed responses
      vi.mocked(productService.fetchProducts).mockResolvedValue([mockProduct])
      vi.mocked(productService.addProduct).mockRejectedValue(new Error('Add failed'))
      vi.mocked(productService.updateProduct).mockResolvedValue(mockProduct)
      vi.mocked(productService.deleteProduct).mockRejectedValue(new Error('Delete failed'))

      // Test successful fetch
      const fetchAction$ = of(fetchProductsCommand())
      const fetchResult = await fetchProductsEpic(fetchAction$).toPromise()
      expect(fetchResult).toEqual(productsFetchedEvent([mockProduct]))

      // Test failed add
      const newProduct = { name: 'New Product', price: 15.99, cost: 8.99 }
      const addAction$ = of(addProductCommand(newProduct))
      const addResult = await addProductEpic(addAction$).toPromise()
      expect(addResult).toEqual(productsErrorEvent('Add failed'))

      // Test successful update
      const updatedProduct = { ...mockProduct, name: 'Updated Product' }
      const updateAction$ = of(updateProductCommand(updatedProduct))
      const updateResult = await updateProductEpic(updateAction$).toPromise()
      expect(updateResult).toEqual(productUpdatedEvent(mockProduct))

      // Test failed delete
      const deleteAction$ = of(deleteProductCommand('1'))
      const deleteResult = await deleteProductEpic(deleteAction$).toPromise()
      expect(deleteResult).toEqual(productsErrorEvent('Delete failed'))
    })
  })
})
