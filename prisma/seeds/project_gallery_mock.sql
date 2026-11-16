-- Mock gallery images for testing the project detail gallery grid (local development only).
-- Adds 16 extra normal images (cover_priority NULL) to "Sydney Opera House",
-- with mixed landscape, portrait and square sizes.
-- Run after projects.sql. Safe to run many times: old mock rows are removed first.

BEGIN;

DELETE FROM project_images
WHERE project_id = '0199a000-0000-7000-8000-000000000003'
  AND image_url LIKE 'https://picsum.photos/%';

INSERT INTO project_images (project_id, image_url, cover_priority)
SELECT
  '0199a000-0000-7000-8000-000000000003',
  'https://picsum.photos/seed/gallery-' || n || '/' ||
    CASE n % 3
      WHEN 0 THEN '1600/900'   -- landscape
      WHEN 1 THEN '900/1600'   -- portrait
      ELSE '1200/1200'         -- square
    END,
  NULL
FROM generate_series(1, 16) AS n;

COMMIT;

-- Mock video (normal YouTube link, as the API stores it) for testing the video embed.
UPDATE projects
SET video_url = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
WHERE id = '0199a000-0000-7000-8000-000000000003';
