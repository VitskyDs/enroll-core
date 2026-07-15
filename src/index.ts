export { createSupabaseClient } from './supabase'
export { AuthProvider, useAuth } from './auth-context'
export {
  default as i18n,
  LANG_STORAGE_KEY,
  LANG_EXPLICIT_STORAGE_KEY,
  setExplicitLanguage,
  applyBusinessDefaultLanguage,
} from './i18n/index'
export type { Lang } from './i18n/index'
export type {
  Business,
  LoyaltyProgram,
  EarnRules,
  RewardTiersConfig,
  ReferralRules,
  Product,
  CustomerFavorite,
  Customer,
  Offer,
  Reward,
  Referral,
  PointTransaction,
  Notification,
  Order,
  PunchCardClaim,
} from './types'
