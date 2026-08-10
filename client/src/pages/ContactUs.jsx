import React, { useState } from 'react';
import { Mail, Phone, Globe, Send, User, MessageSquare, MapPin } from 'lucide-react';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setFormData({ name: '', email: '', message: '' });
            alert('Message sent successfully!');
        }, 1500);
    };

    return (
        <div
            className="min-h-screen bg-[#070b19] p-4 mb-18.75 text-white sm:p-6 sm:py-12 flex items-center justify-center"
            style={{ fontFamily: "'Baloo 2', cursive" }}
        >
            <div className="w-full max-w-5xl pt-15.5px">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1
                        className="text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-[#FF4D8D] via-purple-500 to-[#4D8DFF] drop-shadow-[0_0_15px_rgba(255,77,141,0.5)]"
                        style={{ fontFamily: "'DynaPuff', cursive" }}
                    >
                        Get In Touch
                    </h1>
                    <p className="mt-3 text-slate-400 text-lg max-w-xl mx-auto">
                        Have questions, feedback, or need support? We're here to help you connect. Drop us a message!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* Contact Information Cards (Left Side) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Phone Card */}
                        <div className="group flex items-center gap-4 rounded-[24px] border border-white/5 bg-[#0c122b]/80 p-5 transition-all hover:bg-[#121936] hover:border-pink-500/30 hover:shadow-[0_0_20px_rgba(255,77,141,0.15)] backdrop-blur-xl">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-500/10 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Phone size={24} className="text-[#FF4D8D]" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Call Us</p>
                                <a href="tel:+919477723538" className="text-lg font-bold text-white hover:text-[#FF4D8D] transition-colors">
                                    +91 94777 23538
                                </a>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="group flex items-center gap-4 rounded-[24px] border border-white/5 bg-[#0c122b]/80 p-5 transition-all hover:bg-[#121936] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-xl">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Mail size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Email Us</p>
                                <div className="flex flex-col">
                                    <a href="mailto:hello@addalove.com" className="text-base font-bold text-white hover:text-purple-400 transition-colors">
                                        hello@addalove.com
                                    </a>
                                    <a href="mailto:support@addalove.com" className="text-sm font-medium text-slate-400 hover:text-purple-400 transition-colors">
                                        support@addalove.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Website Card */}
                        <div className="group flex items-center gap-4 rounded-[24px] border border-white/5 bg-[#0c122b]/80 p-5 transition-all hover:bg-[#121936] hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(77,141,255,0.15)] backdrop-blur-xl">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Globe size={24} className="text-[#4D8DFF]" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Website</p>
                                <a href="https://addalove.com" target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-[#4D8DFF] transition-colors">
                                    www.addalove.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form (Right Side) */}
                    

                </div>
            </div>
        </div>
    );
}