-- Seed data for projects and project_images (local development only).
-- Safe to run many times: projects are upserted, and their images are replaced.
--
-- Rules this data follows (they match the Project entity and the schema):
--   * every project has at least one image and at least one cover image
--   * cover_priority is NULL (normal image) or an integer >= 0, unique per project
--   * every URL uses https
--   * year is between 1900 and the current year, areas are greater than 0

BEGIN;

INSERT INTO projects (
  id, name, year, location, site_area_m2, floor_area_m2,
  client, photographer, video_url, updated_at
)
VALUES
  ('0199a000-0000-7000-8000-000000000001', 'Fallingwater', 1939, 'Mill Run, Pennsylvania, USA', NULL, NULL, NULL, 'Wikimedia Commons', NULL, now()),
  ('0199a000-0000-7000-8000-000000000002', 'Guggenheim Museum Bilbao', 1997, 'Bilbao, Spain', NULL, NULL, NULL, 'Wikimedia Commons', NULL, now()),
  ('0199a000-0000-7000-8000-000000000003', 'Sydney Opera House', 1973, 'Sydney, Australia', NULL, NULL, NULL, 'Wikimedia Commons', NULL, now()),
  ('0199a000-0000-7000-8000-000000000004', 'Farnsworth House', 1951, 'Plano, Illinois, USA', NULL, NULL, NULL, 'Wikimedia Commons', NULL, now()),
  ('0199a000-0000-7000-8000-000000000005', 'Salk Institute', 1965, 'La Jolla, California, USA', NULL, NULL, NULL, 'Wikimedia Commons', NULL, now()),
  ('0199a000-0000-7000-8000-000000000006', 'Louvre Pyramid', 1989, 'Paris, France', NULL, NULL, NULL, 'Wikimedia Commons', NULL, now())
ON CONFLICT (id) DO UPDATE SET
  name          = EXCLUDED.name,
  year          = EXCLUDED.year,
  location      = EXCLUDED.location,
  site_area_m2  = EXCLUDED.site_area_m2,
  floor_area_m2 = EXCLUDED.floor_area_m2,
  client        = EXCLUDED.client,
  photographer  = EXCLUDED.photographer,
  video_url     = EXCLUDED.video_url,
  updated_at    = now();

-- Replace the images of the seeded projects, so re-running gives the same result.
DELETE FROM project_images
WHERE project_id IN (
  '0199a000-0000-7000-8000-000000000001',
  '0199a000-0000-7000-8000-000000000002',
  '0199a000-0000-7000-8000-000000000003',
  '0199a000-0000-7000-8000-000000000004',
  '0199a000-0000-7000-8000-000000000005',
  '0199a000-0000-7000-8000-000000000006'
);

-- 4 images per project: 2 covers (priority 0 and 1) and 2 normal images (NULL).
-- Famous works of great architects; photos from Wikimedia Commons (free licenses, credited in "photographer").
INSERT INTO project_images (project_id, image_url, cover_priority)
VALUES
  ('0199a000-0000-7000-8000-000000000001', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Fallingwater_2007.jpg/1920px-Fallingwater_2007.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0),
  ('0199a000-0000-7000-8000-000000000001', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Fallingwater%2C_Mill_Run%2C_PA.jpg/1920px-Fallingwater%2C_Mill_Run%2C_PA.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1),
  ('0199a000-0000-7000-8000-000000000001', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Fallingwater_with_Trees.jpg/1920px-Fallingwater_with_Trees.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),
  ('0199a000-0000-7000-8000-000000000001', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Fallingwater_interior.JPG/1920px-Fallingwater_interior.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),

  ('0199a000-0000-7000-8000-000000000002', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Museo_Guggenheim_--_2021_--_Bilbao%2C_Euskadi%2C_Espa%C3%B1a.jpg/1920px-Museo_Guggenheim_--_2021_--_Bilbao%2C_Euskadi%2C_Espa%C3%B1a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0),
  ('0199a000-0000-7000-8000-000000000002', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Guggenheim_Museum_Bilbao_6.jpg/1920px-Guggenheim_Museum_Bilbao_6.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1),
  ('0199a000-0000-7000-8000-000000000002', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/North_view_of_the_Guggenheim_Museum%2C_Bilbao%2C_Spain_%28PPL3-Altered%29_julesvernex2.jpg/1920px-North_view_of_the_Guggenheim_Museum%2C_Bilbao%2C_Spain_%28PPL3-Altered%29_julesvernex2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),
  ('0199a000-0000-7000-8000-000000000002', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Interior_view_of_Guggenheim_Museum_entrance%2C_Bilbao%2C_Spain_%28PPL1-Corrected%29_julesvernex2.jpg/1920px-Interior_view_of_Guggenheim_Museum_entrance%2C_Bilbao%2C_Spain_%28PPL1-Corrected%29_julesvernex2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),

  ('0199a000-0000-7000-8000-000000000003', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sydney_%28AU%29%2C_Opera_House_--_2019_--_2980.jpg/1920px-Sydney_%28AU%29%2C_Opera_House_--_2019_--_2980.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0),
  ('0199a000-0000-7000-8000-000000000003', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1920px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1),
  ('0199a000-0000-7000-8000-000000000003', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Sydney_%28AU%29%2C_Opera_House_--_2019_--_3054.jpg/1920px-Sydney_%28AU%29%2C_Opera_House_--_2019_--_3054.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),
  ('0199a000-0000-7000-8000-000000000003', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Sydney_%28AU%29%2C_Opera_House_--_2019_--_2994.jpg/1920px-Sydney_%28AU%29%2C_Opera_House_--_2019_--_2994.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),

  ('0199a000-0000-7000-8000-000000000004', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Farnsworth_House_Exterior_2.jpg/1920px-Farnsworth_House_Exterior_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0),
  ('0199a000-0000-7000-8000-000000000004', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Farnsworth_House_Exterior_1.jpg/1920px-Farnsworth_House_Exterior_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1),
  ('0199a000-0000-7000-8000-000000000004', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Farnsworth_House_by_Mies_Van_Der_Rohe_-_exterior-8.jpg/1920px-Farnsworth_House_by_Mies_Van_Der_Rohe_-_exterior-8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),
  ('0199a000-0000-7000-8000-000000000004', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Farnsworth_House_Interior.jpg/1920px-Farnsworth_House_Interior.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),

  ('0199a000-0000-7000-8000-000000000005', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Salk_institute_2014.jpg/1920px-Salk_institute_2014.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0),
  ('0199a000-0000-7000-8000-000000000005', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Salk_Institute_Highsmith.jpg/1920px-Salk_Institute_Highsmith.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1),
  ('0199a000-0000-7000-8000-000000000005', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Salk_Institute_for_Biological_Studies_and_a_seagull_dllu.jpg/1920px-Salk_Institute_for_Biological_Studies_and_a_seagull_dllu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),
  ('0199a000-0000-7000-8000-000000000005', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Chairs_and_table_at_Salk_Institute_dllu.jpg/1920px-Chairs_and_table_at_Salk_Institute_dllu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),

  ('0199a000-0000-7000-8000-000000000006', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1920px-Louvre_Museum_Wikimedia_Commons.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 0),
  ('0199a000-0000-7000-8000-000000000006', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/The_Louvre%2C_Paris_%2817536557176%29.jpg/1920px-The_Louvre%2C_Paris_%2817536557176%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', 1),
  ('0199a000-0000-7000-8000-000000000006', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/View_of_the_Louvre_Palace_from_inside_of_the_Louvre_Pyramid_%2831398171506%29.jpg/1920px-View_of_the_Louvre_Palace_from_inside_of_the_Louvre_Pyramid_%2831398171506%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL),
  ('0199a000-0000-7000-8000-000000000006', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Louvre_%28Ank_kumar_Infosys%29_05.jpg/1920px-Louvre_%28Ank_kumar_Infosys%29_05.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', NULL);

COMMIT;
