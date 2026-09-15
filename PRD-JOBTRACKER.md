# Product Requirements Document (PRD)
## Job Application Tracker

**Version:** 1.0  
**Platform:** Web Application  
**Target User:** Job Seeker

---

# 1. Product Overview

## 1.1 Product Description

**Job Application Tracker** adalah aplikasi web yang membantu job seeker mencatat, mengelola, dan memantau seluruh proses lamaran kerja dalam satu platform.

Pengguna dapat menyimpan lowongan pekerjaan, mencatat perusahaan yang sudah dilamar, menentukan CV yang digunakan, memantau status proses rekrutmen, mencatat jadwal interview, serta melihat statistik aktivitas pencarian kerja.

---

# 2. Problem

Job seeker sering melamar ke banyak perusahaan melalui berbagai platform seperti LinkedIn, Jobstreet, Glints, website perusahaan, maupun referral.

Informasi lamaran kemudian tersebar dan sulit dilacak, seperti:

- Sudah melamar ke perusahaan mana?
- Melamar pada tanggal berapa?
- Posisi yang dilamar apa?
- Status lamaran saat ini apa?
- CV versi apa yang digunakan?
- Kapan jadwal interview?
- Berapa banyak lamaran yang sudah dikirim?
- Platform mana yang menghasilkan lamaran atau interview paling banyak?

Aplikasi ini dibuat untuk mengelola informasi tersebut dalam satu tempat.

---

# 3. Product Goals

Aplikasi bertujuan untuk:

1. Memusatkan seluruh data lamaran kerja.
2. Memudahkan pengguna mencatat lamaran baru.
3. Memantau status setiap lamaran.
4. Menyimpan riwayat perubahan status.
5. Mencatat CV yang digunakan pada setiap lamaran.
6. Mengelola jadwal interview.
7. Menyimpan lowongan yang belum dilamar.
8. Menampilkan statistik pencarian kerja.

---

# 4. Target User

### Primary User

Job seeker, termasuk:

- Fresh graduate
- Mahasiswa tingkat akhir
- Job seeker aktif
- Profesional yang sedang mencari pekerjaan

---

# 5. Features

## 5.1 Authentication

Pengguna dapat membuat dan mengakses akun.

### Features

- Register
- Login
- Logout
- Protected pages
- Session management

Authentication menggunakan **JWT** pada backend.

Password menggunakan **bcrypt** untuk hashing.

---

# 5.2 Dashboard

Dashboard menampilkan ringkasan kondisi pencarian kerja pengguna.

### Statistics

- Total applications
- Applied
- Screening
- Interview
- Technical Test
- Offering
- Hired
- Rejected

### Additional Information

- Recent applications
- Upcoming interviews
- Recently updated applications

Contoh:

```text
Total Applications     32
Active Applications    12
Interview               5
Technical Test          2
Hired                   1
Rejected               12
```

---

# 5.3 Application Management

Fitur utama untuk mengelola lamaran kerja.

## Add Application

Pengguna dapat memasukkan:

- Company name
- Position
- Job URL
- Job description
- Location
- Work type
- Salary range
- Application source
- Applied date
- Status
- CV used
- Personal notes

### Application Source

- LinkedIn
- Jobstreet
- Glints
- Kalibrr
- Company Website
- Referral
- Other

### Work Type

- On-site
- Hybrid
- Remote

---

## CRUD Application

Pengguna dapat:

- Create application
- Read application
- Update application
- Delete application

---

# 5.4 Application Status

Setiap lamaran mempunyai status proses rekrutmen.

### Status

```text
Wishlist
Applied
Screening
Interview
Technical Test
Offering
Hired
Rejected
Withdrawn
```

Status menunjukkan kondisi terakhir dari sebuah lamaran.

---

# 5.5 Application Timeline

Setiap perubahan status disimpan sebagai history.

Contoh:

```text
14 Sep
Applied

16 Sep
Screening

18 Sep
Interview

20 Sep
Technical Test

23 Sep
Rejected
```

Setiap history memiliki:

- Status
- Note
- Date

### Tujuan

Pengguna dapat mengetahui seluruh perjalanan proses rekrutmen suatu perusahaan.

---

# 5.6 CV Management

CV tidak disimpan sebagai file.

Sistem hanya menyimpan **nama/version CV**.

Contoh:

```text
CV Frontend 2026
CV Fullstack 2026
CV Web Developer
CV Internship
```

### Add CV

Pada pilihan CV di application form terdapat tombol:

```text
CV Used

[ CV Frontend 2026 ▼ ]

                  [+]
```

Ketika tombol `+` ditekan:

```text
Add CV

Name:
[ CV Frontend 2026 ]

[ Save ]
```

CV yang dibuat langsung tersedia pada pilihan CV untuk application lainnya.

### CV Data

```text
id
user_id
name
created_at
updated_at
```

---

# 5.7 Saved Jobs

Pengguna dapat menyimpan lowongan yang belum dilamar.

### Data

- Company
- Position
- Job URL
- Job description
- Location
- Work type
- Salary
- Application deadline
- Source
- Notes

### Actions

- Add saved job
- View
- Edit
- Delete
- Convert to application

### Convert to Application

Contoh:

```text
Saved Job
PT ABC
Frontend Developer

[ Apply ]
```

Ketika dipilih:

```text
Saved Job
       ↓
Create Application
       ↓
Application
```

Data lowongan dapat digunakan kembali sehingga pengguna tidak perlu menginput semuanya dari awal.

---

# 5.8 Interview Management

Pengguna dapat mencatat jadwal interview.

### Data

- Application
- Interview type
- Date
- Time
- Location
- Meeting URL
- Interviewer
- Notes

### Interview Type

- HR Interview
- User Interview
- Technical Interview
- Final Interview
- Other

Dashboard menampilkan interview yang akan datang.

Contoh:

```text
Upcoming Interview

PT ABC
Frontend Developer

20 September 2026
10:00 WIB

Technical Interview
```

---

# 5.9 Search & Filter

Pengguna dapat mencari dan menyaring data application.

### Search

- Company
- Position

### Filter

- Status
- Source
- Location
- Work type
- CV used
- Date

Contoh:

```text
Status: Interview
Work Type: Hybrid
Location: Jakarta
Source: LinkedIn
```

---

# 5.10 Analytics

Sistem menampilkan statistik aktivitas pencarian kerja.

### Metrics

#### Total Applications

Jumlah seluruh lamaran.

#### Response Rate

```text
Applications with response
────────────────────────── × 100
Total applications
```

#### Interview Rate

```text
Applications reaching interview
─────────────────────────────── × 100
Total applications
```

#### Offer Rate

```text
Applications receiving offer
──────────────────────────── × 100
Total applications
```

### Analytics berdasarkan Source

Contoh:

```text
LinkedIn          18
Jobstreet         10
Glints             7
Company Website    5
Referral           2
```

Data dapat ditampilkan menggunakan chart.

---

# 5.11 Notifications

Sistem memberikan notifikasi untuk informasi penting.

Contoh:

- Interview akan datang
- Application berubah status
- Deadline saved job mendekat

Notification mempunyai status:

```text
Unread
Read
```

Pengguna dapat menandai notification sebagai read.

---

# 5.12 Profile

Pengguna dapat mengelola informasi pribadi.

### Data

- Name
- Email
- Phone
- Location
- LinkedIn
- GitHub
- Portfolio

---

# 5.13 Export

Pengguna dapat melakukan export data application.

### Format

**CSV**

Contoh:

```text
Company,Position,Applied Date,Status,Source
PT ABC,Frontend Developer,2026-09-14,Interview,LinkedIn
PT XYZ,Web Developer,2026-09-15,Applied,Jobstreet
```

---

# 6. Database Design

Database menggunakan **PostgreSQL melalui Supabase**.

### Tables

```text
users
applications
application_status_history
cvs
saved_jobs
interviews
notifications
```

---

## users

```text
id
name
email
password
phone
location
linkedin_url
github_url
portfolio_url
created_at
updated_at
```

---

## applications

```text
id
user_id
company_name
position
job_url
description
location
work_type
salary_min
salary_max
source
applied_date
status
cv_id
notes
created_at
updated_at
```

---

## application_status_history

```text
id
application_id
status
note
changed_at
```

---

## cvs

```text
id
user_id
name
created_at
updated_at
```

---

## saved_jobs

```text
id
user_id
company_name
position
job_url
description
location
work_type
salary_min
salary_max
deadline
source
notes
created_at
updated_at
```

---

## interviews

```text
id
application_id
type
interview_date
interview_time
location
meeting_url
interviewer
notes
created_at
updated_at
```

---

## notifications

```text
id
user_id
title
message
type
is_read
created_at
```

---

# 7. Database Relationships

```text
users
 │
 ├──── applications
 │          │
 │          ├──── application_status_history
 │          │
 │          ├──── interviews
 │          │
 │          └──── cvs
 │
 ├──── cvs
 │
 ├──── saved_jobs
 │
 └──── notifications
```

Relationship utama:

```text
User 1 ──── N Applications

User 1 ──── N CVs

Application 1 ──── N Status History

Application 1 ──── N Interviews

User 1 ──── N Saved Jobs

User 1 ──── N Notifications
```

---

# 8. Tech Stack

## Frontend

### React.js

Untuk membangun interface dan component-based UI.

### Tailwind CSS

Untuk styling dan responsive design.

### React Router

Untuk routing halaman.

### Axios

Untuk komunikasi frontend dengan REST API.

### Vite

Untuk development dan build frontend.

---

# 9. Backend

## Node.js

Runtime untuk backend.

## Express.js

Framework untuk membuat REST API.

### Backend Responsibilities

- Authentication
- Authorization
- CRUD applications
- CRUD saved jobs
- CRUD CV
- CRUD interviews
- Status history
- Notifications
- Analytics
- Validation
- Error handling

---

# 10. Database

## Supabase PostgreSQL

Supabase digunakan sebagai platform database PostgreSQL.

Database menyimpan:

- User
- Applications
- CV versions
- Saved jobs
- Interviews
- Status history
- Notifications

**Tidak menggunakan Supabase Storage**, karena aplikasi tidak menyimpan file CV.

---

# 11. Authentication

Authentication menggunakan:

### JWT

JWT digunakan untuk mengidentifikasi user yang sedang login dan melindungi endpoint API.

Flow:

```text
Login
 ↓
Express
 ↓
Verify email + password
 ↓
Generate JWT
 ↓
Frontend
 ↓
Request API
 ↓
JWT Middleware
 ↓
Protected API
```

### bcrypt

Password di-hash sebelum disimpan.

---

# 12. API Structure

Contoh endpoint:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Applications

```text
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id
```

### Status History

```text
GET  /api/applications/:id/history
POST /api/applications/:id/history
```

### CV

```text
GET    /api/cvs
POST   /api/cvs
PUT    /api/cvs/:id
DELETE /api/cvs/:id
```

### Saved Jobs

```text
GET    /api/saved-jobs
POST   /api/saved-jobs
PUT    /api/saved-jobs/:id
DELETE /api/saved-jobs/:id
```

### Interviews

```text
GET    /api/interviews
POST   /api/interviews
PUT    /api/interviews/:id
DELETE /api/interviews/:id
```

### Notifications

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
```

### Analytics

```text
GET /api/analytics
```

---

# 13. Architecture

Aplikasi menggunakan arsitektur **Client-Server** dengan REST API.

```text
┌───────────────────────────┐
│        React.js           │
│      Tailwind CSS         │
└────────────┬──────────────┘
             │
           Axios
             │
             ▼
┌───────────────────────────┐
│      Node.js + Express    │
│                           │
│ Routes                    │
│ Controllers               │
│ Middleware                │
│ Validation                │
└────────────┬──────────────┘
             │
             ▼
┌───────────────────────────┐
│   Supabase PostgreSQL     │
│                           │
│ users                     │
│ applications              │
│ cvs                       │
│ saved_jobs                │
│ interviews                 │
│ notifications              │
└───────────────────────────┘
```

---

# 14. Development Tools

- VS Code
- Git
- GitHub
- Postman
- Supabase Dashboard
- npm
- Chrome DevTools

---

# 15. Deployment

### Frontend

**Vercel**

```text
React + Vite
      ↓
Vercel
```

### Backend

**Render**

```text
Node.js + Express
       ↓
Render
```

### Database

**Supabase**

```text
PostgreSQL
```

---

# 16. Non-Functional Requirements

## Responsive

Aplikasi harus dapat digunakan pada:

- Mobile
- Tablet
- Desktop

## Security

- Password harus di-hash.
- Endpoint private menggunakan authentication.
- User hanya dapat mengakses data miliknya sendiri.
- Input divalidasi.
- Error response tidak membocorkan informasi sensitif.

## Performance

- Pagination untuk application dalam jumlah besar.
- Search dan filter dilakukan secara efisien.
- API menggunakan HTTP status code yang sesuai.

---

# 17. MVP Scope

## Must Have

- Register
- Login
- Logout
- Dashboard
- Application CRUD
- Application status
- Application detail
- Application timeline
- CV management
- Saved jobs
- Interview management
- Search
- Filter
- Responsive UI

## Should Have

- Analytics
- Notifications
- Profile
- CSV export

## Could Have

- Calendar view
- Dark mode
- Advanced analytics
- Application Kanban board

## Won't Have

- CV file upload
- CV file storage
- Follow-up reminder
- Automatic job scraping
- Automatic job application
- AI CV analysis
- AI job recommendation
- Recruiter/employer dashboard

---

# 18. User Flow

## New Application

```text
Login
 ↓
Dashboard
 ↓
Applications
 ↓
Add Application
 ↓
Input Job Information
 ↓
Select CV
 ↓
Select Status
 ↓
Save
 ↓
Application Created
```

## Add New CV

```text
Application Form
 ↓
CV Dropdown
 ↓
Click "+"
 ↓
Input CV Name
 ↓
Save
 ↓
CV Added
 ↓
Automatically selected
```

## Saved Job

```text
Find interesting job
 ↓
Save Job
 ↓
Saved Jobs
 ↓
Click "Apply"
 ↓
Create Application
 ↓
Application Tracking
```

## Status Update

```text
Application Detail
 ↓
Change Status
 ↓
New Status
 ↓
Create Status History
 ↓
Update Current Status
```

---

# 19. Success Criteria

Aplikasi dianggap berhasil apabila pengguna dapat:

1. Membuat akun dan login.
2. Menambahkan lamaran kerja.
3. Mengubah dan menghapus lamaran.
4. Melihat status setiap lamaran.
5. Melihat timeline proses rekrutmen.
6. Membuat dan memilih CV version.
7. Menyimpan lowongan yang belum dilamar.
8. Mengubah saved job menjadi application.
9. Mencatat jadwal interview.
10. Mencari dan memfilter lamaran.
11. Melihat statistik pencarian kerja.
12. Menggunakan aplikasi melalui desktop maupun mobile.

---

# 20. Future Development

Fitur yang dapat ditambahkan setelah MVP:

- Google Calendar integration
- Email notification
- Kanban application pipeline
- AI job description analysis
- AI CV matching
- Job recommendation
- Import job posting dari URL
- Browser extension
- Salary comparison
- Application success-rate analysis