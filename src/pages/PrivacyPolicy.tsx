import React, { useEffect } from "react";
import { Shield } from "lucide-react";
import { LEGAL_NAME } from "../constants";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <SEO 
        title="Privacy Policy"
        description="Privacy policy and data governance practices at The Transformation Room, LLC."
      />
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header section */}
        <div className="mb-16">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <Shield className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl">
            How we collect, use, and protect your information at {LEGAL_NAME}.
          </p>
          <div className="mt-8 flex gap-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            <span>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none">
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 space-y-12">
            
            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">1. Information We Collect</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                We collect information directly from you when you interact with our website, use our services, or communicate with us. This may include:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-4 space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and any other details you provide via contact forms, inquiries, or account registration.</li>
                <li><strong>Professional Information:</strong> Job title, company name, resumes/CVs, and career history submitted through our tools (e.g., Resume Optimizer, Career Path Simulator).</li>
                <li><strong>Operational Data:</strong> Input provided for simulations and assessments related to your organization's processes and goals.</li>
                <li><strong>Automatically Collected Information:</strong> IP address, browser type, device details, and usage metrics collected via cookies, browser storage, and analytics tools to improve website performance. For detailed information on our use of tracking technologies, please review our <a href="/cookie-policy" className="text-brand-primary underline font-medium">Cookie Policy</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">2. Use of Information</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                The information we collect is used for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-4 space-y-2">
                <li>To provide, operate, and maintain our consulting services and software tools.</li>
                <li>To contact you regarding inquiries, requests, or to provide customer support.</li>
                <li>To generate assessments, resumes, and strategic insights through our AI-integrated platforms.</li>
                <li>To analyze website usage trends and improve user experience and functionality.</li>
                <li>To comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">3. Disclosure of Information to Third Parties</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                We do not sell or rent your personal information to third parties. We may disclose your information to the following parties under specific circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-4 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as cloud hosting (Google Cloud), AI processing (OpenAI, Google), analytics, and customer communication platforms.</li>
                <li><strong>Legal Requirements:</strong> Law enforcement, government agencies, or authorized third parties when required by law or to protect our legal rights, property, or safety.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">4. Method of Disclosure</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                When sharing information with service providers, we do so through secure, encrypted APIs and authenticated network protocols. Data transmitted for AI processing (e.g., parsing a resume or running an operational simulation) is handled transiently via secure connections (HTTPS/TLS) and governed by the strict data processing agreements of our enterprise AI partners to ensure your data is neither retained for model training nor exposed publicly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">5. Security Practices</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                We implement robust security measures to safeguard your personal and organizational information against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-4 space-y-2">
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using standard Transport Layer Security (TLS/SSL).</li>
                <li><strong>Access Controls:</strong> Access to personal information is strictly limited to authorized personnel and contractors who require the information to perform their job duties.</li>
                <li><strong>Infrastructure Security:</strong> We utilize secure, enterprise-grade cloud environments to host our application and databases, employing firewalls and regular security patching.</li>
                <li><strong>Data Minimization:</strong> We actively limit the storage of sensitive operational data, keeping it only as long as necessary to fulfill the services requested.</li>
              </ul>
              <p className="text-slate-600 font-light leading-relaxed mt-4">
                While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet or method of electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">6. Contact Us</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900">{LEGAL_NAME}</p>
                <p className="text-slate-600 mt-1">Email: katie@thetransformationroom.com</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
