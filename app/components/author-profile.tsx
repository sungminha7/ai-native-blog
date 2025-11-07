import Image from 'next/image'
import Link from 'next/link'

interface AuthorProfileProps {
  author?: string
  authorBio?: string
  authorImage?: string
  authorUrl?: string
}

export function AuthorProfile({
  author,
  authorBio,
  authorImage,
  authorUrl,
}: AuthorProfileProps) {
  if (!author) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-start gap-4">
        {authorImage && (
          <div className="flex-shrink-0">
            <Image
              src={authorImage}
              alt={author}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
        )}
        {!authorImage && (
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-2xl font-medium text-neutral-600 dark:text-neutral-400">
              {author.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {authorUrl ? (
              <Link
                href={authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
              >
                {author} Sir
              </Link>
            ) : (
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {author} Sir
              </h3>
            )}
          </div>
          {authorBio && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {authorBio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
