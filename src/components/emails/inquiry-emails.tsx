import * as React from "react";

interface AdminInquiryEmailProps {
    name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    message: string;
    productName?: string;
}

export const AdminInquiryEmail: React.FC<Readonly<AdminInquiryEmailProps>> = ({
    name,
    email,
    phone,
    company,
    country,
    message,
    productName,
}) => (
    <div style={{ fontFamily: "sans-serif", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #eee", borderRadius: "10px" }}>
        <h2 style={{ color: "#0056b3", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>New Inquiry Received</h2>
        <p>You have a new inquiry from the NIVAA GLOBAL website.</p>
        
        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px", margin: "20px 0" }}>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Company:</strong> {company}</p>
            <p><strong>Country:</strong> {country}</p>
            {productName && <p><strong>Interested Product:</strong> {productName}</p>}
        </div>

        <div style={{ marginTop: "20px" }}>
            <strong>Message:</strong>
            <p style={{ whiteSpace: "pre-wrap", fontStyle: "italic", marginTop: "10px", padding: "15px", background: "#f0f7ff", borderRadius: "8px" }}>
                {message}
            </p>
        </div>

        <p style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>
            This inquiry was sent from the nivaaglobal.com contact form.
        </p>
    </div>
);

interface CustomerConfirmationEmailProps {
    name: string;
    productName?: string;
}

export const CustomerConfirmationEmail: React.FC<Readonly<CustomerConfirmationEmailProps>> = ({
    name,
    productName,
}) => (
    <div style={{ fontFamily: "sans-serif", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #eee", borderRadius: "10px" }}>
        <h2 style={{ color: "#0056b3" }}>Inquiry Received - NIVAA GLOBAL</h2>
        <p>Dear {name},</p>
        <p>Thank you for expressing interest in <strong>NIVAA GLOBAL</strong>{productName ? ` regarding our ${productName}` : ""}.</p>
        <p>We have received your inquiry and our team is currently reviewing your requirements. One of our export specialists will get back to you with the pricing and details within the next 24 hours.</p>
        
        <p>In the meantime, feel free to browse our full catalog on our website.</p>

        <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <p>Best Regards,</p>
            <p><strong>Sales Team</strong><br />NIVAA GLOBAL</p>
            <p style={{ fontSize: "12px", color: "#666" }}>
                Pure Cotton. Worldwide Export.
            </p>
        </div>
    </div>
);
