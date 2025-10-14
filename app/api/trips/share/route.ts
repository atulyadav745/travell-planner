import { NextResponse } from 'next/server';
import jwt, { Secret } from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { ShareTokenResponse } from '@/types/api';

// Ensure JWT_SECRET is properly typed
const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

// Token will expire in 30 days
const TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

export async function POST(req: Request) {
  try {
    const { tripId } = await req.json();

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    // Verify the trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Create expiration date for the share token (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Generate JWT with proper type assertion for the secret
    const token = jwt.sign(
      { tripId },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Store the token in the database
    const shareToken = await prisma.shareToken.create({
      data: {
        token,
        tripId,
        expiresAt,
      },
    });

    return NextResponse.json({ token: shareToken.token });
  } catch (error) {
    console.error('Error creating share token:', error);
    return NextResponse.json(
      { error: 'Failed to create share token' },
      { status: 500 }
    );
  }
}