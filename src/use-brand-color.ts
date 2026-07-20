import { useEffect } from 'react'

// Applies a business's brand color to the shared `--brand` CSS variable, or
// removes it (falling back to the stylesheet default) when there isn't one.
// Exported standalone (not just as part of the hook below) so a save handler
// can call it directly for an instant update, without waiting on a refetch.
export function applyBrandColor(color: string | null | undefined) {
  if (color) {
    document.documentElement.style.setProperty('--brand', color)
  } else {
    document.documentElement.style.removeProperty('--brand')
  }
}

// Shared by the consumer and admin apps so they can't drift on how a
// business's resolved brand color is applied on load/navigation.
export function useBrandColor(color: string | null | undefined, fallback: string | null = null) {
  const effective = color ?? fallback

  useEffect(() => {
    applyBrandColor(effective)
  }, [effective])
}
