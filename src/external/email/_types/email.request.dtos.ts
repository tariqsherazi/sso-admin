export type EmailData = string | { name?: string; email: string; };

export interface MailData {
	to: EmailData | EmailData[],
	cc?: EmailData | EmailData[],
	bcc?: EmailData | EmailData[],

	// from: EmailData,
	// replyTo?: EmailData,

	sendAt?: number,
	// subject?: string,
	// text?: string,
	// html?: string,

	// templateId?: string
}
