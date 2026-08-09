import React, { useState } from 'react';
import { 
  Heart, Shield, MessageCircle, AlertTriangle, UserX, 
  EyeOff, UserCheck, MailX, Copyright, Image, 
  Smile, Flag, Settings, ShieldCheck, Users, RefreshCw, Phone 
} from 'lucide-react';

const CommunityGuidelines = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'values', title: '1. Our Community Values', icon: Heart },
    { id: 'respect', title: '2. Be Respectful', icon: Users },
    { id: 'harassment', title: '3. No Harassment', icon: UserX },
    { id: 'hate-speech', title: '4. No Hate Speech', icon: MessageCircle },
    { id: 'violence', title: '5. No Violence or Threats', icon: AlertTriangle },
    { id: 'privacy', title: '6. Protect Privacy', icon: EyeOff },
    { id: 'honest', title: '7. Be Honest', icon: UserCheck },
    { id: 'spam', title: '8. No Spam', icon: MailX },
    { id: 'ip', title: '9. Intellectual Property', icon: Copyright },
    { id: 'content', title: '10. Appropriate Content', icon: Image },
    { id: 'positive', title: '11. Positive Conversations', icon: Smile },
    { id: 'report', title: '12. Report Problems', icon: Flag },
    { id: 'moderation', title: '13. Community Moderation', icon: Settings },
    { id: 'safety', title: '14. Safety First', icon: ShieldCheck },
    { id: 'better', title: '15. Build a Better Community', icon: Heart },
    { id: 'changes', title: '16. Changes to Guidelines', icon: RefreshCw },
    { id: 'contact', title: '17. Contact Us', icon: Phone },
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
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
              Community Guidelines <Cite />
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
        <aside className="lg:w-1/4 shrink-0">
          <div className="sticky top-32 bg-[#110D26]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 px-4">Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${
                    activeSection === section.id
                      ? 'bg-linear-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-white font-medium'
                      : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <section.icon className={`w-4 h-4 shrink-0 ${activeSection === section.id ? 'text-pink-400' : 'text-gray-500'}`} />
                  <span className="truncate">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:w-3/4 bg-[#110D26]/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none space-y-12">
            
            {/* Intro */}
            <section id="intro" className="pb-8 border-b border-white/10">
              <p className="text-lg leading-relaxed">
                Welcome to AddaLove. <Cite /> Our goal is to create a safe, friendly, respectful, and positive community where everyone can enjoy meaningful conversations, build friendships, and relax in a welcoming environment. <Cite /> These Community Guidelines explain the behavior we expect from every member. <Cite />
              </p>
            </section>

            {/* 1. Our Community Values */}
            <section id="values" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">1.</span> Our Community Values <Cite />
              </h2>
              <p className="mb-4">Every conversation on AddaLove should reflect our core values: <Cite /></p>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="bg-black/30 border border-white/5 px-4 py-2 rounded-xl text-sm">❤️ Respect <Cite /></span>
                <span className="bg-black/30 border border-white/5 px-4 py-2 rounded-xl text-sm">🤝 Kindness <Cite /></span>
                <span className="bg-black/30 border border-white/5 px-4 py-2 rounded-xl text-sm">😊 Positivity <Cite /></span>
                <span className="bg-black/30 border border-white/5 px-4 py-2 rounded-xl text-sm">🌍 Inclusiveness <Cite /></span>
                <span className="bg-black/30 border border-white/5 px-4 py-2 rounded-xl text-sm">🔒 Privacy <Cite /></span>
              </div>
              <p className="text-sm italic">We encourage everyone to treat others the way they would like to be treated. <Cite /></p>
            </section>

            {/* 2. Be Respectful */}
            <section id="respect" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">2.</span> Be Respectful <Cite />
              </h2>
              <p className="mb-4">Respect is the foundation of AddaLove. <Cite /> Please: <Cite /></p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm list-inside list-disc marker:text-pink-500">
                <li>Be polite and friendly. <Cite /></li>
                <li>Respect different opinions. <Cite /></li>
                <li>Respect personal boundaries. <Cite /></li>
                <li>Use appropriate language. <Cite /></li>
                <li>Listen before reacting. <Cite /></li>
                <li>Encourage positive conversations. <Cite /></li>
              </ul>
            </section>

            {/* 3. No Harassment */}
            <section id="harassment" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">3.</span> No Harassment <Cite />
              </h2>
              <p className="mb-4 font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg inline-block">
                Harassment of any kind is not allowed. <Cite />
              </p>
              <p className="mb-3 mt-2">Examples include: <Cite /></p>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {["Personal attacks", "Repeated unwanted contact", "Bullying", "Intimidation", "Insults", "Humiliation", "Stalking", "Threatening behavior"].map((item, idx) => (
                  <li key={idx} className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-center">
                    {item} <Cite />
                  </li>
                ))}
              </ul>
            </section>

            {/* 4 & 5 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="hate-speech" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">4.</span> No Hate Speech <Cite />
                </h2>
                <p className="mb-3">We do not allow content that promotes hatred or discrimination based on protected characteristics. <Cite /></p>
                <p className="text-sm italic text-gray-400">Treat every member with dignity and respect. <Cite /></p>
              </section>

              <section id="violence" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">5.</span> No Violence or Threats <Cite />
                </h2>
                <p className="mb-3">Do not: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-red-500">
                  <li>Encourage violence. <Cite /></li>
                  <li>Threaten others. <Cite /></li>
                  <li>Promote dangerous activities. <Cite /></li>
                  <li>Celebrate harmful behavior. <Cite /></li>
                </ul>
              </section>
            </div>

            {/* 6 & 7 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="privacy" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">6.</span> Protect Privacy <Cite />
                </h2>
                <p className="mb-3 font-medium">Respect the privacy of everyone. <Cite /></p>
                <p className="mb-2 text-sm">Do not: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-pink-500">
                  <li>Share someone else's personal information without permission. <Cite /></li>
                  <li>Publish private conversations. <Cite /></li>
                  <li>Attempt to obtain confidential information from other users. <Cite /></li>
                </ul>
              </section>

              <section id="honest" className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-pink-500">7.</span> Be Honest <Cite />
                </h2>
                <p className="mb-3 text-sm">Always use your real identity or a genuine profile that does not impersonate another person. <Cite /></p>
                <p className="mb-2 text-sm">Do not: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1.5 marker:text-pink-500">
                  <li>Pretend to be someone else. <Cite /></li>
                  <li>Mislead other users. <Cite /></li>
                  <li>Create fake accounts to deceive others. <Cite /></li>
                </ul>
              </section>
            </div>

            {/* 8. No Spam */}
            <section id="spam" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">8.</span> No Spam <Cite />
              </h2>
              <p className="mb-4">Please avoid: <Cite /></p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Repetitive messages.", "Unwanted advertising.", "Promotional spam.", "Mass messaging.", "Misleading links."].map((item, idx) => (
                  <span key={idx} className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full text-xs">
                    {item} <Cite />
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium">Keep conversations meaningful. <Cite /></p>
            </section>

            {/* 9. Respect Intellectual Property */}
            <section id="ip" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">9.</span> Respect Intellectual Property <Cite />
              </h2>
              <p className="mb-2">Only upload content that you own or have permission to use. <Cite /></p>
              <p className="text-sm text-gray-400">Respect the copyrights, trademarks, and intellectual property rights of others. <Cite /></p>
            </section>

            {/* 10. Appropriate Content */}
            <section id="content" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">10.</span> Appropriate Content <Cite />
              </h2>
              <p className="mb-4">Share content that contributes positively to the community. <Cite /> Avoid posting content that is: <Cite /></p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {["Illegal", "Harmful", "Offensive", "Extremely violent", "Graphic", "Sexually explicit", "Fraudulent", "Misleading"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {item} <Cite />
                  </div>
                ))}
              </div>
            </section>

            {/* 11. Positive Conversations */}
            <section id="positive" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">11.</span> Positive Conversations <Cite />
              </h2>
              <p className="mb-4">AddaLove exists to help people: <Cite /></p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm list-inside list-disc marker:text-pink-500 mb-4">
                <li>Feel connected. <Cite /></li>
                <li>Reduce loneliness. <Cite /></li>
                <li>Relax after a busy day. <Cite /></li>
                <li>Build friendships. <Cite /></li>
                <li>Enjoy meaningful conversations. <Cite /></li>
                <li>Create positive experiences. <Cite /></li>
              </ul>
              <p className="text-sm italic bg-pink-500/10 border border-pink-500/20 inline-block px-4 py-2 rounded-lg text-pink-300">
                Help us achieve this mission by spreading kindness. <Cite />
              </p>
            </section>

            {/* 12, 13, 14 */}
            <div className="space-y-8 bg-black/20 p-6 rounded-2xl border border-white/5">
              <section id="report" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">12.</span> Report Problems <Cite />
                </h2>
                <p className="text-sm mb-2">If you experience or witness behavior that violates these Guidelines, please report it using the available reporting tools or contact our support team. <Cite /></p>
                <p className="text-xs text-gray-400">Reports help us maintain a safe and respectful community. <Cite /></p>
              </section>

              <section id="moderation" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">13.</span> Community Moderation <Cite />
                </h2>
                <p className="text-sm mb-3">To protect our users, AddaLove may review reports and take appropriate action when Community Guidelines are violated. <Cite /> Possible actions may include: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1 marker:text-pink-500 mb-3">
                  <li>Warning <Cite /></li>
                  <li>Content removal <Cite /></li>
                  <li>Temporary account restrictions <Cite /></li>
                  <li>Permanent account suspension <Cite /></li>
                </ul>
                <p className="text-xs text-gray-400">The action taken will depend on the nature and severity of the violation. <Cite /></p>
              </section>

              <section id="safety" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">14.</span> Safety First <Cite />
                </h2>
                <p className="text-sm font-medium mb-3">Your safety matters. <Cite /> Please: <Cite /></p>
                <ul className="list-disc list-inside text-sm space-y-1 marker:text-pink-500">
                  <li>Think before sharing personal information. <Cite /></li>
                  <li>Be cautious when interacting with new people. <Cite /></li>
                  <li>Respect your own boundaries and those of others. <Cite /></li>
                  <li>Report suspicious activity. <Cite /></li>
                </ul>
              </section>
            </div>

            {/* 15. Help Build a Better Community */}
            <section id="better" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-pink-500">15.</span> Help Build a Better Community <Cite />
              </h2>
              <p className="mb-3">Every member plays an important role. <Cite /></p>
              <p className="mb-3 text-sm">A positive message, a respectful conversation, or a simple act of kindness can make someone's day better. <Cite /></p>
              <p className="text-sm text-gray-400">Together, we can build a community based on respect, trust, and genuine human connection. <Cite /></p>
            </section>

            {/* 16 & 17 */}
            <div className="grid md:grid-cols-2 gap-8">
              <section id="changes" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">16.</span> Changes to These Guidelines <Cite />
                </h2>
                <p className="text-sm mb-2">These Community Guidelines may be updated from time to time to improve user safety, reflect new platform features, or comply with applicable laws. <Cite /></p>
                <p className="text-xs text-gray-400">The latest version will always be available on the official AddaLove website. <Cite /></p>
              </section>

              <section id="contact" className="scroll-mt-32">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-pink-500">17.</span> Contact Us <Cite />
                </h2>
                <p className="text-sm">If you have questions about these Community Guidelines or need assistance, please contact AddaLove through the official support channels listed on our website. <Cite /></p>
              </section>
            </div>

            {/* Our Promise */}
            <section className="pt-10 border-t border-white/10 text-center max-w-2xl mx-auto">
              <div className="bg-linear-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                <h2 className="text-3xl font-bold mb-4 text-white flex justify-center items-center gap-2">
                  Our Promise <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                </h2>
                <p className="mb-6 text-gray-300">
                  At AddaLove, we believe that meaningful conversations can create meaningful change. <Cite />
                </p>
                <p className="mb-4 text-sm">Every member deserves to feel: <Cite /></p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {["Safe", "Respected", "Heard", "Valued", "Welcome"].map((item, idx) => (
                    <span key={idx} className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-white border border-white/20">
                      {item} <Cite />
                    </span>
                  ))}
                </div>
                <p className="text-lg font-medium text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400">
                  Let's build a community where kindness comes first. <Cite />
                </p>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunityGuidelines;