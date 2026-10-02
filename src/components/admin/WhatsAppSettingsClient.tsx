'use client';

import React, { useState } from 'react';
import { BusinessSettings } from '@/types/database';
import { MessageCircle, Check, RotateCcw, Save, Smartphone, Sparkles, HelpCircle } from 'lucide-react';

interface WhatsAppSettingsClientProps {
  initialSettings: BusinessSettings;
}

const DEFAULT_TEMPLATE = `*{business_name}*
🛍️ *NEW ORDER*

*Order ID:*
{order_id}

*Customer:*
{customer_name}

*Phone:*
{customer_phone}

*Delivery Address:*
{delivery_address}

*Products:*
{products}

*Subtotal:* {subtotal}
*Delivery:* {delivery}
*TOTAL:* {total}

*Order Status:* {order_status}`;

const SAMPLE_DATA = {
  business_name: 'BABY CRY.IN',
  order_id: '#BC-100234',
  customer_name: 'Ananya Nair',
  customer_phone: '9876543210',
  customer_email: 'ananya@example.com',
  delivery_address: 'Rose Villa, Pandikkad, Kerala - 676521',
  products: `1. *Floral Bow Dress*\nVariant: 6-12M • Cream Floral\nQuantity: 1\nPrice: ₹1299`,
  subtotal: '₹1299',
  delivery: 'FREE',
  total: '₹1299',
  order_status: 'Pending',
  order_date: '2 Oct 2026, 07:30 PM',
};

const AVAILABLE_TAGS = [
  { tag: '{business_name}', label: 'Store Name' },
  { tag: '{order_id}', label: 'Order ID' },
  { tag: '{customer_name}', label: 'Customer Name' },
  { tag: '{customer_phone}', label: 'Customer Phone' },
  { tag: '{delivery_address}', label: 'Address' },
  { tag: '{products}', label: 'Products List' },
  { tag: '{subtotal}', label: 'Subtotal' },
  { tag: '{delivery}', label: 'Delivery Fee' },
  { tag: '{total}', label: 'Total Amount' },
  { tag: '{order_status}', label: 'Order Status' },
];

export function WhatsAppSettingsClient({ initialSettings }: WhatsAppSettingsClientProps) {
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings.whatsapp_number || '8136819192');
  const [template, setTemplate] = useState(initialSettings.whatsapp_order_template || DEFAULT_TEMPLATE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate live preview text with sample data
  const previewText = React.useMemo(() => {
    return template
      .replace(/{business_name}/g, SAMPLE_DATA.business_name)
      .replace(/{order_id}/g, SAMPLE_DATA.order_id)
      .replace(/{customer_name}/g, SAMPLE_DATA.customer_name)
      .replace(/{customer_phone}/g, SAMPLE_DATA.customer_phone)
      .replace(/{customer_email}/g, SAMPLE_DATA.customer_email)
      .replace(/{delivery_address}/g, SAMPLE_DATA.delivery_address)
      .replace(/{products}/g, SAMPLE_DATA.products)
      .replace(/{subtotal}/g, SAMPLE_DATA.subtotal)
      .replace(/{delivery}/g, SAMPLE_DATA.delivery)
      .replace(/{total}/g, SAMPLE_DATA.total)
      .replace(/{order_status}/g, SAMPLE_DATA.order_status)
      .replace(/{order_date}/g, SAMPLE_DATA.order_date);
  }, [template]);

  const insertTag = (tag: string) => {
    setTemplate((prev) => prev + `\n${tag}`);
  };

  const handleReset = () => {
    if (confirm('Reset the WhatsApp message template back to the default format?')) {
      setTemplate(DEFAULT_TEMPLATE);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: whatsappNumber,
          whatsapp_order_template: template,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save WhatsApp settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
            <MessageCircle className="w-7 h-7 text-[#25D366]" />
            <span>WhatsApp Order Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your order receiving number and customize the exact message format sent on checkout.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          {errorMsg}
        </div>
      )}

      {/* WhatsApp Number Config */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Business Receiving Number</span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Active
          </span>
        </h2>

        <div className="max-w-md">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Store WhatsApp Number (with or without 91)
          </label>
          <div className="relative">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="8136819192"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            When a customer clicks checkout, WhatsApp will open a direct chat with this phone number containing their order message.
          </p>
        </div>
      </div>

      {/* Template Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT: Editor */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Edit Order Message Template
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the text sent when an order is completed.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Reset to default template"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Insert Variable Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Insert Variable Placeholders:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map(({ tag, label }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertTag(tag)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono font-semibold transition-colors border border-emerald-200/60"
                  title={`Insert ${label}`}
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1">
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={16}
              className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs sm:text-sm text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-inner"
              placeholder="Enter WhatsApp template..."
            />
            <p className="text-[11px] text-slate-400">
              Tip: Use WhatsApp bold syntax like <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">*bold*</code> to make text bold in WhatsApp messages.
            </p>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Live WhatsApp Message Preview</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                How this will appear inside WhatsApp on the customer &amp; admin phones.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Live Preview
            </span>
          </div>

          {/* WhatsApp Chat Simulation Container */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#E5DDD5] border border-stone-300 shadow-inner relative overflow-hidden min-h-[380px]">
            {/* Chat bubble */}
            <div className="max-w-[95%] bg-[#E1F7CB] text-slate-900 p-4 rounded-2xl rounded-tl-none shadow-sm text-xs sm:text-sm font-sans space-y-1 whitespace-pre-wrap leading-relaxed border border-[#cbe4b2]">
              {previewText}
              <div className="text-right text-[10px] text-slate-500 pt-1">
                Just now • Delivered ✓✓
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-900">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How Orders are Processed</span>
            </p>
            <p className="text-emerald-900/80 leading-relaxed">
              When a customer completes checkout, their order is securely saved into your Admin database, and WhatsApp opens with this pre-formatted message ready to send. Both the customer and admin can communicate directly in WhatsApp without requiring Meta Cloud API verification.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
