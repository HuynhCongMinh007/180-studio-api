BEGIN;

-- Admin account (no sign-up feature). password_hash is a bcrypt hash, never the plain password.
INSERT INTO "user" (id, email, password_hash, role, updated_at)
VALUES
  (gen_random_uuid(), 'admin@gmail.com', '$2b$10$g4MYDofztG7MIxqbmNAYw.moljr/gsGaG74whBuQ4/v6qVwLpZPv6', 'admin', now())
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role          = EXCLUDED.role,
  updated_at    = now();

COMMIT;
