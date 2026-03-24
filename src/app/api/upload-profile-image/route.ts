import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return Response.json(
                { success: false, message: 'No image provided' },
                { status: 400 }
            );
        }

        // Convert file to base64 for Cloudinary upload
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = imageFile.type;
        const dataUri = `data:${mimeType};base64,${base64}`;

        // Upload to Cloudinary
        const cloudinary = (await import('@/lib/cloudinary')).default;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'vibecheck-profiles',
            transformation: [
                { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        });

        // Update user profile image in database
        const user = await UserModel.findOneAndUpdate(
            { _id: session.user._id },
            { profileImage: uploadResult.secure_url },
            { new: true }
        );

        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: 'Profile image updated',
            imageUrl: uploadResult.secure_url,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return Response.json(
            { success: false, message: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
