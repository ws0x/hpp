import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_use_cases_icon" AS ENUM('scaling', 'leadership', 'structure');
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'growth-readiness' BEFORE 'hr-consulting';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'fractional-chro' BEFORE 'hr-consulting';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'org-design' BEFORE 'hr-consulting';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'leadership-advisory' BEFORE 'hr-consulting';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'executive-search' BEFORE 'hr-consulting';
  CREATE TABLE "recommendations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar,
  	"relationship" varchar,
  	"quote" varchar NOT NULL,
  	"linkedin_url" varchar,
  	"photo_id" integer,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "use_cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"industry" varchar,
  	"challenge" varchar NOT NULL,
  	"solution" varchar,
  	"result" varchar NOT NULL,
  	"icon" "enum_use_cases_icon" DEFAULT 'structure',
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "client_logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"website" varchar,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "services" ALTER COLUMN "icon" SET DEFAULT 'growth-readiness';
  ALTER TABLE "site_settings" ALTER COLUMN "tagline" SET DEFAULT 'Building Organizations Ready for Growth';
  ALTER TABLE "site_settings" ALTER COLUMN "email" SET DEFAULT 'business@hplusplus.com';
  ALTER TABLE "site_settings" ALTER COLUMN "phone" SET DEFAULT '+20 100 123 4567';
  ALTER TABLE "site_settings" ALTER COLUMN "location" SET DEFAULT 'Cairo, Egypt · Dubai, UAE';
  ALTER TABLE "site_settings" ALTER COLUMN "linkedin" SET DEFAULT 'https://www.linkedin.com/in/wessam-abd-el-majeed/';
  ALTER TABLE "site_settings" ALTER COLUMN "default_meta_title" SET DEFAULT 'H++ | Building Organizations Ready for Growth';
  ALTER TABLE "site_settings" ALTER COLUMN "default_meta_description" SET DEFAULT 'H++ is a strategic people consulting firm helping scaling businesses build scalable organizations, stronger leadership teams, and high-performing workforces across the MENA region.';
  ALTER TABLE "hero_content" ALTER COLUMN "headline" SET DEFAULT 'Building Organizations Ready for Growth';
  ALTER TABLE "hero_content" ALTER COLUMN "subtext" SET DEFAULT 'Strategic people consulting that helps scaling businesses unlock potential, build strong leadership, and create high-performing organizations.';
  ALTER TABLE "hero_content" ALTER COLUMN "primary_cta_label" SET DEFAULT 'Get Your Growth Readiness Assessment';
  ALTER TABLE "hero_content" ALTER COLUMN "secondary_cta_label" SET DEFAULT 'Our Solutions';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "recommendations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "use_cases_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "client_logos_id" integer;
  ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_logos" ADD CONSTRAINT "client_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "recommendations_photo_idx" ON "recommendations" USING btree ("photo_id");
  CREATE INDEX "recommendations_updated_at_idx" ON "recommendations" USING btree ("updated_at");
  CREATE INDEX "recommendations_created_at_idx" ON "recommendations" USING btree ("created_at");
  CREATE INDEX "use_cases_updated_at_idx" ON "use_cases" USING btree ("updated_at");
  CREATE INDEX "use_cases_created_at_idx" ON "use_cases" USING btree ("created_at");
  CREATE INDEX "client_logos_logo_idx" ON "client_logos" USING btree ("logo_id");
  CREATE INDEX "client_logos_updated_at_idx" ON "client_logos" USING btree ("updated_at");
  CREATE INDEX "client_logos_created_at_idx" ON "client_logos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recommendations_fk" FOREIGN KEY ("recommendations_id") REFERENCES "public"."recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_logos_fk" FOREIGN KEY ("client_logos_id") REFERENCES "public"."client_logos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_recommendations_id_idx" ON "payload_locked_documents_rels" USING btree ("recommendations_id");
  CREATE INDEX "payload_locked_documents_rels_use_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("use_cases_id");
  CREATE INDEX "payload_locked_documents_rels_client_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("client_logos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "recommendations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "use_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "client_logos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "recommendations" CASCADE;
  DROP TABLE "use_cases" CASCADE;
  DROP TABLE "client_logos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_recommendations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_use_cases_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_client_logos_fk";
  
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "services" ALTER COLUMN "icon" SET DEFAULT 'hr-consulting'::text;
  DROP TYPE "public"."enum_services_icon";
  CREATE TYPE "public"."enum_services_icon" AS ENUM('hr-consulting', 'recruitment', 'org-development', 'training', 'strategy', 'people');
  ALTER TABLE "services" ALTER COLUMN "icon" SET DEFAULT 'hr-consulting'::"public"."enum_services_icon";
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_icon" USING "icon"::"public"."enum_services_icon";
  DROP INDEX "payload_locked_documents_rels_recommendations_id_idx";
  DROP INDEX "payload_locked_documents_rels_use_cases_id_idx";
  DROP INDEX "payload_locked_documents_rels_client_logos_id_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "tagline" SET DEFAULT 'Evolving Human Resources';
  ALTER TABLE "site_settings" ALTER COLUMN "email" SET DEFAULT 'hello@hplusplus.net';
  ALTER TABLE "site_settings" ALTER COLUMN "phone" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "location" SET DEFAULT 'MENA Region';
  ALTER TABLE "site_settings" ALTER COLUMN "linkedin" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "default_meta_title" SET DEFAULT 'H++ | Evolving Human Resources';
  ALTER TABLE "site_settings" ALTER COLUMN "default_meta_description" SET DEFAULT 'Wessam Abdelmajeed — HR Business Partner & Talent Strategist. Innovative HR consulting, recruitment, and advisory solutions across the MENA region.';
  ALTER TABLE "hero_content" ALTER COLUMN "headline" SET DEFAULT 'Evolving Human Resources';
  ALTER TABLE "hero_content" ALTER COLUMN "subtext" SET DEFAULT 'Empowering organisations to grow through people. Innovative HR solutions, tailored strategies, and real impact — all in one place.';
  ALTER TABLE "hero_content" ALTER COLUMN "primary_cta_label" SET DEFAULT 'Let''s Connect';
  ALTER TABLE "hero_content" ALTER COLUMN "secondary_cta_label" SET DEFAULT 'View My Services';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "recommendations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "use_cases_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "client_logos_id";
  DROP TYPE "public"."enum_use_cases_icon";`)
}
