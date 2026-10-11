BEGIN;

INSERT INTO home_slides (id, image_url, image_public_id, alt_text, position, updated_at)
VALUES
  (1, 'https://placehold.co/1920x1080/png?text=Slide+1', NULL, 'Placeholder architecture 1', 0, now()),
  (2, 'https://placehold.co/1920x1080/png?text=Slide+2', NULL, 'Placeholder architecture 2', 1, now()),
  (3, 'https://placehold.co/1920x1080/png?text=Slide+3', NULL, 'Placeholder architecture 3', 2, now()),
  (4, 'https://placehold.co/1920x1080/png?text=Slide+4', NULL, 'Placeholder architecture 4', 3, now()),
  (5, 'https://placehold.co/1920x1080/png?text=Slide+5', NULL, 'Placeholder architecture 5', 4, now()),
  (6, 'https://placehold.co/1920x1080/png?text=Slide+6', NULL, 'Placeholder architecture 6', 5, now())
ON CONFLICT (id) DO UPDATE SET
  image_url       = EXCLUDED.image_url,
  image_public_id = EXCLUDED.image_public_id,
  alt_text        = EXCLUDED.alt_text,
  position        = EXCLUDED.position,
  updated_at      = now();

-- Explicit ids bypass the sequence; move it past the max id so later inserts don't collide.
SELECT setval(pg_get_serial_sequence('home_slides', 'id'), (SELECT MAX(id) FROM home_slides));

COMMIT;
