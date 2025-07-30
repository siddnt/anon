import { brevoApi } from "@/lib/brevo";
import VerificationEmail from "../../email/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/render';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render the React email component to HTML
    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
    
    const sendSmtpEmail = {
      to: [{ email: email, name: username }],
      sender: { name: "Anon App", email: "unwantedid2005@gmail.com" },
      subject: 'Anon Verification Code',
      htmlContent: emailHtml,
    };
    
    await brevoApi.sendTransacEmail(sendSmtpEmail);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}