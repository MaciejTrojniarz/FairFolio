# Testing Guide - FairMerchant

This document provides comprehensive information about the testing setup and practices for the FairMerchant application.

## Overview

The FairMerchant application uses **Vitest** as the primary testing framework with **React Testing Library** for component testing. The testing strategy follows the test plan outlined in the project documentation, focusing on unit tests, integration tests, and ensuring high code coverage.

## Testing Stack

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for browser-like testing
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom matchers for DOM testing

## Project Structure

```
src/
├── test/
│   ├── setup.ts              # Global test setup and mocks
│   └── test-utils.tsx        # Custom render function with providers
├── components/
│   └── **/__tests__/         # Component tests
├── services/
│   └── __tests__/            # Service tests
├── store/
│   └── features/**/__tests__/ # Redux slice and epic tests
└── utils/
    └── __tests__/            # Utility function tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Open test UI
npm run test:ui
```

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- -t "ProductForm"

# Run tests in a specific file
npm test -- ProductForm.test.tsx

# Run tests in a specific directory
npm test -- src/components/products/
```

## Test Categories

### 1. Unit Tests

**Location**: `src/utils/__tests__/`, `src/services/__tests__/`

**Purpose**: Test individual functions and services in isolation

**Examples**:
- CSV utility functions (`csv.test.ts`)
- Image helper functions (`imageHelpers.test.ts`)
- Service functions (`productService.test.ts`, `saleService.test.ts`)

### 2. Redux Tests

**Location**: `src/store/features/**/__tests__/`

**Purpose**: Test Redux slices and epics

**Examples**:
- Slice reducers (`productsSlice.test.ts`)
- Epics (`productsEpics.test.ts`)

### 3. Component Tests

**Location**: `src/components/**/__tests__/`

**Purpose**: Test React components in isolation

**Examples**:
- Form components (`ProductForm.test.tsx`)
- UI components (`GravatarAvatar.test.tsx`)

## Testing Patterns

### 1. Arrange-Act-Assert Pattern

All tests follow the AAA pattern:

```typescript
describe('MyComponent', () => {
  it('should do something', () => {
    // Arrange
    const mockData = { name: 'Test' }
    
    // Act
    render(<MyComponent data={mockData} />)
    
    // Assert
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### 2. Mocking Strategy

- **External Dependencies**: Mock Supabase client, external APIs
- **Redux Store**: Use custom test store with preloaded state
- **React Router**: Mock navigation hooks
- **File System**: Mock file uploads and downloads

### 3. Test Utilities

Use the custom `render` function from `test-utils.tsx` for components that need providers:

```typescript
import { render, screen } from '../test/test-utils'

render(<MyComponent />, {
  preloadedState: { products: { items: [] } }
})
```

## Mocking Guidelines

### Supabase Client

```typescript
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
    storage: { from: vi.fn() }
  }
}))
```

### Services

```typescript
vi.mock('../productService', () => ({
  productService: {
    fetchProducts: vi.fn(),
    addProduct: vi.fn()
  }
}))
```

### React Router

```typescript
vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useParams: () => ({})
}))
```

## Coverage Requirements

- **Minimum Coverage**: 80% for all metrics (branches, functions, lines, statements)
- **Critical Paths**: 100% coverage for business logic
- **Edge Cases**: Test error conditions and boundary values

## Best Practices

### 1. Test Naming

Use descriptive test names that explain the behavior:

```typescript
// Good
it('should display error message when form submission fails')

// Bad
it('should handle error')
```

### 2. Test Organization

Group related tests using `describe` blocks:

```typescript
describe('ProductForm', () => {
  describe('Rendering', () => {
    // rendering tests
  })
  
  describe('Form Submission', () => {
    // submission tests
  })
  
  describe('Validation', () => {
    // validation tests
  })
})
```

### 3. Async Testing

Use `waitFor` for asynchronous operations:

```typescript
await waitFor(() => {
  expect(mockOnClose).toHaveBeenCalled()
})
```

### 4. User Interactions

Use `userEvent` for realistic user interactions:

```typescript
const user = userEvent.setup()
await user.type(input, 'test value')
await user.click(button)
```

## Common Test Scenarios

### 1. Form Testing

```typescript
it('should submit form with valid data', async () => {
  const user = userEvent.setup()
  
  // Fill form
  await user.type(screen.getByLabelText('Name'), 'Test Product')
  await user.type(screen.getByLabelText('Price'), '10.99')
  
  // Submit
  await user.click(screen.getByText('Save'))
  
  // Verify
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Product',
      price: 10.99
    })
  })
})
```

### 2. Error Handling

```typescript
it('should display error message on API failure', async () => {
  vi.mocked(apiService.fetchData).mockRejectedValue(new Error('API Error'))
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('API Error')).toBeInTheDocument()
  })
})
```

### 3. Redux Integration

```typescript
it('should dispatch action on user interaction', async () => {
  const { store } = render(<MyComponent />)
  
  await user.click(screen.getByText('Add Item'))
  
  expect(store.getState().items).toHaveLength(1)
})
```

## Debugging Tests

### 1. Test UI

Use the test UI for visual debugging:

```bash
npm run test:ui
```

### 2. Debug Mode

Run tests in debug mode:

```bash
npm test -- --debug
```

### 3. Console Logging

Add console logs in tests (they won't appear in production):

```typescript
it('should work', () => {
  console.log('Debug info')
  // test code
})
```

## Continuous Integration

Tests are automatically run in CI/CD pipeline:

- **Pre-commit**: Run tests on staged files
- **Pull Request**: Full test suite with coverage
- **Deploy**: Smoke tests on production build

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure mocks are defined before imports
2. **Async test failures**: Use `waitFor` for async operations
3. **Provider errors**: Use custom `render` function with providers
4. **Coverage gaps**: Check excluded files in vitest config

### Performance

- Use `vi.clearAllMocks()` in `beforeEach` for clean state
- Mock heavy operations (API calls, file operations)
- Use `vi.fn()` for simple mocks, `vi.spyOn()` for existing functions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
