CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"making_charge_per_gram" integer DEFAULT 25 NOT NULL,
	"margin_multiplier" numeric(4, 2) DEFAULT '2.5' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
