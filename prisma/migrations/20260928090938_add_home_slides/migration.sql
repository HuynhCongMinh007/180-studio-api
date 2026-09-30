-- CreateTable
CREATE TABLE "home_slides" (
    "id" BIGSERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "alt_text" VARCHAR(500),
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "home_slides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_slides_position_id_idx" ON "home_slides"("position", "id");
