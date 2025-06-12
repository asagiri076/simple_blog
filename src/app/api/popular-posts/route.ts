import { NextResponse } from 'next/server';
import { fetchPopularPosts } from '@/lib/microcms';

export async function GET() {
  try {
    const data = await fetchPopularPosts(5);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch popular posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular posts' },
      { status: 500 }
    );
  }
}