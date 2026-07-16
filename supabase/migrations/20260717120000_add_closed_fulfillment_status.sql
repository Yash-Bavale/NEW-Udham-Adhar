-- Add dedicated `closed` fulfillment status for order closure semantics
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname='fulfillment_status_enum'
  ) THEN
    RAISE EXCEPTION 'fulfillment_status_enum does not exist';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'fulfillment_status_enum' AND e.enumlabel = 'closed'
  ) THEN
    ALTER TYPE public.fulfillment_status_enum ADD VALUE 'closed';
  END IF;
END $$;
