// Authentication & User Enums
export enum AuthProvider {
  EMAIL = 'EMAIL',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
}

export enum UserRole {
  CONSUMER = 'CONSUMER',
  BRAND_PARTNER = 'BRAND_PARTNER',
  ADMIN = 'ADMIN',
}

// Scan Enums
export enum ScanStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export enum PronationType {
  NEUTRAL = 'NEUTRAL',
  OVERPRONATION = 'OVERPRONATION',
  SUPINATION = 'SUPINATION',
  UNKNOWN = 'UNKNOWN',
}

// Orthotic Enums
export enum ShoeType {
  HEEL = 'HEEL',
  SNEAKER = 'SNEAKER',
  BOOT = 'BOOT',
  LOAFER = 'LOAFER',
  SANDAL = 'SANDAL',
  SPORT = 'SPORT',
}

export enum UseCase {
  EVERYDAY = 'EVERYDAY',
  SPORT = 'SPORT',
  MEDICAL = 'MEDICAL',
}

export enum MaterialType {
  EVA_FOAM = 'EVA_FOAM',
  MEMORY_FOAM = 'MEMORY_FOAM',
  CARBON_FIBER = 'CARBON_FIBER',
  PREMIUM = 'PREMIUM',
}

export enum ArchHeightPref {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum DesignStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  ORDERED = 'ORDERED',
}

// Order Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  MANUFACTURING = 'MANUFACTURING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
}
