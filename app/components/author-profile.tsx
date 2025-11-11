import Image from 'next/image'
import Link from 'next/link'

interface AuthorProfileProps {
  author?: string
  authorBio?: string
  authorImage?: string
  authorUrl?: string
}

interface AuthorAvatarProps {
  imageUrl: string
  authorName: string
}

interface AuthorInitialAvatarProps {
  authorName: string
}

interface AuthorNameProps {
  name: string
  url?: string
}

const AVATAR_SIZE = 64
const AVATAR_CLASSES = 'rounded-full'

function AuthorAvatar({ imageUrl, authorName }: AuthorAvatarProps) {
  return (
    <div className="flex-shrink-0">
      <Image
        src={imageUrl}
        alt={authorName}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className={AVATAR_CLASSES}
      />
    </div>
  )
}

function AuthorInitialAvatar({ authorName }: AuthorInitialAvatarProps) {
  const initial = authorName.charAt(0).toUpperCase()

  return (
    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
      <span className="text-2xl font-medium text-neutral-600 dark:text-neutral-400">
        {initial}
      </span>
    </div>
  )
}

function AuthorName({ name, url }: AuthorNameProps) {
  const displayName = `${name} Sir`
  const nameClassName = 'text-lg font-medium text-neutral-900 dark:text-neutral-100'

  if (url) {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${nameClassName} hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors`}
      >
        {displayName}
      </Link>
    )
  }

  return (
    <h3 className={nameClassName}>
      {displayName}
    </h3>
  )
}

function AuthorBio({ bio }: { bio: string }) {
  return (
    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
      {bio}
    </p>
  )
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
        {authorImage ? (
          <AuthorAvatar imageUrl={authorImage} authorName={author} />
        ) : (
          <AuthorInitialAvatar authorName={author} />
        )}

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <AuthorName name={author} url={authorUrl} />
          </div>
          {authorBio && <AuthorBio bio={authorBio} />}
        </div>
      </div>
    </div>
  )
}
