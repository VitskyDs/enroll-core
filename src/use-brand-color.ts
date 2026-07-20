import { useEffect } from 'react'

// Applies a business's brand color to the shared `--brand` CSS variable, or
// removes it (falling back to the stylesheet default) when there isn't one.
// Shared by the consumer and admin apps so they can't drift on how this is
// resolved.
export function useBrandColor(color: string | null | undefined, fallback: string | null = null) {
  const effective = color ?? fallback

  useEffect(() => {
    if (effective) {
      document.documentElement.style.setProperty('--brand', effective)
    } else {
      document.documentElement.style.removeProperty('--brand')
    }
  }, [effective])
}
