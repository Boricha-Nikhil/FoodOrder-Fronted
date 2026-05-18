import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from '../src/context/CartContext'
import Menu from '../src/pages/Menu'

vi.mock('../src/services/api', () => ({
  getMenuItems: vi.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            _id: '1',
            name: 'Test Pizza',
            description: 'Tasty',
            price: 12.99,
            image: 'http://img.com/p.jpg',
            category: 'pizza',
          },
          {
            _id: '2',
            name: 'Test Burger',
            description: 'Juicy',
            price: 9.99,
            image: 'http://img.com/b.jpg',
            category: 'burger',
          },
        ],
      },
    })
  ),
}))

vi.mock('../src/context/SocketContext', () => ({
  SocketProvider: ({ children }) => children,
  useSocket: () => ({ orderStatus: null, joinOrder: vi.fn() }),
}))

const renderMenu = () =>
  render(
    <BrowserRouter>
      <CartProvider>
        <Menu />
      </CartProvider>
    </BrowserRouter>
  )

describe('Menu Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders menu items after loading', async () => {
    renderMenu()
    expect(await screen.findByText('Test Pizza')).toBeInTheDocument()
    expect(screen.getByText('Test Burger')).toBeInTheDocument()
  })

  it('displays prices correctly', async () => {
    renderMenu()
    expect(await screen.findByText('$12.99')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
  })

  it('shows Add to Cart buttons for each item', async () => {
    renderMenu()
    await screen.findByText('Test Pizza')
    const buttons = screen.getAllByText('Add to Cart')
    expect(buttons).toHaveLength(2)
  })
})
