import React, { useEffect } from "react";
import { Scale, ShieldCheck, AlertTriangle } from "lucide-react";
import { LEGAL_NAME, ADDRESS } from "../constants";
import SEO from "../components/SEO";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <SEO 
        title="Terms of Service"
        description="Terms and conditions for consulting services and digital tools provided by The Transformation Room, LLC."
      />
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header section */}
        <div className="mb-16">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <Scale className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-slate-900">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl">
            Terms and conditions governing the use of services, tools, and platforms provided by {LEGAL_NAME}.
          </p>
          <div className="mt-8 flex gap-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            <span>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none">
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 space-y-12">
            
            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">1. Acceptance of Terms</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                By accessing, browsing, or using the website, software tools, assessments, advisory platforms, or services provided by <strong>{LEGAL_NAME}</strong> ("Company", "we", "us", or "our"), you ("User", "Client", or "you") agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you are expressly prohibited from using the site or services and must discontinue use immediately.
              </p>
            </section>

            {/* Special Independent Entity & Employer Non-Affiliation Clause */}
            <section className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4 text-brand-primary font-black uppercase tracking-wider text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>2. Independent Operation & Employer Non-Affiliation Disclaimer</span>
              </div>
              <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                <strong>CRITICAL LEGAL NOTICE REGARDING INDEPENDENT ENTITY STATUS:</strong>
              </p>
              <p className="text-slate-600 font-light text-sm leading-relaxed mb-4">
                {LEGAL_NAME} is an entirely independent, standalone commercial entity. All services, consulting engagements, insights, tools, AI models, recommendations, published content, software code, and advisory outputs provided by or associated with {LEGAL_NAME} are conducted solely and exclusively in an independent business capacity.
              </p>
              <ul className="list-disc pl-5 text-slate-600 font-light text-sm space-y-2 leading-relaxed">
                <li>
                  <strong>Separation from Employment:</strong> No service, product, opinion, statement, or material offered by {LEGAL_NAME} represents, reflects, utilizes, or is affiliated with any current, former, or future employer or full-time workplace of {LEGAL_NAME}'s owners, members, officers, or contractors.
                </li>
                <li>
                  <strong>No Employer Liability or Endorsement:</strong> Any corporate or institutional employer of {LEGAL_NAME}'s personnel is completely uninvolved in, unassociated with, and bears strictly <strong>ZERO legal liability, warranty, sponsorship, endorsement, or responsibility</strong> for any activities, products, contracts, or obligations of {LEGAL_NAME}.
                </li>
                <li>
                  <strong>Protection of Proprietary Assets:</strong> All consulting methodologies, software systems, and deliverables created by {LEGAL_NAME} are developed independently without the use of any employer resources, proprietary data, confidential assets, or employer time.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">3. Advisory & AI Tools Disclaimer</h2>
              <p className="text-slate-600 font-light leading-relaxed mb-4">
                {LEGAL_NAME} provides organizational design, operational strategy, career advisory tools, AI-powered interactive companions, resume optimization, and impact calculators. All outputs generated by automated tools or provided during advisory sessions are intended strictly for educational, informational, and general strategic planning purposes.
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed space-y-2">
                <li><strong>No Guaranteed Outcomes:</strong> We make no representations or guarantees regarding specific business performance metrics, ROI figures, revenue gains, job offers, promotions, or interview guarantees resulting from the use of our services or tools.</li>
                <li><strong>Not Professional Legal/Financial Advice:</strong> Our services do not constitute formal legal, tax, accounting, or licensed employment law advice. Users are encouraged to consult licensed legal or accounting professionals for specific statutory compliance.</li>
                <li><strong>AI Generated Content:</strong> Interactive AI features (including chatbot assistants and assessment tools) utilize third-party generative artificial intelligence. AI outputs may occasionally contain non-deterministic predictions or estimates; users must exercise independent professional human judgment before implementing decisions based on AI recommendations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">4. Intellectual Property Rights</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                Unless otherwise stated, all proprietary rights, trademarks, service marks, website layout, graphics, original software code, data frameworks, and assessment algorithms on this site are owned by or licensed to {LEGAL_NAME}. Subject to your compliance with these Terms, you are granted a limited, non-exclusive, non-transferable, revocable license to access the website and tools for your internal personal or business evaluation purposes. You may not sell, reproduce, reverse engineer, or exploit any portion of our platform without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">5. User Data & Confidentiality</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                You retain ownership of any proprietary text, data, or documents (such as resumes or organizational stats) uploaded to our tools. By submitting information, you grant {LEGAL_NAME} a worldwide, royalty-free license to process, parse, and analyze your input solely for the purpose of executing requested tools and delivering advisory services. Please refer to our <a href="/privacy-policy" className="text-brand-primary underline font-bold">Privacy Policy</a> for details on data security and API handling.
              </p>
            </section>

            <section className="bg-red-50/50 p-6 md:p-8 rounded-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-4 text-red-700 font-black uppercase tracking-wider text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>6. Limitation of Liability & Release</span>
              </div>
              <p className="text-slate-700 font-light text-sm leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL <strong>{LEGAL_NAME}</strong>, ITS MEMBERS, OWNERS, OFFICERS, EMPLOYEES, CONTRACTORS, REPRESENTATIVES, OR ANY AFFILIATED INDIVIDUALS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR RELIANCE DAMAGES (INCLUDING LOSS OF PROFITS, BUSINESS INTERRUPTION, LOSS OF DATA, CAREER DISRUPTIONS, OR THIRD-PARTY CLAIMS) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OUR WEBSITE, TOOLS, OR ADVISORY SERVICES.
              </p>
              <p className="text-slate-700 font-light text-sm leading-relaxed">
                IN ALL CASES, THE TOTAL AGGREGATE LIABILITY OF {LEGAL_NAME} FOR ANY CLAIM ARISING UNDER OR RELATED TO THESE TERMS SHALL NOT EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO {LEGAL_NAME} IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED U.S. DOLLARS ($100.00 USD), WHICHEVER IS LESS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">7. Indemnification</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                You agree to defend, indemnify, release, and hold harmless {LEGAL_NAME}, its founder, owners, members, employees, contractors, service providers, and any associated personal entities from and against any claims, liabilities, losses, damages, demands, penalties, fines, costs, or expenses (including reasonable attorneys' fees and legal costs) arising out of or related to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-3 space-y-2">
                <li>Your access to or use of our website, software tools, or consulting services;</li>
                <li>Your violation of any provision of these Terms of Service;</li>
                <li>Your infringement or violation of any third-party right, including intellectual property, employer non-disclosure agreement, privacy, or proprietary rights;</li>
                <li>Any claim that content or data provided by you caused damage to a third party.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">8. Governing Law & Dispute Resolution</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the <strong>Commonwealth of Virginia, United States</strong>, without giving effect to any principles of conflicts of law. Any legal suit, action, or proceeding arising out of or related to these Terms or {LEGAL_NAME} shall be instituted exclusively in the state or federal courts located in or serving Richmond, Virginia, and you irrevocably submit to the personal jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">9. Severability & Modifications</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired. We reserve the right to update or modify these Terms at any time without prior notice. Continued use of the website following any changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">10. Contact Information</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                For any questions, legal inquiries, or notices concerning these Terms of Service, please contact:
              </p>
              <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900">{LEGAL_NAME}</p>
                <p className="text-slate-600 mt-1">{ADDRESS}</p>
                <p className="text-slate-600 mt-1">Email: katie@thetransformationroom.com</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
