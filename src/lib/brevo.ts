import { TransactionalEmailsApi } from '@getbrevo/brevo';

export const brevoApi = new TransactionalEmailsApi();
brevoApi.setApiKey(0, process.env.BREVO_API_KEY!);
