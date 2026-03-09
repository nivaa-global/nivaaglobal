import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validations";
import { createInquiry, getSettings } from "@/lib/firestore";
import { sanitizeObject } from "@/lib/sanitize";
import { Resend } from "resend";
import { AdminInquiryEmail } from "@/components/emails/inquiry-emails";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate
        const result = inquirySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // Sanitize
        const sanitizedData = sanitizeObject(result.data);

        // Store in Firestore
        const id = await createInquiry({
            name: sanitizedData.name,
            email: sanitizedData.email,
            phone: sanitizedData.phone,
            company: sanitizedData.company,
            country: sanitizedData.country,
            message: sanitizedData.message,
            productId: sanitizedData.productId,
            productName: sanitizedData.productName,
        });

        // Send Email Notifications
        try {
            const apiKey = process.env.RESEND_API_KEY;
            if (!apiKey) {
                console.warn("RESEND_API_KEY is not set. Email notification skipped.");
            } else {
                const resend = new Resend(apiKey);
                const settings = await getSettings();
                
                // Use verified domain email
                const fromEmail = "NIVAA GLOBAL <admin@nivaaglobal.com>";
                const adminEmail = "admin@nivaaglobal.com";

                // Function to replace placeholders
                const replacePlaceholders = (text: string) => {
                    return text
                        .replace(/{{name}}/g, sanitizedData.name)
                        .replace(/{{email}}/g, sanitizedData.email)
                        .replace(/{{phone}}/g, sanitizedData.phone)
                        .replace(/{{company}}/g, sanitizedData.company)
                        .replace(/{{productName}}/g, sanitizedData.productName || "General Inquiry")
                        .replace(/{{message}}/g, sanitizedData.message);
                };

                // 1. Admin Email
                const adminSubject = settings?.adminEmailSubject 
                    ? replacePlaceholders(settings.adminEmailSubject) 
                    : `New Lead: ${sanitizedData.productName || "General"} from ${sanitizedData.name}`;
                
                const adminBody = settings?.adminEmailBody 
                    ? replacePlaceholders(settings.adminEmailBody)
                    : "";

                console.log(`[Email] Dispatching inquiry to Admin: ${adminEmail}`);
                
                await resend.emails.send({
                    from: fromEmail,
                    to: adminEmail,
                    replyTo: sanitizedData.email,
                    subject: adminSubject,
                    react: adminBody ? undefined : (
                        <AdminInquiryEmail
                            name={sanitizedData.name}
                            email={sanitizedData.email}
                            phone={sanitizedData.phone}
                            company={sanitizedData.company}
                            country={sanitizedData.country}
                            message={sanitizedData.message}
                            productName={sanitizedData.productName}
                        />
                    ),
                    text: adminBody || undefined,
                });

                // 2. User Confirmation Email
                const userSubject = settings?.userEmailSubject 
                    ? replacePlaceholders(settings.userEmailSubject) 
                    : "Thank you for your inquiry - NIVAA GLOBAL";
                
                const userBody = settings?.userEmailBody 
                    ? replacePlaceholders(settings.userEmailBody)
                    : `Dear ${sanitizedData.name},\n\nThank you for reaching out to NIVAA GLOBAL. We have received your inquiry and will get back to you shortly.`;

                console.log(`[Email] Dispatching confirmation to User: ${sanitizedData.email}`);
                
                await resend.emails.send({
                    from: fromEmail,
                    to: sanitizedData.email,
                    subject: userSubject,
                    text: userBody,
                });

                console.log("[Email Success] Dual emails dispatched");
            }
        } catch (emailError) {
            console.error("[Email Critical Error] Notification flow broken:", emailError);
        }

        return NextResponse.json(
            { success: true, id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating inquiry:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
