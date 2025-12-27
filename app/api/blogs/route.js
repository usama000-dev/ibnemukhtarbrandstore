import fs from 'fs/promises';
import path from 'path';

export async function GET(req) {
  const blogsDirectory = path.join(process.cwd(), 'blogData');

  try {
    const files = await fs.readdir(blogsDirectory);
    
    const blogs = files.map((file) => ({
      fileName: file
    }));

    return new Response(JSON.stringify(blogs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to read blog data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
