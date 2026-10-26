'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Subcategory, ProductVariant, StockStatus, VariantType } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { 
  Loader2, 
  ArrowLeft, 
  Trash2, 
  Check, 
  Star, 
  Plus, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  X,
  PackageCheck,
  PackageX,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { DeleteProductButton } from './DeleteProductButton';

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  subcategories?: Subcategory[];
  isEditing?: boolean;
}

interface FormVariant {
  id: string;
  variant_type: string;
  custom_type?: string;
  variant_value: string;
  price: string;
  stock: number;
  sku: string;
}

const VARIANT_TYPE_CONFIG: { type: string; label: string; icon: string }[] = [
  { type: 'Size', label: 'Size', icon: '📏' },
  { type: 'Volume', label: 'Volume (ml/L)', icon: '🧴' },
  { type: 'Weight', label: 'Weight (g/kg)', icon: '⚖️' },
  { type: 'Color', label: 'Color', icon: '🎨' },
  { type: 'Material', label: 'Material', icon: '🧵' },
  { type: 'Custom', label: 'Custom', icon: '⚙️' },
];

const VARIANT_PRESETS: Record<string, string[]> = {
  Size: ['Newborn', '0-3M', '0-6M', '3-6M', '6-12M', '12-18M', '18-24M', '2-3Y', '3-4Y', '4-5Y', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'],
  Volume: ['30 ml', '50 ml', '100 ml', '150 ml', '200 ml', '250 ml', '500 ml', '1 L'],
  Weight: ['50 g', '100 g', '150 g', '200 g', '250 g', '500 g', '1 kg'],
  Color: ['Blue', 'White', 'Red', 'Pink', 'Green', 'Yellow', 'Black', 'Grey', 'Cream', 'Beige', 'Orange', 'Purple', 'Brown'],
  Material: ['100% Organic Cotton', 'Muslin Cotton', 'Bamboo Fabric', 'Linen', 'Soft Wool', 'BPA-Free Silicone'],
};

function CustomVariantTypeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const current = VARIANT_TYPE_CONFIG.find((c) => c.type === value) || VARIANT_TYPE_CONFIG[0];

  return (
    <div className="relative w-40 shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-semibold text-slate-800 flex items-center justify-between gap-1.5 transition-all shadow-2xs cursor-pointer"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span>{current.icon}</span>
          <span>{current.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180 text-emerald-600' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Variant Type
          </div>
          {VARIANT_TYPE_CONFIG.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => {
                onChange(opt.type);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                value === opt.type
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </span>
              {value === opt.type && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomVariantValueCombobox({
  variantType,
  value,
  onChange,
}: {
  variantType: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const presets = VARIANT_PRESETS[variantType] || [];
  const quickChips = presets.slice(0, 5);

  const getPlaceholder = (type: string) => {
    if (type === 'Size') return 'e.g. 0-6M, 6-12M, S, M';
    if (type === 'Volume') return 'e.g. 50 ml, 100 ml, 1 L';
    if (type === 'Weight') return 'e.g. 50 g, 100 g, 1 kg';
    if (type === 'Color') return 'e.g. White, Sky Blue, Pink';
    if (type === 'Material') return 'e.g. 100% Organic Cotton';
    return 'Option value';
  };

  return (
    <div className="flex-1 space-y-1.5" ref={ref}>
      <div className="relative">
        <input
          type="text"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (presets.length > 0) setOpen(true);
          }}
          placeholder={getPlaceholder(variantType)}
          className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white shadow-2xs"
        />

        {presets.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
            title="Show presets"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180 text-emerald-600' : ''}`}
            />
          </button>
        )}

        {open && presets.length > 0 && (
          <div className="absolute left-0 top-full mt-1.5 w-full max-h-56 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Popular {variantType} Options (Click to select)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setOpen(false);
                  }}
                  className={`px-2.5 py-1.5 text-xs text-left rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    value === preset
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{preset}</span>
                  {value === preset && <Check className="w-3 h-3 text-emerald-700 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Select Chips */}
      {quickChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-medium">Suggestions:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChange(chip)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                value === chip
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-white hover:bg-emerald-50 hover:border-emerald-200 border-slate-200 text-slate-600'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Maximum allowed images for new uploads: 1 Main + 5 Gallery = 6 total images
const MAX_TOTAL_IMAGES = 6;

export function ProductForm({
  initialProduct,
  categories,
  subcategories = [],
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initial stock status determination
  const initialStockNum = initialProduct?.stock ?? 15;
  const initialStockStatus: StockStatus = initialProduct?.stock_status || (
    initialStockNum <= 0 ? 'out_of_stock' : initialStockNum <= 5 ? 'limited_stock' : 'in_stock'
  );

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    category_id: initialProduct?.category_id || categories[0]?.id || '',
    subcategory_id: initialProduct?.subcategory_id || '',
    price: initialProduct?.price || '',
    sale_price: initialProduct?.sale_price || '',
    sku: initialProduct?.sku || '',
    stock: initialStockNum,
    stock_status: initialStockStatus,
    gender: initialProduct?.gender || 'Unisex',
    age_group: initialProduct?.age_group || '0-24M',
    short_description: initialProduct?.short_description || '',
    description: initialProduct?.description || '',
    material: initialProduct?.material || '',
    care_instructions: initialProduct?.care_instructions || '',
    featuresText: initialProduct?.features?.join('\n') || 'Ultra soft breathable fabric\nSnap bottom closures\nTagless comfort label',
    is_featured: initialProduct?.is_featured ?? false,
    is_new: initialProduct?.is_new ?? true,
    is_best_seller: initialProduct?.is_best_seller ?? false,
    is_active: initialProduct?.is_active ?? true,
  });

  // PRESERVE ALL EXISTING IMAGES: If an existing product has 8 or more images, keep all of them!
  const [images, setImages] = useState(initialProduct?.images || []);

  // Initialize variants from initialProduct.variants or from existing sizes/colors
  const getInitialVariants = (): FormVariant[] => {
    const loaded: FormVariant[] = [];

    // 1. If product already has variants configured, load them with intelligent type detection
    if (initialProduct?.variants && initialProduct.variants.length > 0) {
      initialProduct.variants.forEach((v, i) => {
        let vType = v.variant_type;
        let val = (v.variant_value || v.size || v.color || v.title || '').trim();
        const prefixMatch = (v.title || '').match(/^\[([A-Za-z]+)\]\s*(.*)$/);
        if (prefixMatch) {
          vType = prefixMatch[1] as any;
          val = prefixMatch[2] || val;
        }

        if (!vType || vType === 'Option' || vType === 'Size') {
          const valLower = val.toLowerCase();
          if (/\b\d+\s*(ml|l|litre|liter|litres|liters)\b/i.test(valLower)) {
            vType = 'Volume';
          } else if (/\b\d+\s*(g|gm|gms|kg|kgs|gram|grams)\b/i.test(valLower)) {
            vType = 'Weight';
          } else if (/\b(fabric|cotton|muslin|linen|bamboo|wool|silicone|leather|polyester|denim|modal|fleece|satin|wood)\b/i.test(valLower)) {
            vType = 'Material';
          } else {
            const commonColors = ['red', 'blue', 'green', 'white', 'black', 'pink', 'yellow', 'mint', 'cream', 'peach', 'grey', 'gray', 'beige', 'navy', 'brown', 'purple', 'orange'];
            if (v.color || commonColors.some(c => valLower.includes(c))) {
              vType = 'Color';
            } else if (v.size || /^(newborn|nb|\d+-\d+\s*m|\d+\s*m|\d+-\d+\s*y|\d+\s*y|xs|s|m|l|xl|xxl|free\s*size)$/i.test(valLower) || /month|year|size/i.test(valLower)) {
              vType = 'Size';
            }
          }
        }

        loaded.push({
          id: v.id || `var-${Date.now()}-${i}`,
          variant_type: vType || 'Size',
          custom_type: '',
          variant_value: val,
          price: v.price ? String(v.price) : '',
          stock: v.stock ?? 15,
          sku: v.sku || '',
        });
      });
    }

    // 2. Backward compatibility: If product has legacy sizes not yet in loaded variants
    if (initialProduct?.sizes && initialProduct.sizes.length > 0) {
      initialProduct.sizes.forEach((s, idx) => {
        const sVal = s.trim();
        if (sVal && !loaded.some(v => v.variant_value.toLowerCase() === sVal.toLowerCase())) {
          loaded.push({
            id: `var-size-${idx}-${Date.now()}`,
            variant_type: 'Size',
            custom_type: '',
            variant_value: sVal,
            price: '',
            stock: initialProduct.stock || 15,
            sku: initialProduct.sku ? `${initialProduct.sku}-${sVal}` : '',
          });
        }
      });
    }

    // 3. Backward compatibility: If product has legacy colors not yet in loaded variants
    if (initialProduct?.colors && initialProduct.colors.length > 0) {
      initialProduct.colors.forEach((c, idx) => {
        const cVal = c.trim();
        if (cVal && !loaded.some(v => v.variant_value.toLowerCase() === cVal.toLowerCase())) {
          loaded.push({
            id: `var-color-${idx}-${Date.now()}`,
            variant_type: 'Color',
            custom_type: '',
            variant_value: cVal,
            price: '',
            stock: initialProduct.stock || 15,
            sku: initialProduct.sku ? `${initialProduct.sku}-${cVal}` : '',
          });
        }
      });
    }

    if (loaded.length > 0) {
      return loaded;
    }

    // Default starting variant for a new product
    return [
      {
        id: `var-${Date.now()}-0`,
        variant_type: 'Size',
        custom_type: '',
        variant_value: '0-6M',
        price: '',
        stock: 15,
        sku: '',
      },
      {
        id: `var-${Date.now()}-1`,
        variant_type: 'Size',
        custom_type: '',
        variant_value: '6-12M',
        price: '',
        stock: 15,
        sku: '',
      },
    ];
  };

  const [variants, setVariants] = useState<FormVariant[]>(getInitialVariants());
  const [showComboModal, setShowComboModal] = useState(false);
  const [comboAttr1, setComboAttr1] = useState({ name: 'Size', values: '0-6M, 6-12M' });
  const [comboAttr2, setComboAttr2] = useState({ name: 'Color', values: 'Mint, Cream' });

  // Handle name input and auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : autoSlug,
    }));
  };

  // Stock status quick click
  const handleStockStatusChange = (status: StockStatus) => {
    setFormData((prev) => {
      let newStock = prev.stock;
      if (status === 'out_of_stock') {
        newStock = 0;
      } else if (status === 'limited_stock') {
        if (newStock <= 0 || newStock > 5) newStock = 5;
      } else if (status === 'in_stock') {
        if (newStock <= 0) newStock = 15;
      }
      return {
        ...prev,
        stock_status: status,
        stock: newStock,
      };
    });
  };

  // Stock quantity manual change
  const handleStockQtyChange = (val: number) => {
    const stockNum = Math.max(0, val);
    let autoStatus: StockStatus = formData.stock_status;
    if (stockNum === 0) {
      autoStatus = 'out_of_stock';
    } else if (stockNum <= 5) {
      autoStatus = 'limited_stock';
    } else {
      autoStatus = 'in_stock';
    }
    setFormData((prev) => ({
      ...prev,
      stock: stockNum,
      stock_status: autoStatus,
    }));
  };

  // Image upload handling with max 5 gallery + 1 main = 6 images limit
  const handleAddUploadedImage = (url: string, publicId?: string) => {
    if (!url) return;
    setImages((prev) => {
      // Don't add if limit reached
      if (prev.length >= MAX_TOTAL_IMAGES) return prev;
      return [
        ...prev,
        {
          id: `img-${Date.now()}`,
          cloudinary_url: url,
          cloudinary_public_id: publicId,
          sort_order: prev.length,
          is_primary: prev.length === 0,
        },
      ];
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  // Dynamic Variant Management Functions
  const handleAddVariant = () => {
    const lastVariant = variants[variants.length - 1];
    setVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        variant_type: lastVariant ? lastVariant.variant_type : 'Size',
        custom_type: lastVariant?.custom_type || '',
        variant_value: '',
        price: '',
        stock: 15,
        sku: '',
      },
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof FormVariant, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      // Keep at least one variant row available
      setVariants([
        {
          id: `var-${Date.now()}`,
          variant_type: 'Size',
          custom_type: '',
          variant_value: '',
          price: '',
          stock: 15,
          sku: '',
        },
      ]);
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Preset loaders for quick setup
  const applyPreset = (type: string, values: string[]) => {
    const newVariants: FormVariant[] = values.map((val, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      variant_type: type,
      custom_type: '',
      variant_value: val,
      price: '',
      stock: 15,
      sku: formData.sku ? `${formData.sku}-${val.toLowerCase().replace(/\s+/g, '')}` : '',
    }));
    setVariants(newVariants);
  };

  // Apply Attribute Combinations (e.g. Size x Color)
  const handleGenerateCombinations = () => {
    const vals1 = comboAttr1.values.split(',').map((s) => s.trim()).filter(Boolean);
    const vals2 = comboAttr2.values.split(',').map((s) => s.trim()).filter(Boolean);

    if (vals1.length === 0) return;

    const generated: FormVariant[] = [];
    if (vals2.length > 0) {
      vals1.forEach((v1) => {
        vals2.forEach((v2) => {
          generated.push({
            id: `var-combo-${Date.now()}-${generated.length}`,
            variant_type: `${comboAttr1.name} & ${comboAttr2.name}`,
            custom_type: '',
            variant_value: `${v1} / ${v2}`,
            price: '',
            stock: 15,
            sku: formData.sku ? `${formData.sku}-${v1.replace(/\s+/g, '')}-${v2.replace(/\s+/g, '')}` : '',
          });
        });
      });
    } else {
      vals1.forEach((v1) => {
        generated.push({
          id: `var-single-${Date.now()}-${generated.length}`,
          variant_type: comboAttr1.name,
          custom_type: '',
          variant_value: v1,
          price: '',
          stock: 15,
          sku: formData.sku ? `${formData.sku}-${v1.replace(/\s+/g, '')}` : '',
        });
      });
    }

    if (generated.length > 0) {
      setVariants(generated);
      setShowComboModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name || !formData.price) {
      setErrorMessage('Product title and price are required.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload at least one product image.');
      return;
    }

    // Validate variants
    const validVariants: ProductVariant[] = [];
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const val = v.variant_value.trim();
      if (!val) {
        setErrorMessage(`Please enter a value for variant row #${i + 1}.`);
        return;
      }
      const vType = v.variant_type === 'Custom' ? (v.custom_type?.trim() || 'Custom') : v.variant_type;
      validVariants.push({
        id: v.id,
        title: val,
        variant_type: vType,
        variant_value: val,
        size: vType === 'Size' ? val : undefined,
        color: vType === 'Color' ? val : undefined,
        sku: v.sku.trim() || undefined,
        price: v.price ? Number(v.price) : null,
        stock: Math.max(0, Number(v.stock ?? 0)),
      });
    }

    // Calculate sum of stock if variants have inventory
    const totalVariantStock = validVariants.reduce((acc, curr) => acc + (curr.stock || 0), 0);
    const finalStock = formData.stock_status === 'out_of_stock' 
      ? 0 
      : Math.max(Number(formData.stock), totalVariantStock > 0 ? totalVariantStock : Number(formData.stock));

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        sku: formData.sku,
        stock: finalStock,
        stock_status: formData.stock_status,
        gender: formData.gender,
        age_group: formData.age_group,
        short_description: formData.short_description,
        description: formData.description,
        material: formData.material,
        care_instructions: formData.care_instructions,
        // Legacy size and color compatibility extracted from variants
        sizes: validVariants
          .filter((v) => v.variant_type === 'Size')
          .map((v) => v.variant_value || v.title),
        colors: validVariants
          .filter((v) => v.variant_type === 'Color')
          .map((v) => v.variant_value || v.title),
        variants: validVariants,
        features: formData.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        is_best_seller: formData.is_best_seller,
        is_active: formData.is_active,
        images,
      };

      const url = isEditing && initialProduct?.id
        ? `/api/products/${initialProduct.id}`
        : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccessMessage(isEditing ? 'Product updated successfully.' : 'Product created successfully.');
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const isAtOrAboveImageLimit = images.length >= MAX_TOTAL_IMAGES;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Top Header / Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/products"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Listing</span>
        </Link>
        <div className="flex items-center gap-2.5">
          {isEditing && initialProduct && (
            <DeleteProductButton
              productId={initialProduct.id}
              productName={initialProduct.name}
              variant="button"
              redirectOnDelete="/admin/products"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>Save Product</span>
            )}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. General Information */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>1. General Information</span>
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Product Title *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. Floral Muslin Romper / Gentle Baby Lotion"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Subcategory (Optional)
            </label>
            <select
              value={formData.subcategory_id}
              onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="">None / All Category</option>
              {subcategories
                .filter((s) => s.category_id === formData.category_id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Short Summary / Tagline
          </label>
          <input
            type="text"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="e.g. Pure organic muslin cotton romper with easy snaps"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Comprehensive description of product fabric, formulation, safety, etc."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Pricing & Stock Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <h2 className="font-heading font-bold text-base text-slate-900">
            2. Pricing & Inventory Status
          </h2>
          <span className="text-xs text-slate-400">
            Control base pricing & availability across storefront
          </span>
        </div>

        {/* Stock Status Selector Bar */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Stock Availability Status *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleStockStatusChange('in_stock')}
              className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                formData.stock_status === 'in_stock'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <PackageCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold text-xs sm:text-sm">Stock Full / In Stock</span>
                <span className="text-[11px] text-slate-500">Available for customer checkout</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleStockStatusChange('limited_stock')}
              className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                formData.stock_status === 'limited_stock'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold text-xs sm:text-sm">Limited Stock</span>
                <span className="text-[11px] text-slate-500">Few units left banner</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleStockStatusChange('out_of_stock')}
              className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer text-left ${
                formData.stock_status === 'out_of_stock'
                  ? 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <PackageX className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold text-xs sm:text-sm">Out of Stock</span>
                <span className="text-[11px] text-slate-500">Faded card + Out of Stock overlay</span>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Regular Price (₹) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sale Price (₹)
            </label>
            <input
              type="number"
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              placeholder="Leave empty if none"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.stock}
              onChange={(e) => handleStockQtyChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Base SKU Code
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. BC-101"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Product Images (1 Main + 5 Gallery = 6 Images Limit, Existing Preserved) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              3. Product Images (1 Main Image + Up to 5 Gallery Images)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard max limit: 6 total images (1 main + 5 gallery). All existing saved images are fully preserved.
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            images.length >= MAX_TOTAL_IMAGES
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {images.length} / {Math.max(MAX_TOTAL_IMAGES, images.length)} Images
          </span>
        </div>

        {/* Existing images list */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className={`relative rounded-xl border-2 p-1.5 bg-slate-50 flex flex-col justify-between transition-all ${
                  img.is_primary ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200'
                }`}
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.cloudinary_url}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  {img.is_primary ? (
                    <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                      MAIN
                    </span>
                  ) : (
                    <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                      #{idx}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(idx)}
                    className={`text-[10px] font-semibold flex items-center gap-0.5 transition-colors cursor-pointer ${
                      img.is_primary ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-700'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${img.is_primary ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>{img.is_primary ? 'Main' : 'Make Main'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploader or Maximum Reached Notice */}
        {!isAtOrAboveImageLimit ? (
          <ImageUploader
            label={`Upload Image (${images.length} added, ${MAX_TOTAL_IMAGES - images.length} remaining)`}
            onUploadComplete={handleAddUploadedImage}
            resetOnSuccess={true}
          />
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block">
                Maximum image limit reached (1 main + 5 gallery = 6 images)
              </span>
              Existing uploaded images are preserved. If you want to upload a new image, please remove one of the current images above first.
            </div>
          </div>
        )}
      </div>

      {/* 4. Dynamic Variants, Material & Care */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>4. Dynamic Product Variants & Measurement Options</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Support any measurement type: Clothes Sizes, Lotion Volumes (ml), Powder Weights (g), or multiple attributes with custom price, stock, and SKU.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowComboModal(true)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Combinations Generator</span>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider shrink-0 mr-1">
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('Size', ['Newborn', '0-3M', '3-6M', '6-12M', '12-18M'])}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            👕 Clothes (Sizes: 0-3M, 3-6M...)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('Volume', ['50 ml', '100 ml', '200 ml', '500 ml'])}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            🧴 Lotion / Liquid (Volume: 50ml, 100ml...)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('Weight', ['50 g', '100 g', '200 g', '500 g'])}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            ✨ Powder / Cream (Weight: 50g, 100g...)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('Color', ['Blue', 'White', 'Red', 'Pink'])}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            🎨 Colors (Blue, White, Red, Pink...)
          </button>
        </div>

        {/* Dynamic Variant Rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Configured Variants ({variants.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Pricing and stock are managed globally in Section 2 above
            </span>
          </div>

          <div className="space-y-2.5">
            {variants.map((v, idx) => (
              <div
                key={v.id || idx}
                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex items-start gap-3 transition-all hover:bg-white hover:border-emerald-200 shadow-2xs"
              >
                {/* Variant Number Indicator */}
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-1">
                  {idx + 1}
                </span>

                {/* Type Selection with Custom BabyCry Dropdown */}
                <CustomVariantTypeDropdown
                  value={v.variant_type}
                  onChange={(val) => handleUpdateVariant(idx, 'variant_type', val)}
                />

                {/* Custom Type Name input if Custom is chosen */}
                {v.variant_type === 'Custom' && (
                  <div className="w-32 shrink-0">
                    <input
                      type="text"
                      placeholder="Type name (e.g. Scent)"
                      value={v.custom_type || ''}
                      onChange={(e) => handleUpdateVariant(idx, 'custom_type', e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>
                )}

                {/* Value / Title with Smart Preset Combobox & Quick Chips */}
                <CustomVariantValueCombobox
                  variantType={v.variant_type}
                  value={v.variant_value}
                  onChange={(val) => handleUpdateVariant(idx, 'variant_value', val)}
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Remove variant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Add Variant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Product Specifications & Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>5. Product Specifications &amp; Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured details will be displayed under &quot;Fabric &amp; Care&quot; on the storefront product page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Unisex' | 'Girls' | 'Boys' | 'Baby' })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:border-emerald-600 font-medium cursor-pointer shadow-2xs"
            >
              <option value="Unisex">Unisex (All)</option>
              <option value="Baby">Baby</option>
              <option value="Girls">Girls</option>
              <option value="Boys">Boys</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Age Group (Type or Pick)
            </label>
            <input
              type="text"
              list="age-group-presets"
              value={formData.age_group}
              onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
              placeholder="e.g. 0-24M, 2-4 Years, All Ages"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:border-emerald-600 font-medium shadow-2xs"
            />
            <datalist id="age-group-presets">
              <option value="0-24M" />
              <option value="0-3M" />
              <option value="0-6M" />
              <option value="6-12M" />
              <option value="12-24M" />
              <option value="2-4 Years" />
              <option value="4+ Years" />
              <option value="All Ages" />
              <option value="Not Applicable" />
            </datalist>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['0-24M', '0-6M', '6-12M', '1-2Y', '2-4Y', 'All Ages'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setFormData({ ...formData, age_group: chip })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                    formData.age_group === chip
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-white hover:bg-emerald-50 hover:border-emerald-200 border-slate-200 text-slate-600'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fabric Material / Formulation
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="e.g. 100% Organic Cotton / BPA-Free"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Care Instructions / Usage
            </label>
            <input
              type="text"
              value={formData.care_instructions}
              onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
              placeholder="e.g. Machine wash cold / Wipe clean"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Key Features (One feature per line)
          </label>
          <textarea
            rows={3}
            value={formData.featuresText}
            onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
            placeholder="Ultra soft breathable fabric&#10;Snap bottom closures&#10;Tagless comfort label"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 leading-relaxed"
          />
        </div>
      </div>

      {/* 6. Badges & Visibility */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          6. Badges & Visibility
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_new}
              onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">NEW Badge</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">Featured</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_best_seller}
              onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">Best Seller</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">Active (Public)</span>
          </label>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
        <Link
          href="/admin/products"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </Link>
        <div className="flex items-center gap-2.5">
          {isEditing && initialProduct && (
            <DeleteProductButton
              productId={initialProduct.id}
              productName={initialProduct.name}
              variant="button"
              redirectOnDelete="/admin/products"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>Save Product</span>
            )}
          </button>
        </div>
      </div>

      {/* Attribute Combinations Modal */}
      {showComboModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Combinations Generator</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowComboModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Generate matrix combinations for products with two attributes (e.g. Size + Color).
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">
                      Attribute 1 Name
                    </label>
                    <input
                      type="text"
                      value={comboAttr1.name}
                      onChange={(e) => setComboAttr1({ ...comboAttr1, name: e.target.value })}
                      placeholder="e.g. Size"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">
                      Values (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={comboAttr1.values}
                      onChange={(e) => setComboAttr1({ ...comboAttr1, values: e.target.value })}
                      placeholder="0-6M, 6-12M"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">
                      Attribute 2 Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={comboAttr2.name}
                      onChange={(e) => setComboAttr2({ ...comboAttr2, name: e.target.value })}
                      placeholder="e.g. Color"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">
                      Values (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={comboAttr2.values}
                      onChange={(e) => setComboAttr2({ ...comboAttr2, values: e.target.value })}
                      placeholder="Mint, Cream"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowComboModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateCombinations}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Combinations</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
