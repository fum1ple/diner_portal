import { NextRequest, NextResponse } from 'next/server';
import { authenticatedFetch } from '@/utils/api';

// BFF: /api/restaurants/[id]/favorite
// POST   -> Rails: POST   /api/favorites { restaurant_id }
// DELETE -> Rails: DELETE /api/favorites/:restaurant_id

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const restaurantId = params.id;
  // Rails API expects: { restaurant_id: ... }
  const res = await authenticatedFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant_id: restaurantId }),
    },
    req
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const restaurantId = params.id;
  // Rails API expects: DELETE /api/favorites/:restaurant_id
  const res = await authenticatedFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/${restaurantId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    },
    req
  );
  // Rails returns 204 No Content on success
  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
