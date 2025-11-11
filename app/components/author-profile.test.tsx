import { render, screen } from '@testing-library/react'
import { AuthorProfile } from './author-profile'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

describe('AuthorProfile', () => {
  describe('Rendering', () => {
    it('should render nothing when author prop is not provided', () => {
      const { container } = render(<AuthorProfile />)
      expect(container.firstChild).toBeNull()
    })

    it('should render nothing when author prop is empty string', () => {
      const { container } = render(<AuthorProfile author="" />)
      expect(container.firstChild).toBeNull()
    })

    it('should render author name with "Sir" suffix when only author prop is provided', () => {
      render(<AuthorProfile author="John Doe" />)
      expect(screen.getByRole('heading', { name: 'John Doe Sir' })).toBeInTheDocument()
    })

    it('should render with all props provided', () => {
      render(
        <AuthorProfile
          author="John Doe"
          authorBio="A passionate developer"
          authorImage="/author.jpg"
          authorUrl="https://example.com"
        />
      )

      expect(screen.getByRole('link', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByText('A passionate developer')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
    })

    it('should render with border and spacing classes', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('mt-12', 'pt-8', 'border-t', 'border-neutral-200', 'dark:border-neutral-800')
    })
  })

  describe('Author Image', () => {
    it('should render Image component when authorImage is provided', () => {
      render(<AuthorProfile author="John Doe" authorImage="/author.jpg" />)
      const image = screen.getByRole('img', { name: 'John Doe' })
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/author.jpg')
      expect(image).toHaveAttribute('width', '64')
      expect(image).toHaveAttribute('height', '64')
      expect(image).toHaveClass('rounded-full')
    })

    it('should not render Image component when authorImage is not provided', () => {
      render(<AuthorProfile author="John Doe" />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('should not render Image component when authorImage is empty string', () => {
      render(<AuthorProfile author="John Doe" authorImage="" />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('Avatar Fallback', () => {
    it('should render fallback avatar with first letter when no authorImage is provided', () => {
      render(<AuthorProfile author="John Doe" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('should render fallback avatar with uppercase first letter', () => {
      render(<AuthorProfile author="alice smith" />)
      expect(screen.getByText('A')).toBeInTheDocument()
    })

    it('should render fallback avatar with first character of author name', () => {
      render(<AuthorProfile author="123 User" />)
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should apply correct styling to fallback avatar container', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const fallbackAvatar = container.querySelector('.w-16.h-16.rounded-full')
      expect(fallbackAvatar).toHaveClass(
        'flex-shrink-0',
        'w-16',
        'h-16',
        'rounded-full',
        'bg-neutral-200',
        'dark:bg-neutral-800',
        'flex',
        'items-center',
        'justify-center'
      )
    })

    it('should apply correct styling to fallback avatar text', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const fallbackText = screen.getByText('J')
      expect(fallbackText).toHaveClass(
        'text-2xl',
        'font-medium',
        'text-neutral-600',
        'dark:text-neutral-400'
      )
    })

    it('should not render fallback avatar when authorImage is provided', () => {
      render(<AuthorProfile author="John Doe" authorImage="/author.jpg" />)
      expect(screen.queryByText('J')).not.toBeInTheDocument()
    })
  })

  describe('Author Bio', () => {
    it('should render bio when authorBio is provided', () => {
      render(
        <AuthorProfile author="John Doe" authorBio="A passionate developer" />
      )
      expect(screen.getByText('A passionate developer')).toBeInTheDocument()
    })

    it('should not render bio paragraph when authorBio is not provided', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const bioElement = container.querySelector('p')
      expect(bioElement).not.toBeInTheDocument()
    })

    it('should not render bio when authorBio is empty string', () => {
      const { container } = render(<AuthorProfile author="John Doe" authorBio="" />)
      const bioElement = container.querySelector('p')
      expect(bioElement).not.toBeInTheDocument()
    })

    it('should apply correct styling to bio text', () => {
      render(
        <AuthorProfile author="John Doe" authorBio="A passionate developer" />
      )
      const bioElement = screen.getByText('A passionate developer')
      expect(bioElement).toHaveClass(
        'mt-1',
        'text-sm',
        'text-neutral-600',
        'dark:text-neutral-400',
        'leading-relaxed'
      )
    })

    it('should render multi-line bio correctly', () => {
      const longBio = 'A passionate developer who loves creating amazing web applications. ' +
        'With years of experience in React and TypeScript.'
      render(<AuthorProfile author="John Doe" authorBio={longBio} />)
      expect(screen.getByText(longBio)).toBeInTheDocument()
    })
  })

  describe('Author URL and Link Behavior', () => {
    it('should render Link component when authorUrl is provided', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
    })

    it('should render heading instead of link when authorUrl is not provided', () => {
      render(<AuthorProfile author="John Doe" />)
      expect(screen.getByRole('heading', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('should render heading instead of link when authorUrl is empty string', () => {
      render(<AuthorProfile author="John Doe" authorUrl="" />)
      expect(screen.getByRole('heading', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('should set target="_blank" and rel attributes on link', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should apply correct styling to link', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toHaveClass(
        'text-lg',
        'font-medium',
        'text-neutral-900',
        'dark:text-neutral-100',
        'hover:text-neutral-600',
        'dark:hover:text-neutral-400',
        'transition-colors'
      )
    })

    it('should apply correct styling to heading when no URL', () => {
      render(<AuthorProfile author="John Doe" />)
      const heading = screen.getByRole('heading', { name: 'John Doe Sir' })
      expect(heading).toHaveClass(
        'text-lg',
        'font-medium',
        'text-neutral-900',
        'dark:text-neutral-100'
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle author name with special characters', () => {
      render(<AuthorProfile author="O'Brien-Smith" />)
      expect(screen.getByRole('heading', { name: "O'Brien-Smith Sir" })).toBeInTheDocument()
    })

    it('should handle author name with unicode characters', () => {
      render(<AuthorProfile author="José García" />)
      expect(screen.getByRole('heading', { name: 'José García Sir' })).toBeInTheDocument()
    })

    it('should handle very long author names', () => {
      const longName = 'A'.repeat(100)
      render(<AuthorProfile author={longName} />)
      expect(screen.getByRole('heading', { name: `${longName} Sir` })).toBeInTheDocument()
    })

    it('should handle very long bio text', () => {
      const longBio = 'A'.repeat(500)
      render(<AuthorProfile author="John Doe" authorBio={longBio} />)
      expect(screen.getByText(longBio)).toBeInTheDocument()
    })

    it('should handle single character author name', () => {
      render(<AuthorProfile author="X" />)
      expect(screen.getByRole('heading', { name: 'X Sir' })).toBeInTheDocument()
      expect(screen.getByText('X')).toBeInTheDocument() // fallback avatar
    })

    it('should handle bio with HTML-like content as plain text', () => {
      const bioWithHTML = '<script>alert("xss")</script>'
      render(<AuthorProfile author="John Doe" authorBio={bioWithHTML} />)
      expect(screen.getByText(bioWithHTML)).toBeInTheDocument()
    })

    it('should handle relative authorUrl', () => {
      render(<AuthorProfile author="John Doe" authorUrl="/about" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toHaveAttribute('href', '/about')
    })

    it('should handle authorUrl with query parameters', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com?ref=blog" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toHaveAttribute('href', 'https://example.com?ref=blog')
    })

    it('should handle authorImage with query parameters', () => {
      render(<AuthorProfile author="John Doe" authorImage="/author.jpg?size=large" />)
      const image = screen.getByRole('img', { name: 'John Doe' })
      expect(image).toHaveAttribute('src', '/author.jpg?size=large')
    })
  })

  describe('Props Combinations', () => {
    it('should render correctly with author and authorImage only', () => {
      render(<AuthorProfile author="John Doe" authorImage="/author.jpg" />)
      expect(screen.getByRole('heading', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.queryByText(/passionate/i)).not.toBeInTheDocument()
    })

    it('should render correctly with author and authorBio only', () => {
      render(<AuthorProfile author="John Doe" authorBio="A passionate developer" />)
      expect(screen.getByRole('heading', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByText('A passionate developer')).toBeInTheDocument()
      expect(screen.getByText('J')).toBeInTheDocument() // fallback avatar
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('should render correctly with author and authorUrl only', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      expect(screen.getByRole('link', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByText('J')).toBeInTheDocument() // fallback avatar
      expect(screen.queryByText(/passionate/i)).not.toBeInTheDocument()
    })

    it('should render correctly with author, authorBio, and authorImage', () => {
      render(
        <AuthorProfile
          author="John Doe"
          authorBio="A passionate developer"
          authorImage="/author.jpg"
        />
      )
      expect(screen.getByRole('heading', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByText('A passionate developer')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
      expect(screen.queryByText('J')).not.toBeInTheDocument() // no fallback
    })

    it('should render correctly with author, authorBio, and authorUrl', () => {
      render(
        <AuthorProfile
          author="John Doe"
          authorBio="A passionate developer"
          authorUrl="https://example.com"
        />
      )
      expect(screen.getByRole('link', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByText('A passionate developer')).toBeInTheDocument()
      expect(screen.getByText('J')).toBeInTheDocument() // fallback avatar
    })

    it('should render correctly with author, authorImage, and authorUrl', () => {
      render(
        <AuthorProfile
          author="John Doe"
          authorImage="/author.jpg"
          authorUrl="https://example.com"
        />
      )
      expect(screen.getByRole('link', { name: 'John Doe Sir' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
      expect(screen.queryByText('J')).not.toBeInTheDocument() // no fallback
      expect(screen.queryByText(/passionate/i)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<AuthorProfile author="John Doe" />)
      const heading = screen.getByRole('heading', { name: 'John Doe Sir' })
      expect(heading.tagName).toBe('H3')
    })

    it('should provide alt text for author image', () => {
      render(<AuthorProfile author="John Doe" authorImage="/author.jpg" />)
      const image = screen.getByRole('img', { name: 'John Doe' })
      expect(image).toHaveAttribute('alt', 'John Doe')
    })

    it('should have accessible link with proper text', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toBeInTheDocument()
    })

    it('should use semantic HTML for bio paragraph', () => {
      render(<AuthorProfile author="John Doe" authorBio="A passionate developer" />)
      const bio = screen.getByText('A passionate developer')
      expect(bio.tagName).toBe('P')
    })

    it('should have proper security attributes on external links', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  describe('Dark Mode Classes', () => {
    it('should include dark mode border classes on container', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('dark:border-neutral-800')
    })

    it('should include dark mode classes on fallback avatar', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const fallbackAvatar = container.querySelector('.w-16.h-16.rounded-full')
      expect(fallbackAvatar).toHaveClass('dark:bg-neutral-800')

      const fallbackText = screen.getByText('J')
      expect(fallbackText).toHaveClass('dark:text-neutral-400')
    })

    it('should include dark mode classes on author name heading', () => {
      render(<AuthorProfile author="John Doe" />)
      const heading = screen.getByRole('heading', { name: 'John Doe Sir' })
      expect(heading).toHaveClass('dark:text-neutral-100')
    })

    it('should include dark mode classes on author name link', () => {
      render(<AuthorProfile author="John Doe" authorUrl="https://example.com" />)
      const link = screen.getByRole('link', { name: 'John Doe Sir' })
      expect(link).toHaveClass('dark:text-neutral-100', 'dark:hover:text-neutral-400')
    })

    it('should include dark mode classes on bio text', () => {
      render(<AuthorProfile author="John Doe" authorBio="A passionate developer" />)
      const bio = screen.getByText('A passionate developer')
      expect(bio).toHaveClass('dark:text-neutral-400')
    })
  })

  describe('Layout and Styling', () => {
    it('should use flexbox layout for content container', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const contentContainer = container.querySelector('.flex.items-start.gap-4')
      expect(contentContainer).toBeInTheDocument()
    })

    it('should apply flex-shrink-0 to image container', () => {
      const { container } = render(<AuthorProfile author="John Doe" authorImage="/author.jpg" />)
      const imageContainer = container.querySelector('.flex-shrink-0')
      expect(imageContainer).toBeInTheDocument()
    })

    it('should apply flex-grow and min-w-0 to text content container', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const textContainer = container.querySelector('.flex-grow.min-w-0')
      expect(textContainer).toBeInTheDocument()
    })

    it('should apply flex-wrap to author name container', () => {
      const { container } = render(<AuthorProfile author="John Doe" />)
      const nameContainer = container.querySelector('.flex.items-center.gap-2.flex-wrap')
      expect(nameContainer).toBeInTheDocument()
    })
  })
})
