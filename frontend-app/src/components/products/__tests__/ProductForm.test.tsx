import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import ProductForm from '../ProductForm'
import type { Product } from '../../../types'

// Mock the product service
vi.mock('../../../services/productService', () => ({
  productService: {
    uploadProductImage: vi.fn(),
  },
}))

// Mock the i18n context
vi.mock('../../../contexts/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid'),
  },
})

describe('ProductForm', () => {
  const mockOnClose = vi.fn()
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

  describe('Rendering', () => {
    it('should render add product form when no product is provided', () => {
      render(<ProductForm onClose={mockOnClose} />)
      
      expect(screen.getByText('add_new_product_title')).toBeInTheDocument()
      expect(screen.getByText('product_name_label')).toBeInTheDocument()
    })

    it('should render edit product form when product is provided', () => {
      render(<ProductForm product={mockProduct} onClose={mockOnClose} />)
      
      expect(screen.getByText('edit_product_title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10.99')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5.99')).toBeInTheDocument()
      expect(screen.getByDisplayValue('100')).toBeInTheDocument()
    })

    it('should render all form field labels', () => {
      render(<ProductForm onClose={mockOnClose} />)
      
      // Check that form field labels are present
      expect(screen.getByText('product_name_label')).toBeInTheDocument()
      expect(screen.getAllByText('description_label')).toHaveLength(2) // Label and legend
      expect(screen.getAllByText('notes_label')).toHaveLength(2) // Label and legend
      expect(screen.getAllByText('link_label')).toHaveLength(2) // Label and legend
      expect(screen.getByText('price_label')).toBeInTheDocument()
      expect(screen.getByText('cost_label')).toBeInTheDocument()
      expect(screen.getByText('stock_quantity_label')).toBeInTheDocument()
    })
  })

  describe('Form Structure', () => {
    it('should have required fields marked with asterisk', () => {
      render(<ProductForm onClose={mockOnClose} />)
      
      // Check for required field indicators
      const nameLabel = screen.getByText('product_name_label')
      expect(nameLabel).toBeInTheDocument()
      // The asterisk should be present in the label
      expect(nameLabel.parentElement).toHaveTextContent('*')
    })

    it('should have proper input types', () => {
      render(<ProductForm onClose={mockOnClose} />)
      
      // Check for number inputs
      const priceInputs = screen.getAllByRole('spinbutton')
      expect(priceInputs.length).toBeGreaterThan(0)
    })
  })

  describe('Form Reset', () => {
    it('should reset form when product prop changes', () => {
      const { rerender } = render(<ProductForm product={mockProduct} onClose={mockOnClose} />)
      
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
      
      rerender(<ProductForm onClose={mockOnClose} />)
      
      // Should show empty form
      expect(screen.getByText('add_new_product_title')).toBeInTheDocument()
    })
  })
})
