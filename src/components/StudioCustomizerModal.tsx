import React, { useRef, useState } from 'react';
import {
  X,
  Upload,
  Palette,
  Layers,
  Image as ImageIcon,
  PhoneCall,
  Plus,
  Trash2,
  FileText,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  BusinessConfig,
  DEFAULT_BUSINESS_CONFIG,
  extractColorsFromLogo,
  parseUploadedDetailsText,
  RawBeforeAfterItem,
  ServiceItem,
} from '../utils/brandUtils';

interface StudioCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  onUpdateConfig: (next: BusinessConfig) => void;
  onReplayIntro: () => void;
}

type StudioTab = 'brand' | 'services' | 'before-after' | 'contacts';

export const StudioCustomizerModal: React.FC<StudioCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onReplayIntro,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('brand');
  const [rawDetailsInput, setRawDetailsInput] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // New Before/After upload state
  const [baUploadMode, setBaUploadMode] = useState<'single' | 'pair'>('single');
  const [baTitle, setBaTitle] = useState('');
  const [baCaption, setBaCaption] = useState('');
  const [pairBeforeUrl, setPairBeforeUrl] = useState<string | null>(null);
  const [pairAfterUrl, setPairAfterUrl] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const detailsFileInputRef = useRef<HTMLInputElement>(null);
  const baSingleInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  // Handle Logo Upload & Automatic Theme Color Extraction
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;
      const { primaryHex, swatches } = await extractColorsFromLogo(dataUrl);
      onUpdateConfig({
        ...config,
        logoDataUrl: dataUrl,
        themeColor: primaryHex,
        extractedSwatches: swatches,
      });
      showToast(`Logo uploaded & theme synced to ${primaryHex}`);
    };
    reader.readAsDataURL(file);
  };

  // Handle Bulk Text / File Upload for Contacts, Services & Pricing
  const handleDetailsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (!content) return;
      setRawDetailsInput(content);
      const parsed = parseUploadedDetailsText(content, config);
      onUpdateConfig({
        ...config,
        ...parsed,
        contact: { ...config.contact, ...(parsed.contact || {}) },
      });
      showToast('Uploaded business details, services & pricing applied.');
    };
    reader.readAsText(file);
  };

  const handleApplyPastedDetails = () => {
    if (!rawDetailsInput.trim()) return;
    const parsed = parseUploadedDetailsText(rawDetailsInput, config);
    onUpdateConfig({
      ...config,
      ...parsed,
      contact: { ...config.contact, ...(parsed.contact || {}) },
    });
    showToast('Pasted details & pricing applied to website.');
  };

  // Handle Service Photo Upload
  const handleServiceImageUpload = (serviceId: string, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;
      const updated = config.services.map((s) =>
        s.id === serviceId ? { ...s, imageUrl: dataUrl } : s
      );
      onUpdateConfig({ ...config, services: updated });
      showToast('Service image updated.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateServiceField = (
    serviceId: string,
    field: keyof ServiceItem,
    value: string
  ) => {
    const updated = config.services.map((s) =>
      s.id === serviceId ? { ...s, [field]: value } : s
    );
    onUpdateConfig({ ...config, services: updated });
  };

  const handleAddService = () => {
    const nextIdx = config.services.length + 1;
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      number: String(nextIdx).padStart(2, '0'),
      title: 'Bespoke Protection Package',
      tagline: 'Full exterior decontamination and hydrophobic sealant.',
      price: '$450',
      duration: '1 Day',
      imageUrl: '/src/assets/images/service_ceramic_coating_1791040789542.jpg',
      span: 'standard',
    };
    onUpdateConfig({
      ...config,
      services: [...config.services, newService],
    });
  };

  const handleDeleteService = (serviceId: string) => {
    const filtered = config.services
      .filter((s) => s.id !== serviceId)
      .map((s, idx) => ({
        ...s,
        number: String(idx + 1).padStart(2, '0'),
      }));
    onUpdateConfig({ ...config, services: filtered });
  };

  // Handle As-Is Before & After Upload (Multiple or Single, Zero Modification)
  const handleBeforeAfterSingleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!dataUrl) return;
        const newItem: RawBeforeAfterItem = {
          id: `ba-${Date.now()}-${index}`,
          title:
            baTitle.trim() ||
            file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          caption: baCaption.trim() || 'Uploaded raw studio documentation (unmodified)',
          singleImageUrl: dataUrl,
          uploadedAt: 'Uploaded As-Is',
        };
        onUpdateConfig({
          ...config,
          beforeAfterGallery: [newItem, ...config.beforeAfterGallery],
        });
      };
      reader.readAsDataURL(file);
    });

    setBaTitle('');
    setBaCaption('');
    showToast('Before & After image(s) pasted directly without modification.');
  };

  const handlePairImageRead = (
    file: File | undefined,
    target: 'before' | 'after'
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (target === 'before') setPairBeforeUrl(dataUrl);
      else setPairAfterUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPairBeforeAfter = () => {
    if (!pairBeforeUrl || !pairAfterUrl) return;
    const newItem: RawBeforeAfterItem = {
      id: `ba-pair-${Date.now()}`,
      title: baTitle.trim() || 'Before & After Comparison',
      caption: baCaption.trim() || 'Side-by-side raw images (unmodified)',
      beforeImageUrl: pairBeforeUrl,
      afterImageUrl: pairAfterUrl,
      uploadedAt: 'Uploaded As-Is',
    };
    onUpdateConfig({
      ...config,
      beforeAfterGallery: [newItem, ...config.beforeAfterGallery],
    });
    setPairBeforeUrl(null);
    setPairAfterUrl(null);
    setBaTitle('');
    setBaCaption('');
    showToast('Before & After pair pasted directly without modification.');
  };

  const handleDeleteBeforeAfter = (id: string) => {
    onUpdateConfig({
      ...config,
      beforeAfterGallery: config.beforeAfterGallery.filter((item) => item.id !== id),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Brand and Content Upload Studio"
    >
      <div className="relative w-full max-w-2xl bg-[#0E1015] border-l border-white/10 h-full flex flex-col text-[#F4F4F6] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold tracking-tight font-display">
              Brand & Content Upload Studio
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Upload your logo (auto-themes website), services, pricing, contacts, and raw Before & After photos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReplayIntro();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/15 text-neutral-200 hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Replay Intro Animation
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Tab Selector */}
        <div className="px-6 pt-3 pb-0 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'brand'
                ? 'border-[var(--brand-accent)] text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            1. Logo & Theme Color
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-[var(--brand-accent)] text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2. Services & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('before-after')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'before-after'
                ? 'border-[var(--brand-accent)] text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            3. Before & After (As-Is)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'border-[var(--brand-accent)] text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            4. Contacts & Bulk Import
          </button>
        </div>

        {/* Status Feedback Banner */}
        {statusNotice && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-lg bg-white/5 border border-[var(--brand-accent)]/50 flex items-center gap-2 text-xs text-white">
            <Check className="w-4 h-4 text-[var(--brand-accent)] shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LOGO & THEME COLOR */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Upload Business Logo (Auto-Extracts Website Theme)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      When you upload your logo, the website automatically analyzes its pixels and sets the primary theme accent to match your logo.
                    </p>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-accent)] text-[var(--brand-accent-contrast)] hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Logo
                  </button>
                </div>

                {config.logoDataUrl && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={config.logoDataUrl}
                        alt="Uploaded Business Logo"
                        referrerPolicy="no-referrer"
                        className="h-12 w-auto max-w-[140px] object-contain rounded"
                      />
                      <div className="text-xs">
                        <div className="font-medium text-white">Active Logo Loaded</div>
                        <div className="text-neutral-400">
                          Extracted Theme: <span className="font-mono-tabular text-white">{config.themeColor}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateConfig({ ...config, logoDataUrl: null })
                      }
                      className="text-xs text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      Remove Logo
                    </button>
                  </div>
                )}

                {/* Extracted Logo Swatches + Manual Color Picker */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs text-neutral-400 block">
                      Logo Palette Swatches (Click to switch theme color)
                    </span>
                    <div className="flex items-center gap-2.5">
                      {config.extractedSwatches.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() =>
                            onUpdateConfig({ ...config, themeColor: hex })
                          }
                          className={`w-8 h-8 rounded-lg border transition-transform ${
                            config.themeColor.toUpperCase() === hex.toUpperCase()
                              ? 'scale-110 border-white ring-2 ring-white/40'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: hex }}
                          title={`Apply ${hex}`}
                          aria-label={`Apply theme color ${hex}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 block">
                      Fine-Tune Hex Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.themeColor}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            themeColor: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-9 h-9 rounded cursor-pointer bg-transparent border border-white/20"
                      />
                      <input
                        type="text"
                        value={config.themeColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                            onUpdateConfig({ ...config, themeColor: val });
                          }
                        }}
                        className="w-28 px-3 py-1.5 text-xs font-mono-tabular bg-black/50 border border-white/15 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Name & Simple Hero Copy */}
              <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
                <h3 className="text-sm font-semibold text-white">
                  Brand Name & Minimal Hero Headline
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={config.brandName}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, brandName: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/15 rounded-lg text-white focus:outline-none focus:border-[var(--brand-accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Single Hero CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={config.ctaText}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, ctaText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/15 rounded-lg text-white focus:outline-none focus:border-[var(--brand-accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Bold Hero Headline
                  </label>
                  <input
                    type="text"
                    value={config.heroHeadline}
                    onChange={(e) =>
                      onUpdateConfig({ ...config, heroHeadline: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/15 rounded-lg text-white focus:outline-none focus:border-[var(--brand-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Brief Subtitle (Keep concise)
                  </label>
                  <input
                    type="text"
                    value={config.heroSubheadline}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        heroSubheadline: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/15 rounded-lg text-white focus:outline-none focus:border-[var(--brand-accent)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Visual Service Cards & Pricing ({config.services.length})
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Each service focuses on high-impact imagery, concise title, and clear pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-accent)] text-[var(--brand-accent-contrast)] flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {config.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-xl bg-[#141720] border border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={srv.imageUrl}
                          alt={srv.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-mono-tabular text-[var(--brand-accent)]">
                            {srv.number}.
                          </span>{' '}
                          <span className="text-sm font-semibold text-white">
                            {srv.title}
                          </span>
                          <div className="text-xs text-neutral-400 font-mono-tabular">
                            {srv.price} · {srv.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors whitespace-nowrap">
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleServiceImageUpload(srv.id, e.target.files?.[0])
                            }
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                          aria-label={`Remove ${srv.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Service Name
                        </label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) =>
                            handleUpdateServiceField(srv.id, 'title', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Price
                        </label>
                        <input
                          type="text"
                          value={srv.price}
                          onChange={(e) =>
                            handleUpdateServiceField(srv.id, 'price', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs font-mono-tabular bg-black/40 border border-white/15 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          One-Line Visual Caption
                        </label>
                        <input
                          type="text"
                          value={srv.tagline}
                          onChange={(e) =>
                            handleUpdateServiceField(
                              srv.id,
                              'tagline',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={srv.duration}
                          onChange={(e) =>
                            handleUpdateServiceField(
                              srv.id,
                              'duration',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BEFORE & AFTER IMAGES (PASTED AS-IS, NO MODIFICATION) */}
          {activeTab === 'before-after' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Upload Before & After Images (Pasted As-Is)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Your uploaded Before & After images are displayed 100% untouched—no cropping, no color filters, and no overlays.
                    </p>
                  </div>
                </div>

                {/* Mode selector */}
                <div className="flex items-center gap-2 p-1 bg-black/40 rounded-lg border border-white/10 w-fit">
                  <button
                    type="button"
                    onClick={() => setBaUploadMode('single')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      baUploadMode === 'single'
                        ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-contrast)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Upload Single / Pre-Combined Photo(s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBaUploadMode('pair')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      baUploadMode === 'pair'
                        ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-contrast)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Upload Separate Before + After Pair
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Porsche 911 GT3 Paint Correction"
                      value={baTitle}
                      onChange={(e) => setBaTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Unedited studio inspection lighting"
                      value={baCaption}
                      onChange={(e) => setBaCaption(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    />
                  </div>
                </div>

                {baUploadMode === 'single' ? (
                  <div>
                    <input
                      ref={baSingleInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBeforeAfterSingleFiles}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => baSingleInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-white/20 hover:border-[var(--brand-accent)] rounded-xl flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/40 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-[var(--brand-accent)]" />
                      <span className="text-xs font-semibold text-white">
                        Select Before/After Image(s) to Paste As-Is
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Preserves original dimensions, resolution, and pixels without modification
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="p-4 border border-dashed border-white/20 hover:border-[var(--brand-accent)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-black/20">
                        <Upload className="w-5 h-5 text-neutral-300" />
                        <span className="text-xs font-medium text-white">
                          {pairBeforeUrl ? 'Before Photo Ready ✓' : 'Select "Before" Photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handlePairImageRead(e.target.files?.[0], 'before')
                          }
                          className="hidden"
                        />
                      </label>
                      <label className="p-4 border border-dashed border-white/20 hover:border-[var(--brand-accent)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-black/20">
                        <Upload className="w-5 h-5 text-[var(--brand-accent)]" />
                        <span className="text-xs font-medium text-white">
                          {pairAfterUrl ? 'After Photo Ready ✓' : 'Select "After" Photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handlePairImageRead(e.target.files?.[0], 'after')
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      disabled={!pairBeforeUrl || !pairAfterUrl}
                      onClick={handleAddPairBeforeAfter}
                      className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-accent)] text-[var(--brand-accent-contrast)] disabled:opacity-40 transition-opacity"
                    >
                      Paste Before & After Pair As-Is
                    </button>
                  </div>
                )}
              </div>

              {/* Existing Before & After Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-neutral-300">
                  Current Before & After Showcase ({config.beforeAfterGallery.length})
                </h4>
                {config.beforeAfterGallery.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#141720] border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.singleImageUrl || item.afterImageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-14 object-contain bg-black rounded border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {item.caption}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteBeforeAfter(item.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACTS & BULK FILE/TEXT UPLOAD */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
                <h3 className="text-sm font-semibold text-white">
                  Direct Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={config.contact.phone}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          contact: { ...config.contact, phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-lg text-white font-mono-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Booking Email
                    </label>
                    <input
                      type="email"
                      value={config.contact.email}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          contact: { ...config.contact, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Studio Address
                    </label>
                    <input
                      type="text"
                      value={config.contact.address}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          contact: {
                            ...config.contact,
                            address: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={config.contact.hours}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          contact: { ...config.contact, hours: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Upload / Paste Details Sheet */}
              <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--brand-accent)]" />
                      Quick Upload Details File (.txt, .csv, .json) or Paste Text
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Have a document with your business name, contacts, services, and pricing? Upload or paste it below.
                    </p>
                  </div>
                  <input
                    ref={detailsFileInputRef}
                    type="file"
                    accept=".txt,.csv,.json,.md"
                    onChange={handleDetailsFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => detailsFileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                  </button>
                </div>

                <textarea
                  rows={5}
                  placeholder={`Business: Apex Auto Detailing\nPhone: (555) 234-8910\nEmail: book@apexdetail.com\nAddress: 1200 Motor Way, Austin, TX\nPaint Enhancement - $550 - Single stage polish & sealant\nCeramic Coating - $990 - 5-year 9H protection\nInterior Deep Clean - $320 - Full leather & steam reset`}
                  value={rawDetailsInput}
                  onChange={(e) => setRawDetailsInput(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-black/50 border border-white/15 rounded-lg text-neutral-200 focus:outline-none focus:border-[var(--brand-accent)]"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateConfig(DEFAULT_BUSINESS_CONFIG);
                      showToast('Reset to default studio configuration.');
                    }}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default Demo Data
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyPastedDetails}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-accent)] text-[var(--brand-accent-contrast)] hover:opacity-90 transition-opacity"
                  >
                    Parse & Apply Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-[#0A0B0E]">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span
              className="w-3 h-3 rounded-full inline-block border border-white/20"
              style={{ backgroundColor: config.themeColor }}
            />
            <span>Active Theme Color:</span>
            <span className="font-mono-tabular text-white">{config.themeColor}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Done & View Website
          </button>
        </div>
      </div>
    </div>
  );
};
