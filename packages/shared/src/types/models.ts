import {
  AuthProvider,
  UserRole,
  ScanStatus,
  PronationType,
  ShoeType,
  UseCase,
  MaterialType,
  ArchHeightPref,
  DesignStatus,
  OrderStatus,
  SubscriptionStatus,
} from './enums';

// ============================================================================
// USER MODELS
// ============================================================================

export interface User {
  id: string;
  email: string;
  passwordHash?: string | null;
  firstName: string;
  lastName: string;
  authProvider: AuthProvider;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ShoeItem {
  brand: string;
  style: string;
  color: string;
  shoeType: ShoeType;
  notes?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  dateOfBirth?: Date | null;
  weightKg?: number | null;
  heightCm?: number | null;
  primaryActivity: string[];
  knownConditions: string[];
  shoeCollection: ShoeItem[];
  footHealthScore: number;
  updatedAt: Date;
}

// ============================================================================
// SCAN MODELS
// ============================================================================

export interface FootMeasurement {
  length_mm: number;
  width_mm: number;
  arch_height_mm: number;
  heel_width_mm: number;
  ball_width_mm: number;
}

export interface FootMeasurements {
  left: FootMeasurement;
  right: FootMeasurement;
}

export interface ScanMetadata {
  deviceModel: string;
  captureAngles: number;
  processingTimeSeconds: number;
  qualityScore: number;
}

export interface FootScan {
  id: string;
  userId: string;
  scanDate: Date;
  leftFootKey?: string | null;
  rightFootKey?: string | null;
  status: ScanStatus;
  pointCloudUrl?: string | null;
  meshUrl?: string | null;
  measurements?: FootMeasurements | null;
  scanMetadata?: ScanMetadata | null;
  createdAt: Date;
}

export interface PressureDistribution {
  heel: number;
  medialArch: number;
  lateralArch: number;
  ball: number;
  toes: number;
}

export interface GaitAnalysisData {
  avgAnkleAngle: number;
  ankleAngles: number[];
  frameCount: number;
  stepsAnalyzed: number;
  pressureDistribution: PressureDistribution;
}

export interface GaitAnalysis {
  id: string;
  footScanId: string;
  videoKey?: string | null;
  pronationType: PronationType;
  confidenceScore: number;
  heatmapUrl?: string | null;
  analysisData?: GaitAnalysisData | null;
  analyzedAt: Date;
}

// ============================================================================
// ORTHOTIC MODELS
// ============================================================================

export interface OrthoticSpec {
  arch_height_mm: number;
  heel_cup_depth_mm: number;
  metatarsal_pad_x: number;
  metatarsal_pad_y: number;
  toe_box_width: number;
  insole_length_mm: number;
  insole_width_mm: number;
}

export interface OrthoticDesign {
  id: string;
  footScanId: string;
  userId: string;
  shoeType: ShoeType;
  useCase: UseCase;
  material: MaterialType;
  archHeightPref: ArchHeightPref;
  cadSpecUrl?: string | null;
  cadSpec?: OrthoticSpec | null;
  previewImageUrl?: string | null;
  status: DesignStatus;
  createdAt: Date;
}

// ============================================================================
// ORDER MODELS
// ============================================================================

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  orthoticDesignId: string;
  brandPartnerId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeSessionId?: string | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
  shippingAddress: ShippingAddress;
  subscriptionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  plan: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
}

// ============================================================================
// BRAND PARTNER MODELS
// ============================================================================

export interface BrandThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  logoUrl?: string;
  borderRadius?: number;
}

export interface BrandPartner {
  id: string;
  name: string;
  apiKeyHash: string;
  webhookUrl?: string | null;
  logoUrl?: string | null;
  themeConfig: BrandThemeConfig;
  revenueSharePercent: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BrandPartnerOrder {
  id: string;
  brandPartnerId: string;
  orderId: string;
  externalOrderRef?: string | null;
  createdAt: Date;
}

// ============================================================================
// EXTENDED MODELS (with relations)
// ============================================================================

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface FootScanWithAnalysis extends FootScan {
  gaitAnalysis?: GaitAnalysis;
  orthoticDesigns?: OrthoticDesign[];
}

export interface OrthoticDesignWithScan extends OrthoticDesign {
  footScan?: FootScan;
}

export interface OrderWithDetails extends Order {
  orthoticDesign?: OrthoticDesign;
  brandPartner?: BrandPartner;
}
