import React from 'react';
import {
    Heart, Download, Play, MessageCircle, Shield, Flower,
    Smile, Users, Brain, Mic, GraduationCap, CheckCircle2, Mail, Phone, Globe, MapPin,
    FingerprintPattern
} from 'lucide-react';
import latter from "../assets/latter.png"
import logo from '../assets/logo2.png'
import { Link } from 'react-router';
const AddaLoveLandingPage = () => {
    return (
        <div className="min-h-screen bg-[#070514] text-white font-sans selection:bg-pink-500/30">

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#070514]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <img src={logo} alt="" className='h-8' />
                    <div className="relative flex items-center">
                        <span className="text-lg font-black italic text-transparent bg-clip-text bg-linear-to-r from-[#FF4D8D] to-[#6C3BFF]">Adda</span>
                        <span className="text-lg font-black italic text-[#FF4D8D] ml-px">Love</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-gray-300 font-medium">
                    <a href="#" className="hover:text-pink-500 transition-colors border-b-2 border-pink-500 pb-1 text-white">Home</a>
                    <a href="#about" className="hover:text-pink-500 transition-colors">About</a>
                    <a href="#mission" className="hover:text-pink-500 transition-colors">Mission</a>
                    <a href="#vision" className="hover:text-pink-500 transition-colors">Vision</a>
                    <a href="#internship" className="hover:text-pink-500 transition-colors">Internship</a>
                    <a href="#footer" className="hover:text-pink-500 transition-colors">Contact</a>
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center gap-2">
                    Download App
                </button>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                        <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                        <span>Connect • Relax • Feel Better</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        Connect.<br />Relax.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                            Feel Better.
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        AddaLove is a social communication platform that helps people connect, have meaningful conversations, and create positive moments together.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2">
                            Download App <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Hero Image & Floating Elements */}
                <div className="relative">
                    {/* Main Mascot */}
                    <div className="relative z-10 flex justify-center">
                        <img
                            src="https://ik.imagekit.io/vn9p5q5si/99ebd125-88f9-4153-b907-45d3fda3eb83.png"
                            alt="AddaLove Mascot"
                            className="w-full max-w-[450px] object-contain drop-shadow-[0_0_40px_rgba(236,72,153,0.3)] animate-pulse-slow"
                        />
                    </div>

                    {/* Floating UI Elements */}
                    <div className="absolute top-10 left-10 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 z-20 animate-bounce-slow">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center text-xs">👩🏽</div>
                        </div>
                        <span className="text-xs font-medium text-gray-200">Hello!</span>
                    </div>

                    <div className="absolute top-20 right-0 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 z-20">
                        <span className="text-xs font-medium text-gray-200">Great to<br />meet you 💜</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center text-sm">👨🏻</div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4 z-20">
                        <div className="bg-pink-500/20 p-2 rounded-full">
                            <Users className="w-6 h-6 text-pink-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Building Connections</p>
                            <p className="text-lg font-bold">25K+</p>
                            <p className="text-xs text-gray-400">Happy Users</p>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id='about'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">AddaLove?</span>
                        </h2>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                AddaLove is a modern social communication platform designed to help people connect through genuine conversations, friendship, and shared experiences.
                            </p>
                            <p>
                                Whether someone wants to relax after a busy day, meet new people, or simply enjoy a positive conversation, AddaLove provides a welcoming environment where communication comes first.
                            </p>
                            <p>
                                The platform focuses on creating enjoyable and respectful interactions that help people feel connected.
                            </p>
                        </div>

                    </div>

                    {/* Video/Image Card Component */}
                    <div className="bg-[#110D26] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#110D26] via-transparent to-transparent z-10"></div>

                        <div className="relative z-20 mb-32">
                            <h3 className="text-2xl font-bold mb-2">Adda<span className="text-pink-500">Love</span></h3>
                            <p className="text-gray-300 max-w-[200px] text-sm">A place where conversations create connections.</p>
                            <button className="mt-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors border border-white/20">
                                <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                            </button>
                        </div>

                        {/* Simulated background image (using placeholder since original wasn't provided) */}
                        <div className="absolute top-0 right-0 w-full h-full opacity-60 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1529156069898-49953eb1b5e4?auto=format&fit=crop&q=80"
                                alt="Friends laughing"
                                className="w-full h-full object-cover object-right"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#110D26] via-[#110D26]/80 to-transparent"></div>
                        </div>

                        {/* Bottom floating feature badges */}
                        <div className="absolute bottom-6 left-6 right-6 z-20 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { icon: MessageCircle, text: "Meaningful Conversations" },
                                { icon: Shield, text: "Safe & Respectful Community" },
                                { icon: Users, text: "Connect & Make Friends" },
                                { icon: Heart, text: "Relax & Enjoy Every Moment" }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-[#1A1635]/90 backdrop-blur-sm border border-purple-500/20 p-3 rounded-xl flex flex-col items-start gap-2">
                                    <div className="bg-pink-500/20 p-1.5 rounded-lg">
                                        <item.icon className="w-4 h-4 text-pink-500" />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-200 leading-tight">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 border-y border-white/5 bg-[#0A071A]" id='mission'>
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Our <span className="text-pink-500">Mission</span></h2>
                    <p className="text-gray-400 text-sm max-w-xl mx-auto mb-12">
                        We exist to help people overcome loneliness, reduce stress, and bring more joy into everyday life.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {[
                            { icon: Heart, label: "Reduce Loneliness" },
                            { icon: Flower, label: "Reduce Stress" },
                            { icon: Brain, label: "Free Mind" },
                            { icon: Smile, label: "Have Fun" },
                            { icon: Mic, label: "Enjoy Adda" },
                            { icon: Users, label: "Build Connections" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-4 group">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-pink-500/50 group-hover:bg-pink-500/10 transition-all">
                                    <item.icon className="w-7 h-7 text-pink-500" />
                                </div>
                                <span className="text-xs font-medium text-gray-300">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes AddaLove Different */}
            <section className="py-20 px-6 max-w-7xl mx-auto" id='vision'>
                <h2 className="text-3xl font-bold text-center mb-12">
                    What Makes <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">AddaLove</span> Different
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[
                        { icon: MessageCircle, title: "Meaningful Conversations", desc: "Connect with people in a friendly and positive environment." },
                        { icon: Shield, title: "Safe Community", desc: "We encourage respectful communication and positive interactions." },
                        { icon: Flower, title: "Stress Relief", desc: "Take a break from your busy routine and enjoy relaxing conversations." },
                        { icon: Smile, title: "Friendly Atmosphere", desc: "A place where people can smile, laugh, and make new friends." },
                        { icon: Users, title: "Community First", desc: "We believe every interaction should promote kindness and respect." }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-[#110D26] border border-purple-500/20 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-14 h-14 mx-auto bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20 group-hover:bg-pink-500/20 transition-colors">
                                <feature.icon className="w-7 h-7 text-pink-500" />
                            </div>
                            <h3 className="font-semibold mb-3 text-sm">{feature.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Internship Program Section (Centered & Expanded since Verify is removed) */}
            <section className="py-10 px-6 max-w-4xl mx-auto mb-20" id='internship'>
                <div className="bg-gradient-to-br from-[#1A1635] to-[#0D0A1F] border border-purple-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold">Internship Program</h2>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                                At AddaLove, interns gain practical experience while working on real-world projects.
                            </p>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
                                {[
                                    "Product Development", "Graphic Design",
                                    "UI/UX Design", "Video Editing",
                                    "Content Creation", "Web Development",
                                    "Marketing", "Artificial Intelligence",
                                    "Social Media", "Customer Experience"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                        <span className="text-xs text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-4 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors">
                                Learn More
                            </button>
                        </div>

                        {/* 3D Scroll graphic simulation */}
                        <div className="w-48 h-48  rounded-2xl border border-white/10 flex items-center justify-center relative shadow-inner">
                            <img src={latter} alt="" />
                        </div>
                    </div>

                    {/* Decorative Glow */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full z-0"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#05030E] pt-16 pb-8" id='footer'>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="" className='h-8' />
                            <div className="relative flex items-center">
                                <span className="text-lg font-black italic text-transparent bg-clip-text bg-linear-to-r from-[#FF4D8D] to-[#6C3BFF]">Adda</span>
                                <span className="text-lg font-black italic text-[#FF4D8D] ml-px">Love</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Connecting People.</p>
                        <p className="text-sm text-gray-400">Creating Smiles.</p>
                        <p className="text-sm text-gray-400 mb-6">Building Positive Conversations.</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-500 transition-colors">
                                <FingerprintPattern className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-500 transition-colors">
                                <FingerprintPattern className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-500 transition-colors">
                                <FingerprintPattern className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-500 transition-colors">
                                <FingerprintPattern className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-6">Quick Links</h4>
                        <div className="grid gap-x-4 gap-y-3">

                            <Link onClick={() => {
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth',
                                });
                            }} to="/PrivacyPolicy" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Privacy Polic</Link>
                            <Link  onClick={() => {
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth',
                                });
                            }} to="/termsAndconditions" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Terms & Conditionsy</Link>


                            <Link onClick={() => {
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth',
                                });
                            }} to="/communityguidelines" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Community Guidelines</Link>

                        </div>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="font-semibold mb-6">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-purple-500" />
                                <a href="mailto:hello@addalove.com"><span className="text-sm text-gray-400">hello@addalove.com</span></a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-purple-500" />
                               <a href="tel:9477723538"><span className="text-sm text-gray-400">+91 9477723538</span></a> 
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-gray-400">www.addalove.com</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="text-center text-[15px] text-gray-500 pt-8 border-t border-white/5">
                    © 2026 AddaLove. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AddaLoveLandingPage;