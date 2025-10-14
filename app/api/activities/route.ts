import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
        where: {
            city: 'Paris' // For now, we only fetch activities for our hardcoded city
        }
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching activities' }, { status: 500 });
  }
}
