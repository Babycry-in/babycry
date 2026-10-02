import React from 'react';
import Image from 'next/image';
import { getBusinessSettings } from '@/lib/data/db-service';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/SocialIcons';

export const metadata = {
  title: 'Contact Us | Baby Cry.in',
  description: 'Get in touch with Baby Cry.in in Pandikkad, Kerala. Phone: 8136 819192.',
};

export default async function ContactPage() {
  const settings = await getBusinessSettings();
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-slate-900">
            We&apos;d love to hear from you
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Have questions about sizes, hospital arrival kits, custom gift hampers, or your delivery? Reach out anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-10 rounded-[36px] border border-emerald-100 shadow-sm space-y-6">
            <h2 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Call Us
                  </span>
                  <a href={`tel:${cleanPhone}`} className="text-base font-bold text-slate-900 hover:text-emerald-700">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    WhatsApp Support
                  </span>
                  <a
                    href={`https://wa.me/91${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
                  >
                    <span>+91 {settings.phone}</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Email Inquiry
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-700 break-all"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Store Location
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Instagram Community
                  </span>
                  <a
                    href={`https://instagram.com/${settings.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-700"
                  >
                    @{settings.instagram_handle}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent('Hello Baby Cry.in! I would like to make an inquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BE5B] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Official Business Card Visual */}
          <div className="lg:col-span-6 bg-white p-6 rounded-[36px] border border-emerald-100 shadow-sm space-y-4">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Official Store Card
            </h2>
            <div className="relative aspect-[16/8.5] w-full rounded-2xl overflow-hidden shadow-md border-2 border-emerald-50">
              <Image
                src="/images/business-card.png"
                alt="Baby Cry.in Store Business Card"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              Scan QR code on card or connect directly via WhatsApp anytime.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
