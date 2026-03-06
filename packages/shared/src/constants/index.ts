import { MaterialType, ShoeType } from '../types/enums';

// Subscription pricing
export const SUBSCRIPTION_PRICE = 2999; // $29.99 in cents
export const SUBSCRIPTION_ANNUAL_PRICE = 28800; // $288.00 (2 months free)

// Insole pricing by material type (in cents)
export const INSOLE_PRICE_RANGE: Record<MaterialType, number> = {
  [MaterialType.EVA_FOAM]: 15000, // $150
  [MaterialType.MEMORY_FOAM]: 18500, // $185
  [MaterialType.CARBON_FIBER]: 27500, // $275
  [MaterialType.PREMIUM]: 30000, // $300
};

// Shipping cost
export const SHIPPING_COST = 1200; // $12

// Supported shoe types
export const SUPPORTED_SHOE_TYPES: ShoeType[] = [
  ShoeType.HEEL,
  ShoeType.SNEAKER,
  ShoeType.BOOT,
  ShoeType.LOAFER,
  ShoeType.SANDAL,
  ShoeType.SPORT,
];

// Scan processing
export const SCAN_TIMEOUT_MS = 60000; // 60 seconds
export const SCAN_POLL_INTERVAL_MS = 3000; // 3 seconds
export const MAX_SCAN_FILE_SIZE_MB = 50;

// Gait analysis
export const GAIT_VIDEO_TIMEOUT_MS = 120000; // 2 minutes
export const MAX_GAIT_VIDEO_SIZE_MB = 100;
export const REQUIRED_GAIT_STEPS = 10;

// Foot health score
export const MIN_FOOT_HEALTH_SCORE = 0;
export const MAX_FOOT_HEALTH_SCORE = 100;
export const GOOD_FOOT_HEALTH_THRESHOLD = 75;

// Material descriptions
export const MATERIAL_DESCRIPTIONS: Record<MaterialType, string> = {
  [MaterialType.EVA_FOAM]: 'Lightweight, flexible everyday comfort',
  [MaterialType.MEMORY_FOAM]: 'Conforms to your foot, ideal for long wear',
  [MaterialType.CARBON_FIBER]: 'Maximum support, preferred by athletes',
  [MaterialType.PREMIUM]: 'Luxury materials selected for your brand',
};

// JWT
export const JWT_ACCESS_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = '7d';

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const AUTH_RATE_LIMIT_MAX_REQUESTS = 5;

// File upload
export const PRESIGNED_URL_EXPIRES_IN = 300; // 5 minutes
export const VIDEO_PRESIGNED_URL_EXPIRES_IN = 600; // 10 minutes

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
