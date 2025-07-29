import { resend } from './lib/resend';

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // This is a test email provided by Resend
      subject: 'Test Email',
      text: 'This is a test email to verify the Resend integration is working correctly.',
    });
    
    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail();
