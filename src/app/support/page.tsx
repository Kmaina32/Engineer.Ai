
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { useState } from "react";
import { Loader2 } from "lucide-react";


const faqs = [
    {
        question: "How do I add a new asset?",
        answer: "Navigate to the 'Assets' page from the sidebar. Click the 'Add Asset' button in the top right of the assets card. Fill in the required details in the dialog and click 'Add Asset' to save it."
    },
    {
        question: "What do the different asset statuses mean?",
        answer: "The statuses indicate the current operational state of an asset. 'Operational' means it's running normally. 'Warning' indicates a potential issue that needs monitoring. 'Critical' means there's a serious problem requiring immediate attention. 'Maintenance' means the asset is currently offline for service."
    },
    {
        question: "How does the AI anomaly detection work?",
        answer: "Our AI model analyzes the sensor data you provide (like vibration, temperature, and pressure) against historical patterns and known failure signatures to identify deviations that may indicate an impending issue. You can use this tool on the 'AI Tools' tab in your dashboard."
    },
    {
        question: "Can I change my engineering discipline after signing up?",
        answer: "Currently, you cannot change your engineering discipline after registration as it determines which dashboard and tools you see. If you need to change it, please contact support."
    }
]


export default function SupportPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setSubmitting(false);
        toast({
            title: "Message Sent",
            description: "Thanks for reaching out! Our support team will get back to you shortly."
        });
        setFormData({ subject: '', message: '' });
    }, 1500);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <h1 className="text-2xl font-bold tracking-tight my-4">Support Center</h1>
            
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <CardDescription>Find answers to common questions about PredictAI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent>
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Contact Us</CardTitle>
                        <CardDescription>Can't find an answer? Send us a message.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="e.g., Issue with asset tracking" value={formData.subject} onChange={handleInputChange} disabled={submitting} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Please describe your issue in detail..." className="min-h-[150px]" value={formData.message} onChange={handleInputChange} disabled={submitting} required/>
                            </div>
                            <Button type="submit" disabled={submitting} variant="accent">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
}
