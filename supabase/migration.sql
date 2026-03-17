-- ============================================================
-- Jerry Portfolio — Supabase Migration
-- Run this in the Supabase SQL Editor to create all tables.
-- ============================================================

-- 1. FAQs
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Skills
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Projects
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null default '',
  overview     text not null default '',
  stack        text[] not null default '{}',
  live_url     text not null default '',
  github_url   text not null default '',
  images       text[] not null default '{}',
  year         text not null default '',
  accent_color text not null default '#1A73E8',
  bg_classes   text not null default '',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- 4. Blogs
create table if not exists public.blogs (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  excerpt    text not null default '',
  content    text not null default '',
  category   text not null default 'technologies',
  date       date not null default current_date,
  creator    text not null default 'Jerry',
  image_url  text not null default '',
  tags       text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 5. Reviews
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text not null default '',
  avatar_url text not null default '',
  rating     integer not null default 5,
  message    text not null,
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- Public can read everything except pending/rejected reviews.
-- Only authenticated users (admin) can insert/update/delete.
-- Anyone can INSERT a review (public submission).
-- ============================================================

-- Enable RLS on all tables
alter table public.faqs     enable row level security;
alter table public.skills   enable row level security;
alter table public.projects enable row level security;
alter table public.blogs    enable row level security;
alter table public.reviews  enable row level security;

-- FAQs: public read, admin write
create policy "Public read faqs"  on public.faqs for select using (true);
create policy "Admin insert faqs" on public.faqs for insert with check (auth.role() = 'authenticated');
create policy "Admin update faqs" on public.faqs for update using (auth.role() = 'authenticated');
create policy "Admin delete faqs" on public.faqs for delete using (auth.role() = 'authenticated');

-- Skills: public read, admin write
create policy "Public read skills"  on public.skills for select using (true);
create policy "Admin insert skills" on public.skills for insert with check (auth.role() = 'authenticated');
create policy "Admin update skills" on public.skills for update using (auth.role() = 'authenticated');
create policy "Admin delete skills" on public.skills for delete using (auth.role() = 'authenticated');

-- Projects: public read, admin write
create policy "Public read projects"  on public.projects for select using (true);
create policy "Admin insert projects" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Admin update projects" on public.projects for update using (auth.role() = 'authenticated');
create policy "Admin delete projects" on public.projects for delete using (auth.role() = 'authenticated');

-- Blogs: public read, admin write
create policy "Public read blogs"  on public.blogs for select using (true);
create policy "Admin insert blogs" on public.blogs for insert with check (auth.role() = 'authenticated');
create policy "Admin update blogs" on public.blogs for update using (auth.role() = 'authenticated');
create policy "Admin delete blogs" on public.blogs for delete using (auth.role() = 'authenticated');

-- Reviews: public can read approved only, anyone can insert (submit), admin can update/delete
create policy "Public read approved reviews" on public.reviews for select using (status = 'approved' or auth.role() = 'authenticated');
create policy "Anyone insert review"         on public.reviews for insert with check (true);
create policy "Admin update reviews"         on public.reviews for update using (auth.role() = 'authenticated');
create policy "Admin delete reviews"         on public.reviews for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for images (create via Dashboard or API)
-- bucket name: portfolio-images
-- ============================================================
-- NOTE: Create this bucket manually in the Supabase Dashboard 
-- Storage section, or use the Supabase JS client.

-- ============================================================
-- Seed data (optional — your current hardcoded data)
-- ============================================================

-- Seed FAQs
insert into public.faqs (question, answer, sort_order) values
  ('What drives you as a developer?', 'Building things that actually work — fast, beautiful, and scalable. I love the moment a complex idea becomes a clean, working product.', 0),
  ('What''s your current stack?', 'React, Next.js, TypeScript, Tailwind CSS on the frontend. Node.js, Express, and Supabase on the backend — with a healthy respect for SQL and a soft spot for MongoDB.', 1),
  ('What have you deployed recently?', 'Elephant Tours — a full-stack travel app with a hybrid CMS (Supabase + Sanity.io), admin dashboard, and zero-downtime Vercel deployment. Also contributed frontend work at Global Island (LK Web Design).', 2),
  ('How do you approach a new project?', 'Understand the problem first, then the user. Architecture before aesthetics — but I won''t build something that looks bad either.', 3),
  ('Where are you based?', 'Kandy, Sri Lanka. Open to remote collaboration anywhere.', 4),
  ('What are you working toward?', 'Growing into a senior full-stack role — deepening my systems thinking, contributing to open source, and building scalable projects that matter.', 5);

-- Seed Skills
insert into public.skills (name, sort_order) values
  ('React.js', 0), ('Next.js', 1), ('TypeScript', 2), ('Tailwind CSS', 3),
  ('Node.js', 4), ('Express.js', 5), ('Supabase', 6), ('Sanity.io', 7),
  ('MongoDB', 8), ('SQL Server', 9), ('Firebase', 10), ('.NET', 11),
  ('Java', 12), ('C#', 13), ('Git', 14), ('Vercel', 15);

-- Seed Projects
insert into public.projects (title, category, overview, stack, live_url, github_url, images, year, accent_color, bg_classes, sort_order) values
  (
    'Elephant Tours',
    'Full Stack · Travel',
    'Designed and built end-to-end — from data architecture to deployment. The goal was to give non-technical clients full content control through a custom admin dashboard and a dual-CMS strategy that separates dynamic tour data from editorial content.',
    ARRAY['Next.js','TypeScript','Tailwind CSS','Supabase','Sanity.io','Vercel'],
    'https://elephant-travels-revamp.vercel.app/',
    '',
    ARRAY['/projects/elephant-tours/elephant-tours.png','/projects/elephant-tours/elephant-tours2.png','/projects/elephant-tours/elephant-tours3.png','/projects/elephant-tours/elephant-tours4.png','/projects/elephant-tours/elephant-tours5.png'],
    '2026',
    '#1A73E8',
    'bg-[#F4F7FF] dark:bg-[#080D1A]',
    0
  ),
  (
    'LK Web Design',
    'Frontend · Agency',
    'A professional engagement embedded into an existing team at Global Island (Pvt) Ltd. Focused on component quality, responsive design, and maintainable code within a live production codebase.',
    ARRAY['Next.js','TypeScript','Tailwind CSS'],
    'https://lkwebdesign.vercel.app/about',
    '',
    ARRAY['/projects/lkwebdesign/lkwebdesign.png','/projects/lkwebdesign/lkwebdesign.png'],
    '2025–2026',
    '#2BC48A',
    'bg-[#F3FBF7] dark:bg-[#070F0B]',
    1
  );

-- Seed Blogs
insert into public.blogs (title, excerpt, content, category, date, creator, image_url, tags) values
  ('Getting Started with Next.js 14 App Router', 'Exploring the new App Router paradigm and how it changes the way we build Next.js applications.', 'Exploring the new App Router paradigm and how it changes the way we build Next.js applications. The App Router introduces a new file-system based router built on top of React Server Components, which supports layouts, nested routes, loading states, error handling, and more.', 'technologies', '2026-03-15', 'Jerry', '/blogs/blog1.webp', ARRAY['Next.js','React','Web Development']),
  ('Why Developers Are Choosing Supabase Over Firebase', 'A deep dive into the advantages of Supabase over Firebase for modern web applications.', 'A deep dive into the advantages of Supabase over Firebase for modern web applications. Supabase has been gaining significant traction in the developer community as an open-source alternative to Firebase.', 'technologies', '2026-03-10', 'Jerry', '/blogs/blog2.webp', ARRAY['Supabase','Firebase','Backend']),
  ('What is Server-Side Rendering in Next.js?', 'A comprehensive guide to SSR, SSG, and ISR in Next.js and when to use each approach.', 'A comprehensive guide to SSR, SSG, and ISR in Next.js and when to use each approach. Understanding the different rendering strategies in Next.js is crucial for building performant web applications.', 'concepts', '2026-02-28', 'Jerry', '/blogs/blog3.jpg', ARRAY['SSR','Next.js','Performance']);

-- Seed Reviews (approved)
insert into public.reviews (name, role, avatar_url, rating, message, status) values
  ('Sarah Mitchell', 'Product Manager · Fintech Startup', '/avatars/sarah.jpg', 5, 'Jerry delivered a flawless Next.js application that exceeded every expectation. His attention to detail, clean code, and proactive communication made the entire process seamless. Highly recommend for any serious web project.', 'approved'),
  ('David Chen', 'CTO · E-commerce Platform', '/avatars/david.jpg', 5, 'Working with Jerry was a pleasure from start to finish. He understood the technical requirements immediately and delivered a robust, scalable solution on time. The Supabase integration he built saved us weeks of development.', 'approved'),
  ('Amara Osei', 'Founder · Creative Agency', '/avatars/amara.jpg', 5, 'Exceptional work on our portfolio redesign. Jerry brings both technical depth and a sharp eye for design — a rare combination. The animations and performance optimizations he added made a huge difference.', 'approved');

-- ============================================================
-- 6. AI Knowledge Base
-- A single-row table that the admin can update to change what
-- the AI assistant knows about Jerry.
-- ============================================================

-- Function to auto-update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create table with fixed ID for single-row constraint
create table if not exists public.knowledge_base (
  id         text primary key default 'default',
  content    text not null,
  updated_at timestamptz not null default now()
);

-- Trigger to auto-update updated_at on modifications
create trigger update_knowledge_base_updated_at
  before update on public.knowledge_base
  for each row
  execute procedure update_updated_at_column();

alter table public.knowledge_base enable row level security;

create policy "Public read knowledge_base"  on public.knowledge_base for select using (true);
create policy "Admin insert knowledge_base" on public.knowledge_base for insert with check (auth.role() = 'authenticated');
create policy "Admin update knowledge_base" on public.knowledge_base for update using (auth.role() = 'authenticated');
create policy "Admin delete knowledge_base" on public.knowledge_base for delete using (auth.role() = 'authenticated');

-- Seed: initial knowledge base (using upsert to handle single-row constraint)
insert into public.knowledge_base (id, content) values (
  'default',
  'You are an AI assistant for Gunaseelan Jerryson''s portfolio. Answer questions about Jerry naturally and helpfully.

About:
- Full Stack Developer based in Kandy, Sri Lanka
- Skilled in React, Next.js, TypeScript, Tailwind CSS, Node.js, Express.js, Supabase, Sanity.io
- Also knows Java, C#, .NET, MongoDB, SQL Server, Firebase

Experience:
- Junior Full Stack Developer at Global Island (Pvt) Ltd – LK Web Design (Nov 2025 – Feb 2026)

Projects:
- Elephant Tours: full-stack travel app, Next.js + Supabase + Sanity.io, live at elephant-travels-revamp.vercel.app
- LK Web Design: frontend contributions, live at lkwebdesign.vercel.app

Education:
- Higher Diploma in Computing & Software Engineering, ICBT Campus Kandy (2025)

Contact:
- Email: jerrysonjerry1234@gmail.com
- Phone: +94-76-230-7416
- GitHub: github.com/JerryOffiicial

Always respond in first person as Jerry. Be friendly, concise, and professional.'
) on conflict (id) do update set 
  content = excluded.content,
  updated_at = now();
