import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Competition from '@/models/Competition';
import { verifyToken } from '@/middlewares/auth';
import { verifyAdmin } from '@/middlewares/verifyAdmin';

export async function POST(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Verify admin role
    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck;
    }

    const { competitionId } = await params;
    const body = await request.json();
    const { waitlistItemId } = body;

    if (!waitlistItemId) {
      return NextResponse.json(
        { success: false, message: 'Waitlist item ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const competition = await Competition.findById(competitionId).populate('waitlist.user participants');

    if (!competition) {
      return NextResponse.json(
        { success: false, message: 'Competition not found' },
        { status: 404 }
      );
    }

    // Find the waitlist item
    const waitlistItem = competition.waitlist.id(waitlistItemId);

    if (!waitlistItem) {
      return NextResponse.json(
        { success: false, message: 'Waitlist item not found' },
        { status: 404 }
      );
    }

    // Check if user is already a participant
    const isAlreadyParticipant = competition.participants.some(
      (p) => p._id.toString() === waitlistItem.user._id.toString()
    );

    if (isAlreadyParticipant) {
      return NextResponse.json(
        { success: false, message: 'User is already a participant' },
        { status: 400 }
      );
    }

    // Add user to participants
    competition.participants.push(waitlistItem.user._id);

    // Remove from waitlist
    competition.waitlist.pull(waitlistItemId);

    await competition.save();

    // Populate and return updated competition
    await competition.populate('waitlist.user participants');

    return NextResponse.json({
      success: true,
      message: 'Participant approved successfully',
      competition,
    });
  } catch (error) {
    console.error('Error approving participant:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while approving participant' },
      { status: 500 }
    );
  }
}