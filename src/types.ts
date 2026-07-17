export type Business = {
  id: string
  owner_id?: string
  name: string
  slug: string
  logo_url: string | null
  cover_image_url: string | null
  tagline: string | null
  address: string | null
  hours: string | null
  industry: string | null
  brand_color: string | null
  currency: string | null
  default_language: 'en' | 'he' | null
}

export type LoyaltyProgram = {
  id: string
  business_id: string
  program_name: string
  currency_name: string
  earn_rules: EarnRules
  reward_tiers: RewardTiersConfig
  referral_rules: ReferralRules
  brand_voice: Record<string, unknown>
  punch_card_enabled: boolean
  punch_card_target?: number
  // Reward the punch card resolves to on completion — one or several specific
  // products, or a product category (evaluated dynamically against live
  // products, not a fixed set). Null/undefined when no reward is configured
  // yet. Exactly one of punch_card_reward_product_ids /
  // punch_card_reward_category is set, matching whichever type is set —
  // enforced in the database by punch_card_reward_shape_chk.
  punch_card_reward_type?: 'products' | 'category' | null
  punch_card_reward_product_ids?: string[] | null
  punch_card_reward_category?: string | null
}

// A completed-but-unresolved (or resolved) punch card cycle. Created when
// punch_card_count reaches target; resolved exactly once, via the
// claim_punch_card_reward(p_customer_id, p_claim_id, p_product_id) RPC, when
// the customer picks which eligible product to redeem.
export type PunchCardClaim = {
  id: string
  customer_id: string
  business_id: string
  reward_type: 'products' | 'category'
  eligible_product_ids: string[] | null
  eligible_category: string | null
  status: 'pending' | 'claimed'
  chosen_product_id: string | null
  completed_at: string
  claimed_at: string | null
}

export type EarnRules = {
  points_per_dollar?: number
  points_per_visit?: number
  birthday_bonus_points?: number
  per_product_overrides?: { product_id: string; points: number }[]
  cents_per_point?: number
}

export type RewardTiersConfig = {
  tiers: { name: string; min_points: number; multiplier?: number; perk?: string; perks: string[] }[]
}

export type ReferralRules = {
  referrer_points: number
  referee_points: number
}

export type Product = {
  id: string
  business_id: string
  name: string
  description: string | null
  name_he: string | null
  description_he: string | null
  price_cents: number | null
  category: string | null
  status: 'active' | 'draft' | 'inactive'
  image_url: string | null
  points_value: number | null
}

// The `services` table (TASK-144) — legacy/no-longer-written-to as a
// storefront catalog per TASK-155 (see enroll-consumer's data model doc),
// but active again for subscription plan config: a service can be sold
// one-time (price_cents / points_value, same shape as before) and/or as a
// recurring subscription (subscription_enabled + the two fields below, both
// null when disabled).
export type Service = {
  id: string
  business_id: string
  name: string
  description: string | null
  price_cents: number | null
  category: string | null
  status: 'active' | 'draft' | 'inactive'
  image_url: string | null
  points_value: number | null
  subscription_enabled: boolean
  subscription_interval: 'weekly' | 'monthly' | null
  subscription_price_cents: number | null
}

// A customer's recurring subscription to a service. interval/price_cents
// snapshot the service's subscription plan at signup — a later change to
// the service's plan config doesn't retroactively change what an existing
// subscriber is billed. Billing is a demo/simulated construct (no payment
// processor integrated) — process_subscription_renewals() is a pg_cron
// scheduled function that awards points and advances next_renewal_at, no
// card is ever charged. Not directly writable by clients — created via
// create_service_subscription, cancelled via cancel_service_subscription
// (both SECURITY DEFINER RPCs).
export type ServiceSubscription = {
  id: string
  customer_id: string
  business_id: string
  service_id: string
  interval: 'weekly' | 'monthly'
  price_cents: number
  status: 'active' | 'cancelled'
  started_at: string
  next_renewal_at: string
  cancelled_at: string | null
}

export type CustomerFavorite = {
  id: string
  customer_id: string
  product_id: string
  created_at: string
}

export type Customer = {
  id: string
  user_id: string
  business_id: string
  name: string
  email: string
  points: number
  lifetime_points: number
  punch_card_count: number
  tier: string | null
  joined_at: string
  status: 'active' | 'inactive'
  birthday: string | null
  gender: string | null
  phone: string | null
  marketing_consent: boolean
}

export type Offer = {
  id: string
  business_id: string
  title: string
  description: string | null
  points_bonus: number
  expires_at: string | null
  status: 'active' | 'inactive'
  created_at: string
}

export type Reward = {
  id: string
  business_id: string
  name: string
  description: string | null
  points_cost: number
  image_url: string | null
  status: 'active' | 'inactive'
}

export type Referral = {
  id: string
  referrer_id: string
  referee_id: string | null
  referee_name: string | null
  business_id: string
  status: 'pending' | 'completed'
  points_awarded: number
  created_at: string
}

export type PointTransaction = {
  id: string
  customer_id: string
  business_id: string
  points: number
  reason: string
  created_at: string
}

export type Notification = {
  id: string
  customer_id: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_id: string
  business_id: string
  items: unknown
  total_cents: number
  points_awarded: number
  created_at: string
}
