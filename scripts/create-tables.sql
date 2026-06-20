-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "authId" TEXT NOT NULL UNIQUE,
  "email" TEXT,
  "name" TEXT NOT NULL,
  "profilePicture" TEXT,
  "profession" TEXT,
  "bio" TEXT,
  "trustScore" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Thank table
CREATE TABLE IF NOT EXISTS "Thank" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "note" TEXT NOT NULL,
  "images" TEXT NOT NULL DEFAULT '[]',
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "senderId" TEXT NOT NULL REFERENCES "User"(id),
  "receiverId" TEXT NOT NULL REFERENCES "User"(id)
);

-- Create Tag table
CREATE TABLE IF NOT EXISTS "Tag" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL UNIQUE
);

-- Create join table for Thank <-> Tag
CREATE TABLE IF NOT EXISTS "_ThankTags" (
  "A" TEXT NOT NULL REFERENCES "Thank"(id),
  "B" TEXT NOT NULL REFERENCES "Tag"(id),
  PRIMARY KEY ("A", "B")
);

-- Create _prisma_migrations table for Prisma to track migrations
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" VARCHAR(36) PRIMARY KEY,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Insert initial migration record
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
VALUES (
  gen_random_uuid()::text,
  'dummy-checksum-for-manual-migration',
  NOW(),
  '20250620000000_manual_setup',
  NOW(),
  0
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Thank_senderId_idx" ON "Thank"("senderId");
CREATE INDEX IF NOT EXISTS "Thank_receiverId_idx" ON "Thank"("receiverId");
CREATE INDEX IF NOT EXISTS "_ThankTags_B_idx" ON "_ThankTags"("B");
