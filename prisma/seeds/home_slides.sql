BEGIN;

-- Images are real photos from picsum.photos (random subjects, not architecture).
INSERT INTO home_slides (id, image_url, position, updated_at)
VALUES
  (1, 'https://fastly.picsum.photos/id/1026/1920/1080.jpg?hmac=7AudKXS08yyxQITcjxnFNoUE6rhDRqCujVo0E2KQzI4', 0, now()),
  (2, 'https://fastly.picsum.photos/id/1027/1920/1080.jpg?hmac=jzZXqyi6taWR10XUe_1vaHyXMo08HoO4gbrZj8a83gI', 1, now()),
  (3, 'https://fastly.picsum.photos/id/1028/1920/1080.jpg?hmac=u6swlZXOOoeaIXz3c_ZWRdz7znv6v-V5lp1yLZ4XGZI', 2, now()),
  (4, 'https://fastly.picsum.photos/id/1029/1920/1080.jpg?hmac=BQZeJjvc4Wya8t9NUpQbpz8gRgGMmz7DH9IX6oP2O9s', 3, now()),
  (5, 'https://fastly.picsum.photos/id/1031/1920/1080.jpg?hmac=ObPVOcx1LduQNib1854DCAfciJNXhaxPGs0ZxbY2ZHw', 4, now()),
  (6, 'https://fastly.picsum.photos/id/1032/1920/1080.jpg?hmac=7wpVjpyV-lhmJZlnDWBHdkZpi6cZe52ixlp93aeB-Zo', 5, now()),
  (7, 'https://fastly.picsum.photos/id/1033/1920/1080.jpg?hmac=PFeRtI5OXUqS7PbTPluUptCJV9_ZF4s_kN3P6teC8dI', 6, now())
ON CONFLICT (id) DO UPDATE SET
  image_url  = EXCLUDED.image_url,
  position   = EXCLUDED.position,
  updated_at = now();

-- Explicit ids bypass the sequence; move it past the max id so later inserts don't collide.
SELECT setval(pg_get_serial_sequence('home_slides', 'id'), (SELECT MAX(id) FROM home_slides));

COMMIT;
