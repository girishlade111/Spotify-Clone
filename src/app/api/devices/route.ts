import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAvailableDevices } from '@/services/spotify';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const devices = await getAvailableDevices();
    return NextResponse.json(devices);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}
