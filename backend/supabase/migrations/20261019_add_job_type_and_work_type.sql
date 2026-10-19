-- 1. Hapus check constraint lama pada work_type yang membatasi nilai (sebelumnya melarang 'On-Site')
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_work_type_check;

-- 2. Tambahkan kolom job_type (Full Time, Internship, Contract, Part Time, Freelance)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS job_type text DEFAULT 'Full Time';

-- 3. Pastikan kolom work_type ada dengan default 'On-Site'
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS work_type text DEFAULT 'On-Site';

-- 4. Migrasi data lama dari work_type ke job_type
UPDATE public.applications 
SET job_type = work_type 
WHERE work_type IN ('Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance');

-- 5. Khusus jika ada data lama yang nilainya 'Remote', set job_type default 'Full Time' dan work_type 'Remote'
UPDATE public.applications 
SET job_type = 'Full Time', work_type = 'Remote' 
WHERE work_type = 'Remote';

-- 6. Perbarui data lama lainnya agar memiliki work_type yang valid ('On-Site')
UPDATE public.applications 
SET work_type = 'On-Site' 
WHERE work_type IN ('Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance') OR work_type IS NULL;

-- 7. Pasang check constraint baru yang sesuai
ALTER TABLE public.applications 
ADD CONSTRAINT applications_work_type_check 
CHECK (work_type IN ('On-Site', 'Hybrid', 'Remote'));

ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_job_type_check;

ALTER TABLE public.applications 
ADD CONSTRAINT applications_job_type_check 
CHECK (job_type IN ('Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'));
