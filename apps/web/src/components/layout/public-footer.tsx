import {
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react'
import Link from 'next/link'

import { Logo } from './logo'

export function PublicFooter() {
  return (
    <footer className="marketing border-t border-neutral-200 bg-white">
      {/* Upper Footer: Links & Contact */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Col 1: Brand & Need Help? */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" aria-label="GarageBox home">
              <Logo size="md" />
            </Link>

            <div className="pt-2">
              <h3 className="text-xl font-bold text-neutral-900">Need Help?</h3>
              <p className="mt-1 text-sm text-neutral-500">Contact us with any questions</p>
            </div>

            <div className="space-y-4">
              {/* Call Us */}
              <a
                href="tel:+923125699996"
                className="group flex items-center gap-3 text-neutral-900 transition-colors hover:text-[#1047FA]"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 transition-colors group-hover:text-[#1047FA]">
                  <Phone className="size-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Call Us
                  </span>
                  <span className="text-sm font-bold">+92 312 5699996</span>
                </div>
              </a>

              {/* Email Us */}
              <a
                href="mailto:support@garagebox.io"
                className="group flex items-center gap-3 text-neutral-900 transition-colors hover:text-[#1047FA]"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 transition-colors group-hover:text-[#1047FA]">
                  <Mail className="size-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Email Us
                  </span>
                  <span className="text-sm font-bold">support@garagebox.io</span>
                </div>
              </a>

              {/* WhatsApp Us */}
              <a
                href="https://wa.me/923125699996"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-neutral-900 transition-colors hover:text-[#1047FA]"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 transition-colors group-hover:text-[#1047FA]">
                  <MessageCircle className="size-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    WhatsApp Us
                  </span>
                  <span className="text-sm font-bold">+92 312 5699996</span>
                </div>
              </a>
            </div>

            {/* Follow Us */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-neutral-900 mb-3">Follow us</h4>
              <div className="-ml-2.5 flex items-center gap-1">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center text-neutral-600 transition-colors hover:text-[#1047FA]"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.32a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-9 items-center justify-center text-neutral-600 transition-colors hover:text-[#1047FA]"
                >
                  <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex size-9 items-center justify-center text-neutral-600 transition-colors hover:text-[#1047FA]"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                  className="flex size-9 items-center justify-center text-neutral-600 transition-colors hover:text-[#1047FA]"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Features */}
          <div className="lg:col-span-2 sm:col-span-3">
            <h4 className="text-base font-bold text-neutral-900 mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs font-medium text-neutral-600">
              {[
                'Workflow',
                'Estimates',
                'Inventory',
                'Vehicle Inspections',
                'Packaged Services',
                'Procurement',
                'Appointment Scheduling',
                'Service Reminders',
                'Billing & Invoicing',
                'Staff Tracking',
                'Technician Productivity',
                'Fleet Management',
              ].map((f) => (
                <li key={f}>
                  <Link href="#features-all" className="hover:text-[#1047FA] transition-colors">
                    {f}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="lg:col-span-3 sm:col-span-3">
            <h4 className="text-base font-bold text-neutral-900 mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-xs font-medium text-neutral-600">
              {[
                'Built for Every Type of Shop',
                'Scalable for Any Size',
                'Win Trust. Keep Customers.',
                'From Check-In to Checkout',
                'Your Parts and Purchasing',
                'Profit Starts with Clarity',
                'Less Chaos. More Control.',
                'Connecting the Dots',
              ].map((s) => (
                <li key={s}>
                  <Link href="#solutions" className="hover:text-[#1047FA] transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="lg:col-span-1.5 sm:col-span-3">
            <h4 className="text-base font-bold text-neutral-900 mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium text-neutral-600">
              {['Pricing', 'FAQs', 'Blog', 'Support Center'].map((r) => (
                <li key={r}>
                  <Link href="#support" className="hover:text-[#1047FA] transition-colors">
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-neutral-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:px-6 md:flex-row lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
            <Link href="#refund" className="hover:text-[#1047FA]">
              Refund & Cancellation Policy
            </Link>
            <Link href="#privacy" className="hover:text-[#1047FA]">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-[#1047FA]">
              Terms of Service
            </Link>
            <Link href="#dpa" className="hover:text-[#1047FA]">
              Data Processing Addendum (DPA)
            </Link>
            <Link href="#sla" className="hover:text-[#1047FA]">
              Service Level Agreement (SLA)
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} />
            <p>© 2026 GarageBox. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
