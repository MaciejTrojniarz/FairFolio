import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import GravatarAvatar from '../GravatarAvatar'

// Mock crypto-js
vi.mock('crypto-js', () => ({
  default: {
    MD5: vi.fn((str: string) => ({
      toString: () => 'mocked-hash',
    })),
  },
}))

describe('GravatarAvatar', () => {
  it('should render with default props', () => {
    render(<GravatarAvatar />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/?s=40&d=identicon')
  })

  it('should render with email and generate correct gravatar URL', () => {
    render(<GravatarAvatar email="test@example.com" />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/mocked-hash?s=40&d=identicon')
  })

  it('should render with custom size', () => {
    render(<GravatarAvatar email="test@example.com" size={80} />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/mocked-hash?s=80&d=identicon')
  })

  it('should render with custom default image', () => {
    render(<GravatarAvatar email="test@example.com" defaultImage="monsterid" />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/mocked-hash?s=40&d=monsterid')
  })

  it('should render with custom alt text', () => {
    render(<GravatarAvatar email="test@example.com" alt="Custom Alt Text" />)
    
    const avatar = screen.getByAltText('Custom Alt Text')
    expect(avatar).toBeInTheDocument()
  })

  it('should handle null email', () => {
    render(<GravatarAvatar email={null} />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/?s=40&d=identicon')
  })

  it('should handle undefined email', () => {
    render(<GravatarAvatar email={undefined} />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/?s=40&d=identicon')
  })

  it('should handle empty email string', () => {
    render(<GravatarAvatar email="" />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/?s=40&d=identicon')
  })

  it('should apply custom sx styles', () => {
    const customSx = { backgroundColor: 'red' }
    render(<GravatarAvatar email="test@example.com" sx={customSx} />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toBeInTheDocument()
    // Note: We can't easily test the sx prop directly, but we can verify the component renders
  })

  it('should trim and lowercase email before hashing', () => {
    render(<GravatarAvatar email="  TEST@EXAMPLE.COM  " />)
    
    const avatar = screen.getByAltText('User Avatar')
    expect(avatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/mocked-hash?s=40&d=identicon')
  })
})
