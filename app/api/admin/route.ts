import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to handle errors
function handleError(error: any, message: string) {
  console.error(message, error);
  return NextResponse.json({ error: error.message || message }, { status: 500 });
}

// GET handler - supports multiple endpoints
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
      case 'stats':
        return await getStats();
      case 'blogs':
        return await getBlogs();
      case 'projects':
        return await getProjects();
      case 'skills':
        return await getSkills();
      case 'faqs':
        return await getFaqs();
      case 'reviews':
        return await getReviews();
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, 'GET request failed');
  }
}

// POST handler - supports multiple endpoints
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
      case 'upload':
        return await handleUpload(request);
      case 'blogs':
        return await createBlog(request);
      case 'projects':
        return await createProject(request);
      case 'skills':
        return await createSkill(request);
      case 'faqs':
        return await createFaq(request);
      case 'reviews':
        return await createReview(request);
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, 'POST request failed');
  }
}

// PUT handler - supports multiple endpoints
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
      case 'blogs':
        return await updateBlog(request);
      case 'projects':
        return await updateProject(request);
      case 'skills':
        return await updateSkill(request);
      case 'faqs':
        return await updateFaq(request);
      case 'reviews':
        return await updateReview(request);
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, 'PUT request failed');
  }
}

// DELETE handler - supports multiple endpoints
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    switch (endpoint) {
      case 'blogs':
        return await deleteBlog(id);
      case 'projects':
        return await deleteProject(id);
      case 'skills':
        return await deleteSkill(id);
      case 'faqs':
        return await deleteFaq(id);
      case 'reviews':
        return await deleteReview(id);
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error, 'DELETE request failed');
  }
}

// Stats endpoint
async function getStats() {
  const [projects, blogs, skills, faqs, approved, pending] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('blogs').select('id', { count: 'exact', head: true }),
    supabase.from('skills').select('id', { count: 'exact', head: true }),
    supabase.from('faqs').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const stats = {
    projects: projects.count ?? 0,
    blogs: blogs.count ?? 0,
    skills: skills.count ?? 0,
    faqs: faqs.count ?? 0,
    approvedReviews: approved.count ?? 0,
    pendingReviews: pending.count ?? 0,
  };

  return NextResponse.json({ data: stats });
}

// Blogs endpoints
async function getBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

async function createBlog(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('blogs')
    .insert(body)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function updateBlog(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  
  const { data, error } = await supabase
    .from('blogs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function deleteBlog(id: string) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ success: true });
}

// Projects endpoints
async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return NextResponse.json({ data });
}

async function createProject(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('projects')
    .insert(body)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function updateProject(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ success: true });
}

// Skills endpoints
async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return NextResponse.json({ data });
}

async function createSkill(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('skills')
    .insert(body)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function updateSkill(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  
  const { data, error } = await supabase
    .from('skills')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ success: true });
}

// FAQs endpoints
async function getFaqs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return NextResponse.json({ data });
}

async function createFaq(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('faqs')
    .insert(body)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function updateFaq(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  
  const { data, error } = await supabase
    .from('faqs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function deleteFaq(id: string) {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ success: true });
}

// Reviews endpoints
async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

async function createReview(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('reviews')
    .insert(body)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function updateReview(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  
  const { data, error } = await supabase
    .from('reviews')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ success: true });
}

// Upload endpoint
async function handleUpload(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string || 'blogs';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(data.path);

  return NextResponse.json({ 
    success: true, 
    url: urlData.publicUrl,
    path: data.path 
  });
}
