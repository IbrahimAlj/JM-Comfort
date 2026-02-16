USE jm_comfort;

-- Add new status values for approval workflow
ALTER TABLE appointments 
MODIFY COLUMN status ENUM(
  'pending',
  'approved', 
  'rejected',
  'scheduled',
  'completed',
  'cancelled',
  'no_show'
) NOT NULL DEFAULT 'pending';

-- Add columns for approval tracking
ALTER TABLE appointments
ADD COLUMN approved_by BIGINT NULL AFTER status,
ADD COLUMN approved_at TIMESTAMP NULL AFTER approved_by,
ADD COLUMN rejection_reason TEXT NULL AFTER approved_at;
