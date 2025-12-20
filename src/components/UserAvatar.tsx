import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
    user: {
        username?: string | null
        avatarUrl?: string | null
        email?: string | null
    } | null
    className?: string
    fallbackClassName?: string
}

export function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
    const name = user?.username || user?.email || 'User'
    // Use avatarUrl if valid, otherwise generate a consistent avatar 
    // Using DiceBear Adventurer per request for animated/person/gubbe feeling
    // Using seed=name ensures same user gets same avatar
    const avatarSrc = user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`

    return (
        <Avatar className={className}>
            <AvatarImage src={avatarSrc} alt={name} className="object-cover bg-muted" />
            <AvatarFallback className={`bg-muted text-muted-foreground ${fallbackClassName}`}>
                {name[0]?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}
