-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('MUSEUM', 'LANDMARK', 'PARK', 'RESTAURANT', 'SHOPPING', 'ENTERTAINMENT');

-- Add activity type column with a default value
ALTER TABLE "Activity" ADD COLUMN "activityType" "ActivityType" NOT NULL DEFAULT 'LANDMARK';

-- Add priority column with a default value
ALTER TABLE "Activity" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 1;

-- Add bestTimeOfDay column
ALTER TABLE "Activity" ADD COLUMN "bestTimeOfDay" TEXT;