-- Replace the primary key (project_id, image_url) with a surrogate id, so one
-- project may hold the same image_url more than once.
-- Existing rows get a distinct id: the default is volatile, so PostgreSQL
-- evaluates it once per row when the column is added.

-- AlterTable
ALTER TABLE "project_images" DROP CONSTRAINT "project_images_pkey",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "project_images_pkey" PRIMARY KEY ("id");
