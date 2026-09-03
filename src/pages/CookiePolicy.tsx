import React, { useEffect } from "react";
import { Cookie, ShieldCheck, Settings, Info } from "lucide-react";
import { LEGAL_NAME, ADDRESS } from "../constants";
import SEO from "../components/SEO";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <SEO 
        title="Cookie Policy"
        description={`Cookie policy and tracking technologies disclosure for ${LEGAL_NAME}.`}
        keywords="Cookie Policy, tracking technologies, data privacy, website cookies, local storage, The Transformation Room"
      />
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header section */}
        <div className="mb-16">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <Cookie className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-slate-900">
            Cookie Policy
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl">
            How {LEGAL_NAME} uses cookies and similar technologies to enhance your experience, preserve tool states, and ensure platform performance.
          </p>
          <div className="mt-8 flex gap-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            <span>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none">
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 space-y-12">
            
            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase flex items-center gap-3">
                <Info className="w-6 h-6 text-brand-primary" />
                1. What Are Cookies and Tracking Technologies?
              </h2>
              <p className="text-slate-600 font-light leading-relaxed">
                Cookies are small data files placed on your device (computer, smartphone, or tablet) when you visit a website. Cookies allow the website to recognize your browser, remember your preferences, and provide necessary features.
              </p>
              <p className="text-slate-600 font-light leading-relaxed mt-4">
                In addition to standard HTTP cookies, we may use related client-side storage technologies such as <strong>Local Storage</strong> and <strong>Session Storage</strong>. These technologies store data locally in your browser to maintain application state (e.g., active simulator configurations, language preferences, and podcast audio player states) without sending unnecessary data over the network with every request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-brand-primary" />
                2. Categories of Cookies We Use
              </h2>
              <p className="text-slate-600 font-light leading-relaxed">
                We categorize the cookies and storage mechanisms used across our website and interactive tools as follows:
              </p>
              
              <div className="mt-6 space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">A. Strictly Necessary & Essential Cookies</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    These cookies are essential for the operation of our website. They enable core security features, authentication, load balancing, and navigation routing. Without these cookies, basic website functionality cannot be provided.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">B. Functional & Preference Storage</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    These mechanisms enable our website to remember choices you make (such as your preferred language—English or Spanish) and persistent state across our tools, such as the Impact Simulator parameters, Career Hub assessments, and audio player progress.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">C. Analytics & Performance Cookies</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    These cookies help us understand how visitors interact with our pages, identify traffic sources, and measure performance bottlenecks. All analytics data is aggregated and anonymized.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">D. Interactive Tool & AI Session State</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    When using NOVA AI Intelligence, the Executive Resume Studio, or the Video Companion, session-based storage is utilized locally on your machine to maintain your conversation context and ensure seamless user interaction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">3. Third-Party Services & Integrations</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                Some third-party service providers integrated into our website may set cookies or access browser storage when you interact with their features:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-4 space-y-2">
                <li><strong>Payment Processors (Stripe):</strong> When completing payments or support contributions via Stripe, Stripe may place secure cookies for fraud prevention and transaction verification.</li>
                <li><strong>Cloud Infrastructure (Google Cloud):</strong> Our cloud hosting infrastructure utilizes session routing and CDN caching mechanisms to ensure low-latency media delivery (such as podcast audio streaming).</li>
                <li><strong>Scheduling Tools:</strong> Embedded or linked discovery call scheduling links (Google Calendar) manage their own authentication and cookie environments.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase flex items-center gap-3">
                <Settings className="w-6 h-6 text-brand-primary" />
                4. Managing & Controlling Cookies
              </h2>
              <p className="text-slate-600 font-light leading-relaxed">
                You have the right to accept, configure, or refuse cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies or alert you when a cookie is being placed:
              </p>
              <ul className="list-disc pl-6 text-slate-600 font-light leading-relaxed mt-4 space-y-2">
                <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
                <li><strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection</li>
                <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</li>
              </ul>
              <p className="text-slate-600 font-light leading-relaxed mt-4 text-sm bg-amber-50 p-4 rounded-xl border border-amber-200/60 text-amber-900">
                <strong>Please Note:</strong> If you choose to disable or block certain cookies and local storage items, some interactive features (such as audio player position memory, language persistence, or resume builder drafting state) may not function as intended.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">5. Updates to This Policy</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                We may periodically update this Cookie Policy to reflect changes in operational practices, technologies, or legal requirements. Any modifications will be posted directly to this page with an updated "Effective Date".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 uppercase">6. Contact Information</h2>
              <p className="text-slate-600 font-light leading-relaxed">
                If you have questions regarding our use of cookies or privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-sm">
                <p className="font-bold text-slate-900 text-base">{LEGAL_NAME}</p>
                <p className="text-slate-600">Address: {ADDRESS}</p>
                <p className="text-slate-600">Email: katie@thetransformationroom.com</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
