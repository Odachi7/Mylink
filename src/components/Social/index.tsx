import type { ReactNode } from "react"

interface SocialProps{
    url: string;
    children: ReactNode;
}

export function Social({ url, children}: SocialProps) {
    return (
        <a 
            className="hover:scale-110 duration-300"
            rel="noopener noreferrer"
            target="_blank"
            href={url}
            >
            {children}
        </a>       
    )
}