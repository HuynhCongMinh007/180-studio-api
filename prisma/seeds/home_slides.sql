BEGIN;

-- Images are the famous works seeded in projects.sql (photos from Wikimedia Commons, free licenses).
INSERT INTO home_slides (id, image_url, position, updated_at)
VALUES
  -- Fallingwater
  (1, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Fallingwater_2007.jpg/1920px-Fallingwater_2007.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0, now()),
  -- Guggenheim Museum Bilbao
  (2, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Museo_Guggenheim_--_2021_--_Bilbao%2C_Euskadi%2C_Espa%C3%B1a.jpg/1920px-Museo_Guggenheim_--_2021_--_Bilbao%2C_Euskadi%2C_Espa%C3%B1a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1, now()),
  -- Sydney Opera House
  (3, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sydney_%28AU%29%2C_Opera_House_--_2019_--_2980.jpg/1920px-Sydney_%28AU%29%2C_Opera_House_--_2019_--_2980.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 2, now()),
  -- Farnsworth House
  (4, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Farnsworth_House_Exterior_2.jpg/1920px-Farnsworth_House_Exterior_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 3, now()),
  -- Salk Institute
  (5, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Salk_institute_2014.jpg/1920px-Salk_institute_2014.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 4, now()),
  -- Louvre Pyramid
  (6, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1920px-Louvre_Museum_Wikimedia_Commons.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 5, now()),
  -- Sydney Opera House at dusk
  (7, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1920px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 6, now())
ON CONFLICT (id) DO UPDATE SET
  image_url  = EXCLUDED.image_url,
  position   = EXCLUDED.position,
  updated_at = now();

-- Explicit ids bypass the sequence; move it past the max id so later inserts don't collide.
SELECT setval(pg_get_serial_sequence('home_slides', 'id'), (SELECT MAX(id) FROM home_slides));

COMMIT;
