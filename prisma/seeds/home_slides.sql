BEGIN;

-- Images are real photos from Unsplash (architecture and interior).
INSERT INTO home_slides (id, image_url, position, updated_at)
VALUES
  (1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&auto=format&fit=crop', 0, now()),
  (2, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80&auto=format&fit=crop', 1, now()),
  (3, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80&auto=format&fit=crop', 2, now()),
  (4, 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1920&q=80&auto=format&fit=crop', 3, now()),
  (5, 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1920&q=80&auto=format&fit=crop', 4, now()),
  (6, 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1920&q=80&auto=format&fit=crop', 5, now()),
  (7, 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1920&q=80&auto=format&fit=crop', 6, now())
ON CONFLICT (id) DO UPDATE SET
  image_url  = EXCLUDED.image_url,
  position   = EXCLUDED.position,
  updated_at = now();

-- Explicit ids bypass the sequence; move it past the max id so later inserts don't collide.
SELECT setval(pg_get_serial_sequence('home_slides', 'id'), (SELECT MAX(id) FROM home_slides));

COMMIT;
