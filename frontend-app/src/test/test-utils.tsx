import React from 'react'
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import productsReducer from '../store/features/products/productsSlice'
import salesReducer from '../store/features/sales/salesSlice'
import eventsReducer from '../store/features/events/eventsSlice'
import authReducer from '../store/features/auth/authSlice'
import categoriesReducer from '../store/features/categories/categoriesSlice'
import costsReducer from '../store/features/costs/costsSlice'
import uiReducer from '../store/features/ui/uiSlice'

// Create a test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      sales: salesReducer,
      events: eventsReducer,
      auth: authReducer,
      categories: categoriesReducer,
      costs: costsReducer,
      ui: uiReducer,
    },
    preloadedState,
  })
}

// Create a test theme
const testTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

// Custom render function that includes providers
const AllTheProviders = ({ children, store }: { children: React.ReactNode; store: any }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={testTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: RenderOptions & { preloadedState?: any; store?: any } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders store={store}>{children}</AllTheProviders>
  )

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render, createTestStore }
