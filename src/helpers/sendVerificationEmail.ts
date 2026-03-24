import { render } from '@react-email/components';
import VerificationEmail from '../../email/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || 'Anon',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: 'Anon Verification Code',
        htmlContent: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return { success: false, message: 'Failed to send verification email.' };
    }

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}