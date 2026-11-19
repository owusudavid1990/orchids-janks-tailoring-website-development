import { Lock } from "lucide-react";

/**
 * "Secure checkout" trust badge.
 *
 * The icons below are drawn to represent each payment brand — not copies of
 * their trademarked logo artwork — which is the standard, legitimate way a
 * merchant shows what it accepts. Naming a brand you genuinely support is
 * accurate/nominative use; it stops being fine the moment the badge shows a
 * method the store doesn't actually offer.
 *
 * ONLY six methods appear, matched against Shopify Settings → Payments on
 * 10 Aug 2026, where each showed no "Disabled" tag:
 *   Shop Pay · Visa · Mastercard · American Express · Apple Pay · Google Pay
 *
 * Deliberately left out:
 *   - PayPal    — not present in the store's enabled payment methods at all
 *   - Klarna    — status wasn't visible when checked, AND the owner separately
 *                 asked for "Pay in 3 instalments" messaging removed from
 *                 product images. Adding Klarna here would reintroduce
 *                 buy-now-pay-later messaging elsewhere on the site.
 *
 * If Shopify's enabled methods change, update the list below to match —
 * never add a logo without confirming it's actually live first.
 */

// Every icon gets a white "card" backdrop with a hairline border, regardless
// of the page behind it. That's what real payment-icon rows do — it's how
// Amex blue and Google's white wordmark both stay legible on a dark footer
// without needing separate light/dark artwork per brand.
function IconCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-7 rounded bg-white border border-black/10 flex items-center justify-center gap-0.5 shrink-0 shadow-sm">
      {children}
    </div>
  );
}

function Visa() {
  return (
    <IconCard>
      <span className="text-[13px] font-bold italic tracking-tight" style={{ color: "#1A1F71" }}>VISA</span>
    </IconCard>
  );
}

function Mastercard() {
  return (
    <IconCard>
      <svg width="26" height="16" viewBox="0 0 26 16" aria-hidden="true">
        <circle cx="9" cy="8" r="7.5" fill="#EB001B" />
        <circle cx="17" cy="8" r="7.5" fill="#F79E1B" fillOpacity="0.92" />
      </svg>
    </IconCard>
  );
}

function Amex() {
  return (
    <IconCard>
      <span className="text-[8px] font-bold tracking-wide leading-none text-center" style={{ color: "#2E77BC" }}>AMEX</span>
    </IconCard>
  );
}

function ApplePay() {
  return (
    <IconCard>
      <svg width="11" height="13" viewBox="0 0 14 16" fill="black" aria-hidden="true">
        <path d="M9.6 2.6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.8-.5 2.3-1z" />
        <path d="M10.4 3.8c-1.3-.1-2.4.7-3 .7s-1.6-.7-2.6-.7C3.4 3.9 2.2 4.7 1.5 6c-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2 1-.1 1.4-.6 2.6-.6s1.6.6 2.6.6c1.1 0 1.8-1 2.5-2 .7-1 1-2 1-2.1-.1 0-2-.8-2-3 0-2 1.6-2.8 1.7-2.9-.9-1.3-2.3-1.5-2.8-1.6z" />
      </svg>
      <span className="text-[11px] font-medium text-black">Pay</span>
    </IconCard>
  );
}

function GooglePay() {
  return (
    <IconCard>
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.3v3.1C3.3 21.3 7.3 24 12 24z" />
        <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4.1-3.1z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l4.1 3.1c.9-2.8 3.5-4.9 6.6-4.9z" />
      </svg>
      <span className="text-[11px] font-medium text-[#3C4043]">Pay</span>
    </IconCard>
  );
}

function ShopPay() {
  return (
    <div className="w-11 h-7 rounded bg-[#5A31F4] flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-white text-[10px] font-bold italic">shop</span>
    </div>
  );
}

const METHODS = [
  { name: "Shop Pay", Icon: ShopPay },
  { name: "Visa", Icon: Visa },
  { name: "Mastercard", Icon: Mastercard },
  { name: "American Express", Icon: Amex },
  { name: "Apple Pay", Icon: ApplePay },
  { name: "Google Pay", Icon: GooglePay },
];

interface Props {
  /** Compact drops the "We accept" caption — for tight footer spaces */
  compact?: boolean;
  /** Use on a dark background (the footer). Default suits the light checkout page. */
  dark?: boolean;
  className?: string;
}

export function PaymentBadge({ compact = false, dark = false, className = "" }: Props) {
  const captionColor = dark ? "text-cream/40" : "text-charcoal/50";
  const labelColor = dark ? "text-cream/30" : "text-charcoal/30";
  const iconColor = dark ? "text-cream/40" : "text-charcoal/40";

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Lock size={12} className={iconColor} />
        <span className={`text-[11px] tracking-[0.1em] ${captionColor}`}>
          Secure checkout, powered by Shopify
        </span>
      </div>
      {!compact && (
        <p className={`text-center text-[10px] tracking-[0.15em] uppercase mb-3 ${labelColor}`}>
          We accept
        </p>
      )}
      <div className="flex items-center justify-center gap-2 flex-wrap" role="list" aria-label="Accepted payment methods">
        {METHODS.map(({ name, Icon }) => (
          <div key={name} role="listitem" title={name}>
            <Icon />
          </div>
        ))}
      </div>
    </div>
  );
}
