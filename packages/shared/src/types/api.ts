// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SocialAuthRequest {
  identityToken?: string;
  idToken?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
}

// Scan API types
export interface UploadUrlRequest {
  foot: 'LEFT' | 'RIGHT';
  fileType: 'STL' | 'OBJ' | 'PLY';
}

export interface UploadUrlResponse {
  uploadUrl: string;
  scanId: string;
  expiresIn: number;
}

export interface ConfirmScanRequest {
  foot: 'LEFT' | 'RIGHT';
}

export interface ScanStatusResponse {
  scanId: string;
  status: string;
  progress: number;
  currentStep: string;
}

// Gait API types
export interface GaitUploadUrlRequest {
  scanId: string;
}

export interface GaitAnalysisRequest {
  scanId: string;
}

// Orthotic API types
export interface GenerateOrthoticRequest {
  scanId: string;
  shoeType: string;
  useCase: string;
  material: string;
  archHeightPref: string;
}

// Order API types
export interface CreatePaymentIntentRequest {
  orthoticDesignId: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  orderId: string;
}

export interface CreateSubscriptionRequest {
  paymentMethodId: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: string;
}
