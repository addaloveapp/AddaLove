import React, { useState } from 'react';
import { Shield, Lock, FileText, Server, Users, Globe, Mail, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', title: '1. About AddaLove', icon: Users },
    { id: 'collect', title: '2. Information We Collect', icon: FileText },
    { id: 'not-collect', title: '3. Information We Do NOT Collect', icon: Shield },
    { id: 'use', title: '4. How We Use Your Information', icon: Server },
    { id: 'communications', title: '5. Communications', icon: Mail },
    { id: 'cookies', title: '6. Cookies & Technologies', icon: Globe },
    { id: 'security', title: '7. Data Security', icon: Lock },
    // Abridged list for sidebar readability, full list is in content
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const Cite = () => <span className="text-gray-600/50 text-[10px] ml-1 select-none">[cite: 1]</span>;

  return (
    <div className="min-h-screen bg-[#070514] text-gray-300 font-sans selection:bg-pink-500/30">
      
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-pink-500" />
              Privacy Policy <Cite />
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Effective Date: August 2026 <Cite /> | Last Updated: August 2026 <Cite />
            </p>
          </div>
          <div className="text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-right">
            <p>Version: 1.0 <Cite /></p>
            <p>Document Owner: AddaLove <Cite /></p>
            <p className="text-gray-500">Applicable To: Website, Mobile Application, and Related Services <Cite /></p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4 flex-shrink-0">
          <div className="sticky top-32 bg-[#110D26]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 px-4">Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-white font-medium'
                      : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-pink-400' : 'text-gray-500'}`} />
                  <span className="truncate">{section.title}</span>
                  {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto text-pink-500/50" />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:w-3/4 bg-[#110D26]/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none space-y-12">
            
            {/* Intro */}
            <section className="pb-8 border-b border-white/10">
              <p className="text-lg leading-relaxed">
                Welcome to AddaLove. <Cite /> Your privacy is important to us. <Cite /> This Privacy Policy explains how AddaLove collects, uses, protects, and manages your information when you access our website, mobile application, and related services. <Cite /> By using AddaLove, you agree to the practices described in this Privacy Policy. <Cite />
              </p>
            </section>

            {/* 1. About AddaLove */}
            <section id="about" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">1.</span> About AddaLove <Cite />
              </h2>
              <p className="leading-relaxed">
                AddaLove is a social communication platform designed to help people build meaningful conversations, reduce loneliness, relax, enjoy positive interactions, and become part of a respectful community. <Cite /> We are committed to creating a safe, friendly, and privacy-focused environment for everyone. <Cite />
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="collect" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">2.</span> Information We Collect <Cite />
              </h2>
              <p className="mb-6">To provide our services, we may collect certain information. <Cite /></p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-3">Personal Information <Cite /></h3>
                  <p className="text-sm mb-3">When creating an account, you may provide: <Cite /></p>
                  <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-pink-500">
                    <li>Full Name <Cite /></li>
                    <li>Username <Cite /></li>
                    <li>Profile Photo <Cite /></li>
                    <li>Date of Birth <Cite /></li>
                    <li>Gender (optional) <Cite /></li>
                    <li>Email Address <Cite /></li>
                    <li>Mobile Number (if required) <Cite /></li>
                    <li>Country <Cite /></li>
                    <li>Language Preference <Cite /></li>
                  </ul>
                </div>

                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-3">Profile Information <Cite /></h3>
                  <p className="text-sm mb-3">You may also choose to share: <Cite /></p>
                  <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-pink-500">
                    <li>Bio <Cite /></li>
                    <li>Interests <Cite /></li>
                    <li>Hobbies <Cite /></li>
                    <li>Favorite Topics <Cite /></li>
                    <li>Profile Images <Cite /></li>
                    <li>Social Preferences <Cite /></li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-4 italic">Providing this information is optional. <Cite /></p>
                </div>

                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-3">Device Information <Cite /></h3>
                  <p className="text-sm mb-3">We may automatically collect: <Cite /></p>
                  <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-purple-500">
                    <li>Device Type <Cite /></li>
                    <li>Operating System <Cite /></li>
                    <li>Browser Information <Cite /></li>
                    <li>App Version <Cite /></li>
                    <li>Language <Cite /></li>
                    <li>Device Identifier <Cite /></li>
                    <li>IP Address <Cite /></li>
                    <li>Time Zone <Cite /></li>
                  </ul>
                </div>

                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-3">Usage Information <Cite /></h3>
                  <p className="text-sm mb-3">We may collect information regarding: <Cite /></p>
                  <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-purple-500">
                    <li>Login Activity <Cite /></li>
                    <li>Session Duration <Cite /></li>
                    <li>Features Used <Cite /></li>
                    <li>Pages Visited <Cite /></li>
                    <li>Click Activity <Cite /></li>
                    <li>Search Activity <Cite /></li>
                    <li>Crash Reports <Cite /></li>
                    <li>Performance Logs <Cite /></li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-4 italic">This information helps improve our platform. <Cite /></p>
                </div>
              </div>
            </section>

            {/* 3. Information We Do NOT Collect */}
            <section id="not-collect" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">3.</span> Information We Do NOT Collect <Cite />
              </h2>
              <p className="mb-4">We do not intentionally collect: <Cite /></p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Biometric Information <Cite /></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Health Records <Cite /></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Government Identity Documents (unless legally required) <Cite /></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Financial Account Details beyond what is necessary for secure payment processing through authorized service providers <Cite /></span>
                </li>
              </ul>
            </section>

            {/* 4. How We Use Your Information */}
            <section id="use" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">4.</span> How We Use Your Information <Cite />
              </h2>
              <p className="mb-4">We use collected information to: <Cite /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Create and manage your account <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Improve user experience <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Personalize recommendations <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Improve platform performance <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Detect abuse and suspicious activity <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Maintain community safety <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Respond to customer support requests <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Verify account ownership <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Improve security <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>Prevent fraud <Cite /></div>
              </div>
            </section>

            {/* 5. Communications */}
            <section id="communications" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">5.</span> Communications <Cite />
              </h2>
              <p className="mb-4">We may send: <Cite /></p>
              <ul className="list-disc list-inside text-sm space-y-2 mb-4 marker:text-pink-500">
                <li>Account notifications <Cite /></li>
                <li>Security alerts <Cite /></li>
                <li>Password reset emails <Cite /></li>
                <li>Important policy updates <Cite /></li>
                <li>Feature announcements <Cite /></li>
                <li>Customer support responses <Cite /></li>
              </ul>
              <p className="text-sm italic">You may opt out of promotional communications where applicable. <Cite /></p>
            </section>

            {/* 6. Cookies and Similar Technologies */}
            <section id="cookies" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">6.</span> Cookies and Similar Technologies <Cite />
              </h2>
              <p className="mb-4">Our website may use cookies to: <Cite /></p>
              <ul className="list-disc list-inside text-sm space-y-2 mb-4 marker:text-pink-500">
                <li>Keep you logged in <Cite /></li>
                <li>Remember preferences <Cite /></li>
                <li>Improve website performance <Cite /></li>
                <li>Analyze website traffic <Cite /></li>
                <li>Enhance user experience <Cite /></li>
              </ul>
              <p className="text-sm italic">You may disable cookies through your browser settings. <Cite /></p>
            </section>

            {/* 7. Data Security */}
            <section id="security" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">7.</span> Data Security <Cite />
              </h2>
              <p className="mb-4 font-medium text-white">Protecting your information is one of our highest priorities. <Cite /></p>
              <p className="mb-4">We implement industry-standard security measures including: <Cite /></p>
              <div className="flex flex-wrap gap-3 mb-6">
                {["Encryption where appropriate", "Secure servers", "Access controls", "Security monitoring", "Regular software updates", "Protection against unauthorized access"].map((item, idx) => (
                  <span key={idx} className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full text-xs">
                    {item} <Cite />
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 border-l-2 border-pink-500 pl-4">
                While we work to protect your information, no internet-based service can guarantee absolute security. <Cite />
              </p>
            </section>

            {/* 8. Privacy by Design */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">8.</span> Privacy by Design <Cite />
              </h2>
              <p className="mb-4">AddaLove is built with privacy in mind. <Cite /> We strive to: <Cite /></p>
              <ul className="list-disc list-inside text-sm space-y-2 marker:text-pink-500">
                <li>Minimize unnecessary data collection <Cite /></li>
                <li>Limit access to personal information <Cite /></li>
                <li>Protect user privacy <Cite /></li>
                <li>Continuously improve security practices <Cite /></li>
              </ul>
            </section>

            {/* 9. Sharing Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">9.</span> Sharing Information <Cite />
              </h2>
              <p className="mb-4 font-medium text-white bg-white/5 border border-white/10 p-4 rounded-xl inline-block">
                We do not sell your personal information. <Cite />
              </p>
              <p className="mb-4 mt-2">We may share limited information only when necessary: <Cite /></p>
              <ul className="list-disc list-inside text-sm space-y-2 mb-4 marker:text-pink-500">
                <li>With trusted service providers that help operate our platform <Cite /></li>
                <li>When required by applicable law <Cite /></li>
                <li>To comply with legal obligations <Cite /></li>
                <li>To protect the safety of users <Cite /></li>
                <li>To investigate fraud or abuse <Cite /></li>
                <li>During business transfers such as mergers or acquisitions <Cite /></li>
              </ul>
              <p className="text-sm italic text-gray-400">All service providers are expected to maintain appropriate security standards. <Cite /></p>
            </section>

            {/* 10. Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">10.</span> Children's Privacy <Cite />
              </h2>
              <p className="mb-3">AddaLove is intended only for individuals who meet the minimum legal age required under applicable laws. <Cite /></p>
              <p className="mb-3">We do not knowingly collect personal information from children who are not permitted to use the platform. <Cite /></p>
              <p>If we become aware of such information, it will be removed promptly. <Cite /></p>
            </section>

            {/* 11 & 12. Responsibilities & Security */}
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">11.</span> User Responsibilities <Cite />
                </h2>
                <p className="mb-4">Users are responsible for: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-2 marker:text-pink-500">
                  <li>Keeping passwords secure <Cite /></li>
                  <li>Maintaining accurate account information <Cite /></li>
                  <li>Respecting the privacy of others <Cite /></li>
                  <li>Reporting suspicious activity <Cite /></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">12.</span> Account Security <Cite />
                </h2>
                <p className="mb-3">You are responsible for protecting your account credentials. <Cite /></p>
                <p>If you believe your account has been compromised, please contact us immediately. <Cite /></p>
              </section>
            </div>

            {/* 13. Data Retention */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">13.</span> Data Retention <Cite />
              </h2>
              <p className="mb-4">We retain information only as long as necessary to: <Cite /></p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Provide our services", "Meet legal obligations", "Resolve disputes", "Enforce our policies", "Improve platform security"].map((item, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-sm">
                    {item} <Cite />
                  </span>
                ))}
              </div>
              <p className="text-sm">Information that is no longer required may be securely deleted or anonymized. <Cite /></p>
            </section>

            {/* 14. Your Rights */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">14.</span> Your Rights <Cite />
              </h2>
              <p className="mb-4">Depending on your location and applicable laws, you may have the right to: <Cite /></p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm list-inside list-disc marker:text-pink-500">
                <li>Access your information <Cite /></li>
                <li>Correct inaccurate information <Cite /></li>
                <li>Update your profile <Cite /></li>
                <li>Delete your account <Cite /></li>
                <li>Request deletion of personal data where applicable <Cite /></li>
                <li>Withdraw certain permissions <Cite /></li>
                <li>Contact us regarding privacy concerns <Cite /></li>
              </ul>
            </section>

            {/* 15, 16 & 17 */}
            <div className="space-y-8 bg-black/20 p-6 rounded-2xl border border-white/5">
              <section>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-500">15.</span> Third-Party Services <Cite />
                </h2>
                <p className="text-sm text-gray-400">Our platform may integrate with trusted third-party services. <Cite /> These services operate under their own privacy policies. <Cite /> We encourage users to review those policies before using such services. <Cite /></p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-500">16.</span> International Users <Cite />
                </h2>
                <p className="text-sm text-gray-400">If you access AddaLove from outside India, your information may be processed in accordance with applicable laws and this Privacy Policy. <Cite /></p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-500">17.</span> Changes to This Privacy Policy <Cite />
                </h2>
                <p className="text-sm text-gray-400">We may update this Privacy Policy from time to time. <Cite /> If significant changes are made, we will notify users through appropriate channels. <Cite /> The updated version will include a revised "Last Updated" date. <Cite /></p>
              </section>
            </div>

            {/* 18. Contact Us */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">18.</span> Contact Us <Cite />
              </h2>
              <p className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 rounded-2xl border border-pink-500/20">
                If you have questions regarding this Privacy Policy, you may contact us through the official AddaLove support channels listed on our website. <Cite />
              </p>
            </section>

            {/* 19. Our Commitment */}
            <section className="pt-8 border-t border-white/10 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">Our Commitment <Cite /></h2>
              <p className="text-lg leading-relaxed text-gray-300 italic">
                "At AddaLove, we believe privacy is built on trust. <Cite /> Our goal is to create a respectful, secure, and welcoming environment where people can connect, relax, enjoy positive conversations, and build meaningful relationships while maintaining control over their personal information." <Cite />
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;