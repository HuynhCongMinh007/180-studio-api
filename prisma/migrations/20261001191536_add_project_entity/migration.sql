/*
  Warnings:

  - You are about to drop the column `alt_text` on the `home_slides` table. All the data in the column will be lost.
  - You are about to drop the column `image_public_id` on the `home_slides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "home_slides" DROP COLUMN "alt_text",
DROP COLUMN "image_public_id";

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "year" SMALLINT NOT NULL,
    "location" VARCHAR(255),
    "site_area_m2" DECIMAL(10,2),
    "floor_area_m2" DECIMAL(10,2),
    "client" VARCHAR(255),
    "photographer" VARCHAR(255),
    "video_url" VARCHAR(2048),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "project_id" UUID NOT NULL,
    "image_url" VARCHAR(1024) NOT NULL,
    "cover_priority" SMALLINT,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("project_id","image_url")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_images_project_id_cover_priority_key" ON "project_images"("project_id", "cover_priority");

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
