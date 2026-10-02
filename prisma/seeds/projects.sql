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
  ('0199a000-0000-7000-8000-000000000001', 'Garden House',      2024, 'District 2, Ho Chi Minh City', 877.00, 413.50, 'Private client',        'Photographer A', 'https://www.youtube.com/watch?v=placeholder01', now()),
  ('0199a000-0000-7000-8000-000000000002', 'Brick Courtyard',   2023, 'Thu Duc, Ho Chi Minh City',    320.00, 540.00, 'Family Nguyen',         'Photographer B', 'https://www.youtube.com/watch?v=placeholder02', now()),
  ('0199a000-0000-7000-8000-000000000003', 'River Cafe',        2022, 'Hoi An, Quang Nam',            150.00, 210.00, 'River Cafe Co., Ltd.',  'Photographer C', 'https://www.youtube.com/watch?v=placeholder03', now()),
  ('0199a000-0000-7000-8000-000000000004', 'Hill Retreat',      2021, 'Da Lat, Lam Dong',            1200.00, 380.00, 'Private client',        'Photographer A', 'https://www.youtube.com/watch?v=placeholder04', now()),
  ('0199a000-0000-7000-8000-000000000005', 'Narrow Townhouse',  2020, 'District 3, Ho Chi Minh City',  60.00, 245.00, 'Family Tran',           'Photographer D', 'https://www.youtube.com/watch?v=placeholder05', now()),
  ('0199a000-0000-7000-8000-000000000006', 'Concrete Studio',   2019, 'Hanoi',                        210.00, 360.00, 'Studio Owner',          'Photographer B', 'https://www.youtube.com/watch?v=placeholder06', now())
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
-- Images are real photos from picsum.photos (random subjects, not architecture).
INSERT INTO project_images (project_id, image_url, cover_priority)
VALUES
  ('0199a000-0000-7000-8000-000000000001', 'https://fastly.picsum.photos/id/1000/1920/1080.jpg?hmac=9oFbSamit9P-mTER0QbZy1HIdkMB94bY70uOERfB97A',     0),
  ('0199a000-0000-7000-8000-000000000001', 'https://fastly.picsum.photos/id/1001/1920/1080.jpg?hmac=U5kL68d5u8hn0ooTTEsdsCB95YPMmQIKcTsjjGXC4sI',     1),
  ('0199a000-0000-7000-8000-000000000001', 'https://fastly.picsum.photos/id/1002/1920/1080.jpg?hmac=1wSpvZ_v0QK6GFg7Uce0QsUAyRHP0521DjMdvw4Bwsk',     NULL),
  ('0199a000-0000-7000-8000-000000000001', 'https://fastly.picsum.photos/id/1003/1920/1080.jpg?hmac=CqdHXWUZtPFzlqxMF-wSbDSqGcnPWH_DnEIbidJFOfk',     NULL),

  ('0199a000-0000-7000-8000-000000000002', 'https://fastly.picsum.photos/id/1004/1920/1080.jpg?hmac=bU6kec8gg6XcvAiwA3BVvzY1AqMu9zML0CnbImGc_Oc',  0),
  ('0199a000-0000-7000-8000-000000000002', 'https://fastly.picsum.photos/id/1005/1920/1080.jpg?hmac=LPBkGn7dUMBdl8NkAswYpezDub8_B75vci383vc2uFo',  1),
  ('0199a000-0000-7000-8000-000000000002', 'https://fastly.picsum.photos/id/1006/1920/1080.jpg?hmac=RCjXkYahygcb47Abu1Nq_RWCl7Lnv5Hf-NPuR3nAoFk',  NULL),
  ('0199a000-0000-7000-8000-000000000002', 'https://fastly.picsum.photos/id/1008/1920/1080.jpg?hmac=tbAvmHptEEHrfRKzo11t1AWST7-KubBMWMWVFp7vb0A',  NULL),

  ('0199a000-0000-7000-8000-000000000003', 'https://fastly.picsum.photos/id/1009/1920/1080.jpg?hmac=qWsSSjrIqxrm6KDp_imGIXWv_O4fn-jhBRIyWkuD3eU',       0),
  ('0199a000-0000-7000-8000-000000000003', 'https://fastly.picsum.photos/id/1010/1920/1080.jpg?hmac=L1eV5lUq9DH-XNJir09kfJzuC2TfpnD5UR_rRf1RM2o',       1),
  ('0199a000-0000-7000-8000-000000000003', 'https://fastly.picsum.photos/id/1011/1920/1080.jpg?hmac=b2iizlTf2rgEJwS1gra9dXuAbBbP8hb-Ss3WiGSKffE',       NULL),
  ('0199a000-0000-7000-8000-000000000003', 'https://fastly.picsum.photos/id/1012/1920/1080.jpg?hmac=bSaChET5E355TkTDBhlQXbUc_Emry9XwpxtwjiUobLc',       NULL),

  ('0199a000-0000-7000-8000-000000000004', 'https://fastly.picsum.photos/id/1013/1920/1080.jpg?hmac=ZJf9HqrLLv2hOMaQYbxNrcEqzuHEhETtQ_OiQRL4N-U',     0),
  ('0199a000-0000-7000-8000-000000000004', 'https://fastly.picsum.photos/id/1014/1920/1080.jpg?hmac=11bJWkBY4f7j-TB410j3C5H3-AF6H2r1GnC6XLkUy1g',     1),
  ('0199a000-0000-7000-8000-000000000004', 'https://fastly.picsum.photos/id/1015/1920/1080.jpg?hmac=M12OSFAxxiMvlGq9OtLXHs02DhW37fZ72Ui-DHvRI28',     NULL),
  ('0199a000-0000-7000-8000-000000000004', 'https://fastly.picsum.photos/id/1016/1920/1080.jpg?hmac=m0K7ktzZcsjv1VlObagIDqq68-BWPa5PeAxe--_uFVc',     NULL),

  ('0199a000-0000-7000-8000-000000000005', 'https://fastly.picsum.photos/id/1018/1920/1080.jpg?hmac=Z-0vPrMvqfkGFzkq3vnamIQKXBk0KSXVxNIKXKCtW4I', 0),
  ('0199a000-0000-7000-8000-000000000005', 'https://fastly.picsum.photos/id/1019/1920/1080.jpg?hmac=XGm3xPMZTa3H-YXR0qxs91ClJOdn43Ei0xRbGTpq6wA', 1),
  ('0199a000-0000-7000-8000-000000000005', 'https://fastly.picsum.photos/id/1020/1920/1080.jpg?hmac=FyYJrCxFkLNz7QcNN-41OdX1IKyfqZVdQ9MRWcSamiA', NULL),
  ('0199a000-0000-7000-8000-000000000005', 'https://fastly.picsum.photos/id/1021/1920/1080.jpg?hmac=DS2TfmvLwtjDGFoSGOPJw6PprUlsIUz-0huiqVL3N_Y', NULL),

  ('0199a000-0000-7000-8000-000000000006', 'https://fastly.picsum.photos/id/1022/1920/1080.jpg?hmac=n9yI3ctkMPGkQ_VnUtxQVQNXrzZbZIs__BFZP1h_BAY',  0),
  ('0199a000-0000-7000-8000-000000000006', 'https://fastly.picsum.photos/id/1023/1920/1080.jpg?hmac=rlsKP6YbqSnw8h-HfW2RCyu3MKkG90hNhLsOsEuGXj8',  1),
  ('0199a000-0000-7000-8000-000000000006', 'https://fastly.picsum.photos/id/1024/1920/1080.jpg?hmac=H-vGBUbqh6o_80Mk2uEuKSiCsNKnnKxZDBCQTqckBCU',  NULL),
  ('0199a000-0000-7000-8000-000000000006', 'https://fastly.picsum.photos/id/1025/1920/1080.jpg?hmac=cx-5UC_HcExBANyHFTlwG9-5Drw4emdHvXY2sLThpYM',  NULL);

COMMIT;
