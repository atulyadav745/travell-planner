import { NextResponse } from 'next/server';
import jwt, { Secret } from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { ShareTokenVerifyResponse } from '@/types/api';

// Ensure JWT_SECRET is properly typed
const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find the token in the database
    const shareToken = await prisma.shareToken.findUnique({
      where: { token },
      include: {
        trip: {
          include: {
            scheduledActivities: {
              include: {
                activity: true,
              },
              orderBy: [
                { day: 'asc' },
                { order: 'asc' },
              ],
            },
          },
        },
      },
    });

    // Check if token exists and hasn't expired
    if (!shareToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    if (shareToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 403 });
    }

    try {
      // Verify JWT with proper type assertion
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Return the trip data
    return NextResponse.json({ trip: shareToken.trip });
  } catch (error) {
    console.error('Error verifying share token:', error);
    return NextResponse.json(
      { error: 'Failed to verify share token' },
      { status: 500 }
    );
  }
}