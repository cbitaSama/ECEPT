-- Backfill user_tags from existing flashcards.tags[]
-- Run in Supabase SQL Editor after Update 24a schema is applied.
-- Idempotent: ON CONFLICT DO NOTHING.

INSERT INTO public.user_tags (user_id, name, color)
SELECT DISTINCT f.user_id, trim(t.tag) AS name, '#a78bfa' AS color
FROM public.flashcards f
CROSS JOIN LATERAL unnest(f.tags) AS t(tag)
WHERE f.user_id IS NOT NULL
  AND f.tags IS NOT NULL
  AND array_length(f.tags, 1) > 0
  AND length(trim(t.tag)) > 0
ON CONFLICT (user_id, name) DO NOTHING;

-- Reporte: cuántas filas se insertaron
SELECT count(*) AS user_tags_total FROM public.user_tags;
SELECT user_id, count(*) AS tags_per_user
  FROM public.user_tags
  GROUP BY user_id
  ORDER BY tags_per_user DESC
  LIMIT 10;
