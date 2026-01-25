import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, link: string) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "NotEacher <onboarding@resend.dev>",
            to: [email],
            subject: "Confirm your account",
            html: `<p>Click the link below to confirm your account:</p><p><a href="${link}">Confirm Account</a></p>`,
        });

        if (error) {
            console.error("Resend error:", error);
            throw error;
        }

        console.log("Email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}
