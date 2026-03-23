-- Update the app's default role to match the Better Auth admin plugin.
UPDATE "user" SET "role" = 'user' WHERE "role" = 'staff';
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';

-- Add Better Auth admin plugin fields to the user and session tables.
ALTER TABLE "user"
ADD COLUMN "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "banReason" TEXT,
ADD COLUMN "banExpires" TIMESTAMP(3);

ALTER TABLE "session"
ADD COLUMN "impersonatedBy" TEXT;
