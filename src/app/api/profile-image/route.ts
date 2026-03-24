import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const user = await UserModel.findById(session.user._id).select('profileImage');

        return Response.json({
            success: true,
            profileImage: user?.profileImage || null,
        });
    } catch (error) {
        console.error('Error fetching profile image:', error);
        return Response.json(
            { success: false, message: 'Failed to fetch profile image' },
            { status: 500 }
        );
    }
}
