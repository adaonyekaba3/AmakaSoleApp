DO $$ BEGIN
 CREATE TYPE "auth_provider" AS ENUM('EMAIL', 'APPLE', 'GOOGLE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('CONSUMER', 'BRAND_PARTNER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pronation_type" AS ENUM('NEUTRAL', 'OVERPRONATION', 'SUPINATION', 'UNKNOWN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "scan_status" AS ENUM('PENDING', 'UPLOADING', 'PROCESSING', 'ANALYZING', 'COMPLETE', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "arch_height_pref" AS ENUM('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "design_status" AS ENUM('DRAFT', 'CONFIRMED', 'ORDERED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "material_type" AS ENUM('EVA_FOAM', 'MEMORY_FOAM', 'CARBON_FIBER', 'PREMIUM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shoe_type" AS ENUM('HEEL', 'SNEAKER', 'BOOT', 'LOAFER', 'SANDAL', 'SPORT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "use_case" AS ENUM('EVERYDAY', 'SPORT', 'MEDICAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "order_status" AS ENUM('PENDING', 'PAID', 'MANUFACTURING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "subscription_status" AS ENUM('ACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brand_partner_orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"brand_partner_id" varchar(36) NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"external_order_ref" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brand_partner_orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brand_partners" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"api_key_hash" varchar(255) NOT NULL,
	"webhook_url" varchar(500),
	"logo_url" varchar(500),
	"theme_config" text DEFAULT '{}' NOT NULL,
	"revenue_share_percent" numeric(5, 2) DEFAULT '10' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brand_partners_api_key_hash_unique" UNIQUE("api_key_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"token" varchar(500) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"date_of_birth" timestamp,
	"weight_kg" integer,
	"height_cm" integer,
	"primary_activity" text[],
	"known_conditions" text[],
	"shoe_collection" text DEFAULT '[]' NOT NULL,
	"foot_health_score" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"auth_provider" "auth_provider" DEFAULT 'EMAIL' NOT NULL,
	"role" "user_role" DEFAULT 'CONSUMER' NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "foot_scans" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"scan_date" timestamp DEFAULT now() NOT NULL,
	"left_foot_key" varchar(500),
	"right_foot_key" varchar(500),
	"status" "scan_status" DEFAULT 'PENDING' NOT NULL,
	"point_cloud_url" varchar(500),
	"mesh_url" varchar(500),
	"measurements" text,
	"scan_metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gait_analyses" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"foot_scan_id" varchar(36) NOT NULL,
	"video_key" varchar(500),
	"pronation_type" "pronation_type" DEFAULT 'UNKNOWN' NOT NULL,
	"confidence_score" integer DEFAULT 0 NOT NULL,
	"heatmap_url" varchar(500),
	"analysis_data" text,
	"analyzed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gait_analyses_foot_scan_id_unique" UNIQUE("foot_scan_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orthotic_designs" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"foot_scan_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"shoe_type" "shoe_type" NOT NULL,
	"use_case" "use_case" NOT NULL,
	"material" "material_type" NOT NULL,
	"arch_height_pref" "arch_height_pref" DEFAULT 'MEDIUM' NOT NULL,
	"cad_spec_url" varchar(500),
	"cad_spec" text,
	"preview_image_url" varchar(500),
	"status" "design_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"orthotic_design_id" varchar(36) NOT NULL,
	"brand_partner_id" varchar(36),
	"stripe_payment_intent_id" varchar(255),
	"stripe_session_id" varchar(255),
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'usd' NOT NULL,
	"status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"tracking_number" varchar(255),
	"tracking_carrier" varchar(100),
	"shipping_address" text NOT NULL,
	"subscription_id" varchar(36),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_orthotic_design_id_unique" UNIQUE("orthotic_design_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"stripe_subscription_id" varchar(255) NOT NULL,
	"status" "subscription_status" DEFAULT 'ACTIVE' NOT NULL,
	"plan" varchar(50) DEFAULT 'PREMIUM' NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "brand_partner_orders" ADD CONSTRAINT "brand_partner_orders_brand_partner_id_brand_partners_id_fk" FOREIGN KEY ("brand_partner_id") REFERENCES "brand_partners"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "brand_partner_orders" ADD CONSTRAINT "brand_partner_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "foot_scans" ADD CONSTRAINT "foot_scans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gait_analyses" ADD CONSTRAINT "gait_analyses_foot_scan_id_foot_scans_id_fk" FOREIGN KEY ("foot_scan_id") REFERENCES "foot_scans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orthotic_designs" ADD CONSTRAINT "orthotic_designs_foot_scan_id_foot_scans_id_fk" FOREIGN KEY ("foot_scan_id") REFERENCES "foot_scans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_orthotic_design_id_orthotic_designs_id_fk" FOREIGN KEY ("orthotic_design_id") REFERENCES "orthotic_designs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_brand_partner_id_brand_partners_id_fk" FOREIGN KEY ("brand_partner_id") REFERENCES "brand_partners"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
