import React, { useState } from 'react';
import { 
  Scale, FileText, UserCheck, ShieldAlert, 
  Ban, Heart, Image as ImageIcon, Briefcase, 
  CheckSquare, Lock, Activity, AlertTriangle, 
  Globe, Link, Settings, RefreshCw, MapPin, 
  Phone, CheckCircle2, ChevronRight 
} from 'lucide-react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', title: '1. About AddaLove', icon: Heart },
    { id: 'eligibility', title: '2. Eligibility', icon: UserCheck },
    { id: 'account', title: '3. User Account', icon: FileText },
    { id: 'acceptable-use', title: '4. Acceptable Use', icon: CheckCircle2 },
    { id: 'prohibited', title: '5. Prohibited Activities', icon: Ban },
    { id: 'respectful', title: '6. Respectful Community', icon: Heart },
    { id: 'content', title: '7. User Content', icon: ImageIcon },
    { id: 'ip', title: '8. Intellectual Property', icon: ShieldAlert },
    { id: 'internship', title: '9. Internship Program', icon: Briefcase },
    { id: 'verification', title: '10. Certificate Verification', icon: CheckSquare },
    { id: 'privacy', title: '11. Privacy', icon: Lock },
    { id: 'availability', title: '12. Platform Availability', icon: Activity },
    { id: 'suspension', title: '13. Account Suspension', icon: AlertTriangle },
    { id: 'liability', title: '14. Limitation of Liability', icon: Scale },
    { id: 'disclaimer', title: '15. Disclaimer', icon: AlertTriangle },
    { id: 'third-party', title: '16. Third-Party Services', icon: Link },
    { id: 'platform-changes', title: '17. Changes to Platform', icon: Settings },
    { id: 'terms-changes', title: '18. Changes to Terms', icon: RefreshCw },
    { id: 'governing-law', title: '19. Governing Law', icon: Globe },
    { id: 'contact', title: '20. Contact', icon: Phone },
    { id: 'acceptance', title: '21. Acceptance', icon: CheckCircle2 },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const Cite = () => <span className="text-gray-600/50 text-[10px] ml-1 select-none"></span>;

  return (
    <div className="min-h-screen bg-[#070514] text-gray-300 font-sans selection:bg-pink-500/30">
      
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Scale className="w-8 h-8 text-pink-500" />
              Terms & Conditions <Cite />
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Effective Date: August 2026 <Cite /> | Last Updated: August 2026 <Cite />
            </p>
          </div>
          <div className="text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-right">
            <p>Version: 1.0 <Cite /></p>
            <p>Document Owner: AddaLove <Cite /></p>
            <p className="text-gray-500">Applicable To: Website, Mobile Application, Internship Program, and Related Services <Cite /></p>
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
                  <section.icon className={`w-4 h-4 flex-shrink-0 ${activeSection === section.id ? 'text-pink-400' : 'text-gray-500'}`} />
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
              <p className="text-lg leading-relaxed mb-4">
                Welcome to AddaLove. <Cite />
              </p>
              <p className="mb-4">
                These Terms & Conditions ("Terms") govern your access to and use of the AddaLove website, mobile application, and related services. <Cite />
              </p>
              <p className="font-medium text-white">
                By accessing or using AddaLove, you agree to be bound by these Terms. <Cite /> If you do not agree, please do not use our platform. <Cite />
              </p>
            </section>

            {/* 1. About AddaLove */}
            <section id="about" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">1.</span> About AddaLove <Cite />
              </h2>
              <p className="leading-relaxed">
                AddaLove is a social communication platform designed to help people connect through meaningful conversations, reduce loneliness, relax, enjoy positive interactions, and become part of a respectful community. <Cite />
              </p>
            </section>

            {/* 2 & 3 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="eligibility" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">2.</span> Eligibility <Cite />
                </h2>
                <p className="mb-4">To use AddaLove, you must: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-2 marker:text-pink-500">
                  <li>Be at least 18 years old or the minimum legal age required in your jurisdiction. <Cite /></li>
                  <li>Have the legal capacity to accept these Terms. <Cite /></li>
                  <li>Provide accurate information during registration. <Cite /></li>
                  <li>Use the platform only for lawful purposes. <Cite /></li>
                </ul>
              </section>

              <section id="account" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">3.</span> User Account <Cite />
                </h2>
                <p className="mb-4">You are responsible for: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-2 marker:text-pink-500 mb-4">
                  <li>Keeping your login credentials secure. <Cite /></li>
                  <li>Maintaining accurate account information. <Cite /></li>
                  <li>All activities that occur under your account. <Cite /></li>
                  <li>Immediately notifying us if you suspect unauthorized access. <Cite /></li>
                </ul>
                <p className="text-sm italic text-gray-400">We reserve the right to suspend or terminate accounts that violate these Terms. <Cite /></p>
              </section>
            </div>

            {/* 4. Acceptable Use */}
            <section id="acceptable-use" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">4.</span> Acceptable Use <Cite />
              </h2>
              <p className="mb-4">Users agree to use AddaLove respectfully and responsibly. <Cite /> You may use the platform to: <Cite /></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Meet new people <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Build friendships <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Have positive conversations <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Relax and socialize <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Participate in community activities <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Join internship-related programs <Cite /></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Verify internship certificates <Cite /></div>
              </div>
            </section>

            {/* 5. Prohibited Activities */}
            <section id="prohibited" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">5.</span> Prohibited Activities <Cite />
              </h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <p className="mb-4 font-semibold text-red-400">The following activities are strictly prohibited: <Cite /></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-6">
                  {["Harassment or bullying", "Hate speech", "Threats or intimidation", "Impersonating another person", "Creating fake accounts", "Sharing misleading information", "Posting illegal content", "Distributing malware or harmful software", "Spamming users", "Violating another person's privacy", "Uploading copyrighted material without permission", "Attempting to gain unauthorized access to the platform", "Interfering with platform security"].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>{item} <Cite /></span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-red-300 border-t border-red-500/20 pt-4">
                  Violation of these rules may result in immediate account suspension or permanent removal. <Cite />
                </p>
              </div>
            </section>

            {/* 6 & 7 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="respectful" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">6.</span> Respectful Community <Cite />
                </h2>
                <p className="mb-4">Every user is expected to: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-2 marker:text-pink-500">
                  <li>Treat others with respect. <Cite /></li>
                  <li>Communicate politely. <Cite /></li>
                  <li>Respect personal boundaries. <Cite /></li>
                  <li>Avoid offensive behavior. <Cite /></li>
                  <li>Help create a positive environment. <Cite /></li>
                </ul>
              </section>

              <section id="content" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">7.</span> User Content <Cite />
                </h2>
                <p className="mb-3 text-sm">You remain the owner of the content you upload. <Cite /></p>
                <p className="mb-3 text-sm">By posting content on AddaLove, you grant us a limited, non-exclusive license to display, store, and process that content solely for operating and improving the platform. <Cite /></p>
                <p className="text-sm text-gray-400 italic">You are responsible for ensuring that your content does not violate any law or third-party rights. <Cite /></p>
              </section>
            </div>

            {/* 8. Intellectual Property */}
            <section id="ip" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">8.</span> Intellectual Property <Cite />
              </h2>
              <p className="mb-4">All platform content including: <Cite /></p>
              <div className="flex flex-wrap gap-3 mb-6">
                {["Logo", "Mascot (Addy)", "Website design", "Mobile application", "Graphics", "Animations", "Branding", "Text", "Icons", "Software"].map((item, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium">
                    {item} <Cite />
                  </span>
                ))}
              </div>
              <p className="mb-2">are the intellectual property of AddaLove unless otherwise stated. <Cite /></p>
              <p className="text-sm font-medium text-pink-400">Unauthorized copying, modification, or redistribution is prohibited. <Cite /></p>
            </section>

            {/* 9 & 10 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="internship" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">9.</span> Internship Program <Cite />
                </h2>
                <p className="mb-3 text-sm">AddaLove may offer internship opportunities for educational and practical learning. <Cite /></p>
                <p className="mb-3 text-sm">Participation in internship programs does not automatically create an employment relationship. <Cite /></p>
                <p className="text-sm">Internship certificates are issued according to our internship policies and may be verified through our official certificate verification system. <Cite /></p>
              </section>

              <section id="verification" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">10.</span> Certificate Verification <Cite />
                </h2>
                <p className="mb-3 text-sm">Internship certificates issued by AddaLove may include a QR code or verification ID. <Cite /></p>
                <p className="mb-3 text-sm">Users and organizations should verify certificates only through the official AddaLove verification page. <Cite /></p>
                <p className="text-sm font-medium text-red-300">Any attempt to forge, alter, duplicate, or misuse certificates is strictly prohibited. <Cite /></p>
              </section>
            </div>

            {/* 11 & 12 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="privacy" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">11.</span> Privacy <Cite />
                </h2>
                <p className="mb-3 text-sm">Your use of AddaLove is also governed by our Privacy Policy. <Cite /></p>
                <p className="text-sm">Please review the Privacy Policy to understand how your information is collected and protected. <Cite /></p>
              </section>

              <section id="availability" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">12.</span> Platform Availability <Cite />
                </h2>
                <p className="mb-3 text-sm">We strive to keep AddaLove available at all times. <Cite /> However, we do not guarantee uninterrupted access. <Cite /></p>
                <p className="mb-2 text-sm">The platform may occasionally be unavailable due to: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1 marker:text-pink-500">
                  <li>Maintenance <Cite /></li>
                  <li>Technical upgrades <Cite /></li>
                  <li>Server issues <Cite /></li>
                  <li>Security improvements <Cite /></li>
                  <li>Force majeure events <Cite /></li>
                </ul>
              </section>
            </div>

            {/* 13. Account Suspension */}
            <section id="suspension" className="scroll-mt-32 bg-black/20 border border-white/5 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">13.</span> Account Suspension <Cite />
              </h2>
              <p className="mb-4">We may suspend or permanently terminate an account if: <Cite /></p>
              <div className="flex flex-wrap gap-3 mb-6">
                {["These Terms are violated.", "Illegal activity is detected.", "Fake identity is used.", "Community safety is threatened.", "Platform abuse is identified.", "Fraudulent behavior is suspected."].map((item, idx) => (
                  <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-1.5 rounded-md text-sm">
                    {item} <Cite />
                  </span>
                ))}
              </div>
              <p className="text-sm italic text-gray-400">Our decisions are made with the objective of protecting the community and platform integrity. <Cite /></p>
            </section>

            {/* 14 & 15 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="liability" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">14.</span> Limitation of Liability <Cite />
                </h2>
                <p className="mb-3 text-sm font-medium text-white">To the maximum extent permitted by law: <Cite /></p>
                <p className="mb-3 text-sm">AddaLove shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the platform. <Cite /></p>
                <p className="text-sm">Users are responsible for their own interactions and decisions made while using the platform. <Cite /></p>
              </section>

              <section id="disclaimer" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">15.</span> Disclaimer <Cite />
                </h2>
                <p className="mb-3 text-sm">AddaLove provides a communication platform. <Cite /> We do not guarantee: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-pink-500 mb-4">
                  <li>Continuous availability <Cite /></li>
                  <li>Specific outcomes from conversations <Cite /></li>
                  <li>Compatibility between users <Cite /></li>
                  <li>Accuracy of user-generated content <Cite /></li>
                </ul>
                <p className="text-sm italic text-gray-400">Users should exercise their own judgment while interacting with others. <Cite /></p>
              </section>
            </div>

            {/* 16, 17, 18 */}
            <div className="space-y-8 bg-black/20 p-6 rounded-2xl border border-white/5">
              <section id="third-party" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-500">16.</span> Third-Party Services <Cite />
                </h2>
                <p className="text-sm text-gray-400">Our platform may integrate with trusted third-party services. <Cite /> Those services operate under their own terms and privacy policies. <Cite /> AddaLove is not responsible for third-party content or practices. <Cite /></p>
              </section>

              <section id="platform-changes" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-500">17.</span> Changes to the Platform <Cite />
                </h2>
                <p className="text-sm text-gray-400 mb-2">We may modify: <Cite /></p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Features", "Design", "Services", "Community standards", "Policies"].map((item, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-xs">{item} <Cite /></span>
                  ))}
                </div>
                <p className="text-sm text-gray-400">at any time to improve the user experience or comply with legal requirements. <Cite /></p>
              </section>

              <section id="terms-changes" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-500">18.</span> Changes to These Terms <Cite />
                </h2>
                <p className="text-sm text-gray-400">These Terms may be updated periodically. <Cite /> Continued use of AddaLove after changes become effective constitutes acceptance of the revised Terms. <Cite /></p>
              </section>
            </div>

            {/* 19 & 20 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="governing-law" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">19.</span> Governing Law <Cite />
                </h2>
                <p className="text-sm mb-2">These Terms shall be governed by and interpreted in accordance with the laws of the Republic of India. <Cite /></p>
                <p className="text-sm text-gray-400">Any disputes shall be subject to the jurisdiction of the competent courts in India. <Cite /></p>
              </section>

              <section id="contact" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">20.</span> Contact <Cite />
                </h2>
                <p className="text-sm">For questions regarding these Terms & Conditions, please contact AddaLove through the official contact information available on our website. <Cite /></p>
              </section>
            </div>

            {/* 21. Acceptance */}
            <section id="acceptance" className="pt-10 border-t border-white/10 text-center max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                <h2 className="text-2xl font-bold mb-4 text-white flex justify-center items-center gap-2">
                  <span className="text-pink-500">21.</span> Acceptance <Cite />
                </h2>
                <p className="mb-6 text-gray-300 font-medium">
                  By accessing or using AddaLove, you confirm that: <Cite />
                </p>
                <ul className="text-sm space-y-3 mb-6 text-left max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>You have read these Terms & Conditions. <Cite /></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>You understand them. <Cite /></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>You agree to comply with them. <Cite /></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>You agree to use the platform responsibly and respectfully. <Cite /></span>
                  </li>
                </ul>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsAndConditions;