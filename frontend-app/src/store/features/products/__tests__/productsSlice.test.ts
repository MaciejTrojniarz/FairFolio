import { describe, it, expect } from 'vitest'
import productsReducer, {
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
import type { Product } from '../../../../types'

describe('Products Slice', () => {
  const initialState = {
    products: [],
    loading: false,
    error: null,
  }

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

  const mockProduct2: Product = {
    id: '2',
    user_id: 'user1',
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 20.99,
    cost: 10.99,
    stock_quantity: 50,
    category_id: 'cat2',
    category_name: 'Test Category 2',
  }

  describe('Initial State', () => {
    it('should return initial state', () => {
      const state = productsReducer(undefined, { type: 'unknown' })
      expect(state).toEqual(initialState)
    })
  })

  describe('Commands', () => {
    it('should handle fetchProductsCommand', () => {
      const state = productsReducer(initialState, fetchProductsCommand())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle addProductCommand', () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 15.99,
        cost: 8.99,
        stock_quantity: 75,
        category_id: 'cat3',
      }

      const state = productsReducer(initialState, addProductCommand(newProduct))
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle updateProductCommand', () => {
      const stateWithProduct = {
        ...initialState,
        products: [mockProduct],
      }

      const updatedProduct = { ...mockProduct, name: 'Updated Product' }
      const state = productsReducer(stateWithProduct, updateProductCommand(updatedProduct))
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle deleteProductCommand', () => {
      const stateWithProduct = {
        ...initialState,
        products: [mockProduct],
      }

      const state = productsReducer(stateWithProduct, deleteProductCommand('1'))
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })
  })

  describe('Events', () => {
    it('should handle productsFetchedEvent', () => {
      const loadingState = { ...initialState, loading: true }
      const products = [mockProduct, mockProduct2]

      const state = productsReducer(loadingState, productsFetchedEvent(products))
      expect(state.products).toEqual(products)
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle productAddedEvent', () => {
      const loadingState = { ...initialState, loading: true, products: [mockProduct] }

      const state = productsReducer(loadingState, productAddedEvent(mockProduct2))
      expect(state.products).toEqual([mockProduct, mockProduct2])
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle productUpdatedEvent', () => {
      const loadingState = {
        ...initialState,
        loading: true,
        products: [mockProduct, mockProduct2],
      }

      const updatedProduct = { ...mockProduct, name: 'Updated Product' }
      const state = productsReducer(loadingState, productUpdatedEvent(updatedProduct))
      expect(state.products).toEqual([updatedProduct, mockProduct2])
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle productUpdatedEvent with non-existent product', () => {
      const loadingState = {
        ...initialState,
        loading: true,
        products: [mockProduct],
      }

      const nonExistentProduct = { ...mockProduct, id: '999', name: 'Non-existent' }
      const state = productsReducer(loadingState, productUpdatedEvent(nonExistentProduct))
      expect(state.products).toEqual([mockProduct]) // Should remain unchanged
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle productDeletedEvent', () => {
      const loadingState = {
        ...initialState,
        loading: true,
        products: [mockProduct, mockProduct2],
      }

      const state = productsReducer(loadingState, productDeletedEvent('1'))
      expect(state.products).toEqual([mockProduct2])
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle productDeletedEvent with non-existent product', () => {
      const loadingState = {
        ...initialState,
        loading: true,
        products: [mockProduct],
      }

      const state = productsReducer(loadingState, productDeletedEvent('999'))
      expect(state.products).toEqual([mockProduct]) // Should remain unchanged
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle productsErrorEvent', () => {
      const loadingState = { ...initialState, loading: true }
      const errorMessage = 'Failed to fetch products'

      const state = productsReducer(loadingState, productsErrorEvent(errorMessage))
      expect(state.error).toBe(errorMessage)
      expect(state.loading).toBe(false)
    })
  })

  describe('State Transitions', () => {
    it('should handle complete product lifecycle', () => {
      let state = productsReducer(initialState, fetchProductsCommand())
      expect(state.loading).toBe(true)

      state = productsReducer(state, productsFetchedEvent([mockProduct]))
      expect(state.products).toEqual([mockProduct])
      expect(state.loading).toBe(false)

      state = productsReducer(state, addProductCommand({
        name: 'New Product',
        price: 15.99,
        cost: 8.99,
      }))
      expect(state.loading).toBe(true)

      state = productsReducer(state, productAddedEvent(mockProduct2))
      expect(state.products).toEqual([mockProduct, mockProduct2])
      expect(state.loading).toBe(false)

      state = productsReducer(state, updateProductCommand({
        ...mockProduct,
        name: 'Updated Product',
      }))
      expect(state.loading).toBe(true)

      state = productsReducer(state, productUpdatedEvent({
        ...mockProduct,
        name: 'Updated Product',
      }))
      expect(state.products[0].name).toBe('Updated Product')
      expect(state.loading).toBe(false)

      state = productsReducer(state, deleteProductCommand('1'))
      expect(state.loading).toBe(true)

      state = productsReducer(state, productDeletedEvent('1'))
      expect(state.products).toEqual([mockProduct2])
      expect(state.loading).toBe(false)
    })

    it('should handle error state and recovery', () => {
      let state = productsReducer(initialState, fetchProductsCommand())
      expect(state.loading).toBe(true)

      state = productsReducer(state, productsErrorEvent('Network error'))
      expect(state.error).toBe('Network error')
      expect(state.loading).toBe(false)

      // Should clear error on new command
      state = productsReducer(state, fetchProductsCommand())
      expect(state.error).toBe(null)
      expect(state.loading).toBe(true)

      state = productsReducer(state, productsFetchedEvent([mockProduct]))
      expect(state.error).toBe(null)
      expect(state.loading).toBe(false)
    })
  })
})
