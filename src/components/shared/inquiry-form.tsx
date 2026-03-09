"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface InquiryFormProps {
    productId?: string;
    productName?: string;
}

export function InquiryForm({ productId, productName }: InquiryFormProps) {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryFormValues>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            company: "",
            country: "",
            message: productName
                ? `I'm interested in "${productName}". Please share pricing and MOQ details.`
                : "",
            productId: productId || "",
            productName: productName || "",
        },
    });

    const onSubmit = async (data: InquiryFormValues) => {
        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit inquiry");
            }

            setSubmitted(true);
            toast.success("Inquiry submitted successfully!");
            reset();
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "Something went wrong";
            toast.error("Submission failed", { description: errMsg });
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-10 px-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                <div className="w-14 h-14 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-brand-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-brand-accent mb-2">
                    Thank You!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    We&apos;ve received your inquiry and will respond within 24 hours.
                </p>
                {/* <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                >
                    Send Another Inquiry
                </Button> */}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                        id="name"
                        placeholder="John Smith"
                        {...register("name")}
                        className={errors.name ? "border-red-400" : ""}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        {...register("email")}
                        className={errors.email ? "border-red-400" : ""}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
                    <Input
                        id="phone"
                        placeholder="+1 234 567 890"
                        {...register("phone")}
                        className={errors.phone ? "border-red-400" : ""}
                    />
                    {errors.phone && (
                        <p className="text-xs text-red-500">{errors.phone.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-sm font-medium">Company *</Label>
                    <Input
                        id="company"
                        placeholder="Your Company Name"
                        {...register("company")}
                        className={errors.company ? "border-red-400" : ""}
                    />
                    {errors.company && (
                        <p className="text-xs text-red-500">{errors.company.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="country" className="text-sm font-medium">Country *</Label>
                <Input
                    id="country"
                    placeholder="e.g., United States, Germany, UAE"
                    {...register("country")}
                    className={errors.country ? "border-red-400" : ""}
                />
                {errors.country && (
                    <p className="text-xs text-red-500">{errors.country.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                <Textarea
                    id="message"
                    placeholder="Tell us about your requirements — product type, quantity, delivery timeline..."
                    rows={4}
                    {...register("message")}
                    className={errors.message ? "border-red-400" : ""}
                />
                {errors.message && (
                    <p className="text-xs text-red-500">{errors.message.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-medium shadow-md shadow-brand-primary/20 hover:shadow-lg transition-all"
                size="lg"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Inquiry
                    </>
                )}
            </Button>
        </form>
    );
}
