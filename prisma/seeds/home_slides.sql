BEGIN;

INSERT INTO home_slides (id, image_url, image_public_id, alt_text, position, updated_at)
VALUES
  (1, '/placeholders/slide-1.svg', NULL, 'Placeholder architecture 1', 0, now()),
  (2, '/placeholders/slide-2.svg', NULL, 'Placeholder architecture 2', 1, now()),
  (3, '/placeholders/slide-3.svg', NULL, 'Placeholder architecture 3', 2, now()),
  (4, '/placeholders/slide-4.svg', NULL, 'Placeholder architecture 4', 3, now()),
  (5, '/placeholders/slide-5.svg', NULL, 'Placeholder architecture 5', 4, now()),
  (6, '/placeholders/slide-6.svg', NULL, 'Placeholder architecture 6', 5, now())
ON CONFLICT (id) DO UPDATE SET
  image_url       = EXCLUDED.image_url,
  image_public_id = EXCLUDED.image_public_id,
  alt_text        = EXCLUDED.alt_text,
  position        = EXCLUDED.position,
  updated_at      = now();

-- Explicit ids bypass the sequence; move it past the max id so later inserts don't collide.
SELECT setval(pg_get_serial_sequence('home_slides', 'id'), (SELECT MAX(id) FROM home_slides));

COMMIT;
