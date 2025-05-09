import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import BoringAvatar from "boring-avatars"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => {
  // If there's a valid src, use it as a regular image
  if (src && !src.includes("placeholder.svg")) {
    return (
      <AvatarPrimitive.Image
        ref={ref}
        src={src}
        alt={alt}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
      />
    )
  }
  
  // Otherwise, generate a unique avatar based on the alt text (usually the user's name)
  // or a random string if alt is not provided
  const name = alt || Math.random().toString(36).substring(2, 8)
  
  return (
    <div className={cn("aspect-square h-full w-full", className)}>
      <BoringAvatar
        size="100%"
        name={name}
        variant="beam"
        colors={["#2A9D8F", "#E76F51", "#E9C46A", "#70B7B7", "#264653"]}
      />
    </div>
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => {
  // If there are children (usually initials), use the regular fallback
  if (React.Children.count(children) > 0) {
    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Fallback>
    )
  }
  
  // Otherwise, generate a unique avatar based on a random string
  const randomName = Math.random().toString(36).substring(2, 8)
  
  return (
    <div className={cn("aspect-square h-full w-full", className)}>
      <BoringAvatar
        size="100%"
        name={randomName}
        variant="marble"
        colors={["#2A9D8F", "#E76F51", "#E9C46A", "#70B7B7", "#264653"]}
      />
    </div>
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
