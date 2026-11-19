"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database, Cookie, UserCheck, Mail, Server } from "lucide-react";

const sections = [
  {
    id: "overview",
    icon: Shield,
    title: "Overview & Our Commitment",
    content: `JANKS Tailoring ("we", "us", or "our") is committed to protecting the privacy and security of every individual who visits our website or engages with our services. This Data Protection & Website Security Policy explains how we collect, use, store, and protect your personal information in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

We treat the security and confidentiality of your data with the utmost seriousness. By using our website or submitting your information to us, you agree to the terms outlined in this policy. We will never sell, trade, or rent your personal information to third parties without your explicit consent.`,
  },
  {
    id: "data-collection",
    icon: Database,
    title: "Data We Collect",
    content: `We collect only the minimum personal data necessary to provide our services. This may include:

• **Contact Information** — Name, email address, phone number, and postal address when you submit an enquiry or book an appointment.
• **Booking Details** — Service preferences, appointment dates, and any notes you provide during the booking process.
• **Communication Records** — Correspondence between you and our team, whether by email, telephone, or web form.
• **Website Usage Data** — Anonymised analytics such as pages visited, time on site, and browser type, collected to improve our website experience.
• **Payment Information** — When transactions are processed, payment data is handled exclusively by our secure payment processors and is never stored on our servers.

We do not collect sensitive personal data (such as health information, biometric data, or financial records) unless it is strictly necessary and you have given explicit consent.`,
  },
  {
    id: "data-use",
    icon: Eye,
    title: "How We Use Your Data",
    content: `Your personal information is used solely for the following legitimate purposes:

• To respond to enquiries and provide the services you have requested.
• To schedule and manage consultations and fitting appointments.
• To send order confirmations, appointment reminders, and relevant service updates.
• To improve our website, services, and customer experience through anonymised analytics.
• To comply with legal obligations, including financial record-keeping and regulatory requirements.
• To protect against fraud, abuse, or security threats to our systems.

We will only contact you for marketing purposes if you have explicitly opted in. You may withdraw this consent at any time by contacting us at jankstailoring@gmail.com.`,
  },
  {
    id: "security",
    icon: Lock,
    title: "Security Measures",
    content: `We employ industry-standard security measures to protect your data against unauthorised access, loss, misuse, or disclosure:

• **SSL/TLS Encryption** — All data transmitted between your browser and our website is encrypted using HTTPS/TLS protocols, ensuring your information is protected in transit.
• **Access Controls** — Access to personal data is strictly limited to authorised personnel who require it to perform their duties. All team members are trained in data protection obligations.
• **Secure Storage** — Data is stored on secure, access-controlled servers hosted within reputable cloud infrastructure providers that comply with ISO 27001 and SOC 2 standards.
• **Regular Security Reviews** — Our website and systems are regularly reviewed and updated to address emerging security vulnerabilities and threats.
• **Password Protection** — Internal systems are protected with strong password policies and, where applicable, multi-factor authentication.
• **Data Minimisation** — We regularly review and delete data we no longer need, minimising the risk associated with retaining unnecessary personal information.`,
  },
  {
    id: "storage",
    icon: Server,
    title: "Data Storage & Retention",
    content: `Your personal data is stored securely within the United Kingdom and the European Economic Area (EEA). Where data is processed by third-party service providers outside these regions, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the UK Information Commissioner's Office (ICO).

We retain personal data only for as long as necessary:

• **Enquiry and contact data** — Retained for up to 2 years after our last communication, unless you request earlier deletion.
• **Booking and appointment records** — Retained for up to 5 years for operational and legal compliance purposes.
• **Financial transaction records** — Retained for 7 years in accordance with HMRC requirements.
• **Website analytics data** — Anonymised and aggregated; no individual retention limit applies.

Upon expiry of the applicable retention period, data is securely and permanently deleted or anonymised.`,
  },
  {
    id: "third-party",
    icon: Shield,
    title: "Third-Party Services",
    content: `We use a limited number of carefully selected third-party services to operate our website and business. These include:

• **Shopify** — Our e-commerce platform for product listings and order processing. Shopify is PCI DSS compliant and maintains its own comprehensive privacy and security practices.
• **Google Analytics** — Anonymised website analytics to understand how visitors use our site. Data is aggregated and not personally identifiable. You may opt out via Google's opt-out browser add-on.
• **Website assets** — Typefaces are self-hosted on this website. We do not load fonts from Google Fonts.
• **Email Service Providers** — Secure email platforms used to communicate with clients. Emails are transmitted over encrypted connections.

We do not share your personal data with any third party for their own marketing purposes. All third-party processors are contractually bound to handle your data in accordance with UK GDPR requirements.`,
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies Policy",
    content: `Our website uses cookies to enhance your browsing experience and help us improve our services. Cookies are small text files stored on your device.

**Essential Cookies** — Required for the website to function correctly. These cannot be disabled as they are necessary for core functionality such as navigation and security.

**Analytics Cookies** — Anonymised data collected via Google Analytics to understand visitor behaviour and improve our website. These cookies do not identify you personally.

**Preference Cookies** — Remember your settings and preferences to provide a more personalised experience on return visits.

**Third-Party Cookies** — Our Shopify integration may set cookies related to your shopping session and cart. These are governed by Shopify's own cookie policy.

You can control and manage cookies through your browser settings at any time. Disabling certain cookies may affect the functionality of the website. By continuing to use our website, you consent to our use of cookies as described above.`,
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "Your Rights",
    content: `Under UK GDPR, you have the following rights regarding your personal data:

• **Right of Access** — You have the right to request a copy of the personal data we hold about you (Subject Access Request).
• **Right to Rectification** — You may request that we correct any inaccurate or incomplete personal data.
• **Right to Erasure** — You may request that we delete your personal data where there is no compelling reason for us to continue processing it ("right to be forgotten").
• **Right to Restrict Processing** — You may request that we limit how we use your data in certain circumstances.
• **Right to Data Portability** — You may request your data in a structured, commonly used, machine-readable format.
• **Right to Object** — You may object to us processing your data for direct marketing or where we are relying on legitimate interests as our legal basis.
• **Rights Related to Automated Decision-Making** — We do not use automated decision-making or profiling that produces significant legal effects on you.

To exercise any of these rights, please contact us using the details below. We will respond to all valid requests within 30 days. There is no charge for making a request.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact & Complaints",
    content: `If you have any questions, concerns, or requests relating to this policy or how we handle your personal data, please contact us:

**JANKS TAILORING LTD**
Company No. 16870658
Registered office: 3rd Floor, 86-90 Paul Street
London EC2A 4NE

This is our registered business address, not a shop. Consultations are by appointment only — we travel to you. Every order is delivered.

Email: jankstailoring@gmail.com
Phone: +44 7828 338172

If you are not satisfied with our response, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO):

Information Commissioner's Office
Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
Website: www.ico.org.uk | Helpline: 0303 123 1113

We take all complaints seriously and will investigate thoroughly and promptly.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-cream/40 block mb-4">Legal</span>
            <h1 className="font-cinzel text-4xl lg:text-6xl text-cream mb-6 leading-tight">
              Data Protection &<br />Website Security Policy
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed max-w-2xl">
              Your privacy and the security of your personal information are fundamental to how we operate.
              This policy outlines our commitment to protecting your data and your rights under UK GDPR.
            </p>
            <p className="text-cream/30 text-xs mt-6 tracking-wide">
              Last updated: 19 November 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick navigation */}
      <section className="border-b border-charcoal/10 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[10px] tracking-[0.15em] uppercase text-charcoal/50 hover:text-charcoal whitespace-nowrap transition-colors duration-200"
              >
                {s.title.split(" ")[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="space-y-16">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="scroll-mt-32"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-charcoal flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-cream" />
                    </div>
                    <h2 className="font-cinzel text-xl lg:text-2xl text-charcoal">{section.title}</h2>
                  </div>
                  <div className="pl-14 border-l border-charcoal/10 ml-5">
                    {section.content.split("\n\n").map((para, i) => (
                      <div key={i} className="mb-4">
                        {para.startsWith("•") || para.includes("\n•") ? (
                          <ul className="space-y-2">
                            {para.split("\n").filter(l => l.trim()).map((line, j) => (
                              <li key={j} className="text-charcoal/70 text-sm leading-relaxed">
                                {line.startsWith("•") ? (
                                  <span>
                                    <span className="text-gold mr-2">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: line.slice(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-medium">$1</strong>') }} />
                                  </span>
                                ) : (
                                  <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-medium">$1</strong>') }} />
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p
                            className="text-charcoal/70 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal font-medium">$1</strong>') }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {index < sections.length - 1 && (
                    <div className="mt-16 border-b border-charcoal/8" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 p-8 bg-charcoal text-cream"
          >
            <div className="flex items-start gap-4">
              <Shield size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-cinzel text-lg mb-2">Policy Updates</h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  We may update this policy from time to time to reflect changes in our practices or legal requirements.
                  Any significant changes will be communicated via our website. We encourage you to review this policy periodically.
                  Continued use of our website following any updates constitutes acceptance of the revised policy.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-4 text-[11px] tracking-[0.2em] uppercase text-gold hover:text-cream transition-colors"
                >
                  Contact Us With Questions →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
