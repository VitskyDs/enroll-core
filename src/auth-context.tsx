import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session, SupabaseClient } from '@supabase/supabase-js'

type AuthContextValue = {
  user: User | null
  session: Session | null
  isLoading: boolean
  businessId: string | null
  brandColor: string | null
  isOwner: boolean
  ownedBusinessId: string | null
  isOwnerLoading: boolean
  setBusinessId: (id: string) => void
  setOwnedBusinessId: (id: string) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ supabase, children }: { supabase: SupabaseClient; children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [brandColor, setBrandColor] = useState<string | null>(null)
  const [ownedBusinessId, setOwnedBusinessId] = useState<string | null>(null)
  // Tracks which user's ownership has actually been resolved, so isOwnerLoading
  // is derived (never one render frame stale) instead of toggled by the effect —
  // otherwise there's a frame where `user` has updated but the loading flag
  // hasn't caught up yet, and RequireOwner reads isOwner as false-not-loading.
  const [ownerResolvedForUserId, setOwnerResolvedForUserId] = useState<string | null>(null)
  const isOwnerLoading = (user?.id ?? null) !== ownerResolvedForUserId

  useEffect(() => {
    if (!user) { setOwnedBusinessId(null); setOwnerResolvedForUserId(null); return }
    supabase.from('business_owners').select('business_id').eq('user_id', user.id).maybeSingle()
      .then(({ data }: { data: { business_id: string } | null }) => {
        setOwnedBusinessId(data?.business_id ?? null)
        setOwnerResolvedForUserId(user.id)
      })
  }, [user, supabase])

  useEffect(() => {
    if (!businessId) { setBrandColor(null); return }
    supabase
      .from('businesses')
      .select('brand_color')
      .eq('id', businessId)
      .single()
      .then(({ data }: { data: { brand_color: string } | null }) => setBrandColor(data?.brand_color ?? null))
  }, [businessId, supabase])

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session }, error }: { data: { session: Session | null }; error: unknown }) => {
        // An invalid/expired refresh token (e.g. stale localStorage from
        // before a domain migration) resolves here with session: null and an
        // error rather than throwing — surface a clean signed-out state
        // instead of leaving stale session/user data or a dangling
        // isLoading, which otherwise lets RLS-gated requests fire with a
        // dead token before the app notices it's signed out.
        setSession(error ? null : session)
        setUser(error ? null : (session?.user ?? null))
        setIsLoading(false)
      })
      .catch(() => {
        setSession(null)
        setUser(null)
        setIsLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    setBusinessId(null)
    setBrandColor(null)
    setOwnedBusinessId(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      businessId,
      brandColor,
      isOwner: !!ownedBusinessId,
      ownedBusinessId,
      isOwnerLoading,
      setBusinessId,
      setOwnedBusinessId,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
