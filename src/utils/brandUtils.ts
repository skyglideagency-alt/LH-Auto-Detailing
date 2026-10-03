import { LH_LOGO_SVG_DATA_URL, VehicleTier } from '../components/LHBrandAssets';

export interface TierPricing {
  sedan: string;
  suv: string;
  truck: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  price: string;
  tierPrices?: TierPricing;
  duration: string;
  imageUrl: string;
  span?: 'wide' | 'standard';
}

export interface RawBeforeAfterItem {
  id: string;
  title: string;
  caption: string;
  /** Single unmodified image uploaded as-is */
  singleImageUrl?: string;
  /** Separate unmodified Before & After pair uploaded as-is */
  beforeImageUrl?: string;
  afterImageUrl?: string;
  uploadedAt: string;
}

export interface BusinessConfig {
  brandName: string;
  logoDataUrl: string | null;
  themeColor: string;
  extractedSwatches: string[];
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  outroHeadline: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    instagram: string;
  };
  services: ServiceItem[];
  addOns: AddOnItem[];
  beforeAfterGallery: RawBeforeAfterItem[];
}

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  brandName: 'LH Auto Detailing',
  logoDataUrl: LH_LOGO_SVG_DATA_URL,
  themeColor: '#4A78D0',
  extractedSwatches: ['#4A78D0', '#33599E', '#9AB3DF', '#353B49', '#60A5FA'],
  heroHeadline: 'Showroom Shine. Inside & Out.',
  heroSubheadline:
    'Hand wash, deep cabin restoration, and ceramic sealant protection tailored for sedans, SUVs, and trucks.',
  ctaText: 'Book Your Detail',
  outroHeadline: 'Ready For That Fresh Detail?',
  contact: {
    phone: 'Call / Text for Appointment',
    email: 'booking@lhautodetailing.com',
    address: 'Mobile & Studio Auto Detailing Service',
    hours: 'Mon – Sun · 8:00 AM – 6:00 PM',
    instagram: '@lhautodetailing',
  },
  services: [
    {
      id: 'srv-standard-wash',
      number: '01',
      title: 'Standard Wash',
      tagline: 'Rinse, soap, hand wash, tire shine, rim cleaning, and windows.',
      price: '$80',
      tierPrices: {
        sedan: '$80',
        suv: '$95',
        truck: '$105',
      },
      duration: 'Sedan $80 · SUV $95 · Truck $105',
      imageUrl: '/src/assets/images/service_paint_correction_1791040775369.jpg',
      span: 'standard',
    },
    {
      id: 'srv-interior-clean',
      number: '02',
      title: 'Interior Clean',
      tagline:
        'Vacuum, mats, vents, seats, trunk, dashboard, door panels, and navigation systems.',
      price: '$85',
      tierPrices: {
        sedan: '$85',
        suv: '$95',
        truck: '$105',
      },
      duration: 'Sedan $85 · SUV $95 · Truck $105',
      imageUrl: '/src/assets/images/service_interior_detail_1791040800135.jpg',
      span: 'wide',
    },
    {
      id: 'srv-premium-wash',
      number: '03',
      title: 'Premium Wash',
      tagline:
        'Rinse, soap, clay towel exterior, hand wash, ceramic sealant, tire shine, rim cleaning, and windows.',
      price: '$170',
      tierPrices: {
        sedan: '$170',
        suv: '$185',
        truck: '$200',
      },
      duration: 'Sedan $170 · SUV $185 · Truck $200',
      imageUrl: '/src/assets/images/service_ceramic_coating_1791040789542.jpg',
      span: 'wide',
    },
  ],
  addOns: [
    { id: 'addon-stain', name: 'Stain removal', price: '$35' },
    { id: 'addon-pet', name: 'Pet hair removal', price: '$30' },
    { id: 'addon-wax', name: 'Wax', price: '$30' },
    { id: 'addon-clay', name: 'Clay towel', price: '$25' },
    { id: 'addon-shampoo', name: 'Shampoo', price: '$35' },
  ],
  beforeAfterGallery: [
    {
      id: 'ba-kia-soul',
      title: 'Kia Soul — Driver Cabin & Floor Mat Transformation',
      caption: 'Vacuum, deep mat scrub, seat cleaning, and door sill detail',
      beforeImageUrl: '/src/assets/images/kia_soul_before_cabin_1791045193106.jpg',
      afterImageUrl: '/src/assets/images/kia_soul_after_cabin_1791045213490.jpg',
      uploadedAt: 'Unmodified Raw Pair',
    },
    {
      id: 'ba-tan-cabin',
      title: 'Passenger Floorboard & Tan Cloth Seat Detail',
      caption: 'Full leaf/debris extraction, Catch-It carpet mat restoration, and cloth seat care',
      beforeImageUrl: '/src/assets/images/tan_seat_before_cabin_1791045226774.jpg',
      afterImageUrl: '/src/assets/images/tan_seat_after_cabin_1791045238454.jpg',
      uploadedAt: 'Unmodified Raw Pair',
    },
    {
      id: 'ba-chevy-equinox',
      title: 'Chevy Equinox — Driver Floorboard & Seat Restoration',
      caption: 'Deep carpet vacuuming, door sill cleaning, and honeycomb fabric refresh',
      beforeImageUrl: '/src/assets/images/equinox_before_cabin_1791045250007.jpg',
      afterImageUrl: '/src/assets/images/equinox_after_cabin_1791045271674.jpg',
      uploadedAt: 'Unmodified Raw Pair',
    },
  ],
};

export const HERO_DEFAULT_IMAGE = '/src/assets/images/hero_detailing_car_1791040761398.jpg';

export function getServicePriceForTier(
  service: ServiceItem,
  tier: VehicleTier
): string {
  if (service.tierPrices && service.tierPrices[tier]) {
    return service.tierPrices[tier];
  }
  return service.price;
}

/**
 * Converts a hex string (#RRGGBB) to RGB components
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const fullHex =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(255 * f(0), 255 * f(8), 255 * f(4));
}

/**
 * Computes WCAG contrast text color (#080C14 or #FFFFFF) for a given hex background
 */
export function getContrastText(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 155 ? '#080C14' : '#FFFFFF';
}

/**
 * Applies the selected brand accent hex to document root CSS variables
 */
export function applyBrandThemeToDocument(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const contrast = getContrastText(hex);
  const root = document.documentElement;
  root.style.setProperty('--brand-accent', hex);
  root.style.setProperty('--brand-accent-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--brand-accent-contrast', contrast);
}

/**
 * Extracts dominant vibrant colors from an uploaded logo image using an offscreen canvas.
 */
export async function extractColorsFromLogo(imageSrc: string): Promise<{
  primaryHex: string;
  swatches: string[];
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 96;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ primaryHex: '#4A78D0', swatches: ['#4A78D0', '#33599E', '#9AB3DF'] });
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const buckets = new Map<
          string,
          { count: number; rSum: number; gSum: number; bSum: number; sat: number; light: number }
        >();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 90) continue;

          const { h, s, l } = rgbToHsl(r, g, b);
          if (l < 8 || l > 94) continue;

          const hBin = Math.floor(h / 15);
          const sBin = Math.floor(s / 34);
          const key = s < 12 ? `neutral-${Math.floor(l / 20)}` : `${hBin}-${sBin}`;

          const existing = buckets.get(key);
          if (existing) {
            existing.count += 1;
            existing.rSum += r;
            existing.gSum += g;
            existing.bSum += b;
          } else {
            buckets.set(key, { count: 1, rSum: r, gSum: g, bSum: b, sat: s, light: l });
          }
        }

        if (buckets.size === 0) {
          resolve({
            primaryHex: '#4A78D0',
            swatches: ['#4A78D0', '#33599E', '#9AB3DF', '#353B49'],
          });
          return;
        }

        const scored = Array.from(buckets.values()).map((b) => {
          const avgR = b.rSum / b.count;
          const avgG = b.gSum / b.count;
          const avgB = b.bSum / b.count;
          const hsl = rgbToHsl(avgR, avgG, avgB);
          const vibrancyWeight = 1 + (hsl.s / 100) * 2.8;
          const adjustedL = Math.max(52, Math.min(72, hsl.l));
          const adjustedS = hsl.s < 15 ? hsl.s : Math.max(55, hsl.s);
          const displayHex = hslToHex(hsl.h, adjustedS, adjustedL);

          return {
            hex: displayHex,
            rawHex: rgbToHex(avgR, avgG, avgB),
            score: b.count * vibrancyWeight,
            hue: hsl.h,
          };
        });

        scored.sort((a, b) => b.score - a.score);

        const distinctSwatches: string[] = [];
        for (const item of scored) {
          if (!distinctSwatches.includes(item.hex)) {
            distinctSwatches.push(item.hex);
          }
          if (distinctSwatches.length >= 5) break;
        }

        const primaryHex = distinctSwatches[0] || '#4A78D0';
        resolve({
          primaryHex,
          swatches: distinctSwatches.length > 0 ? distinctSwatches : [primaryHex],
        });
      } catch {
        resolve({ primaryHex: '#4A78D0', swatches: ['#4A78D0', '#33599E', '#9AB3DF'] });
      }
    };
    img.onerror = () => {
      resolve({ primaryHex: '#4A78D0', swatches: ['#4A78D0', '#33599E', '#9AB3DF'] });
    };
    img.src = imageSrc;
  });
}

export function parseUploadedDetailsText(
  rawText: string,
  currentConfig: BusinessConfig
): Partial<BusinessConfig> {
  const trimmed = rawText.trim();
  if (!trimmed) return {};

  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      return parsed;
    } catch {
      // Fall through
    }
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const updatedContact = { ...currentConfig.contact };
  let updatedBrandName = currentConfig.brandName;
  const parsedServices: ServiceItem[] = [];

  const defaultImages = [
    '/src/assets/images/service_paint_correction_1791040775369.jpg',
    '/src/assets/images/service_interior_detail_1791040800135.jpg',
    '/src/assets/images/service_ceramic_coating_1791040789542.jpg',
    '/src/assets/images/hero_detailing_car_1791040761398.jpg',
  ];

  for (const line of lines) {
    const nameMatch = line.match(/^(?:business|company|brand|shop|studio)\s*(?:name)?\s*[:\-]\s*(.+)$/i);
    if (nameMatch) {
      updatedBrandName = nameMatch[1].trim();
      continue;
    }

    const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      updatedContact.email = emailMatch[1].trim();
      continue;
    }

    const phoneMatch = line.match(/(?:phone|tel|call|mobile|contact)?\s*[:\-]?\s*(\+?[\d\s().-]{8,18})/i);
    if (phoneMatch && !line.includes('$') && /\d{3}.*\d{4}/.test(phoneMatch[1])) {
      updatedContact.phone = phoneMatch[1].trim();
      continue;
    }

    const addrMatch = line.match(/^(?:address|location|studio)\s*[:\-]\s*(.+)$/i);
    if (addrMatch) {
      updatedContact.address = addrMatch[1].trim();
      continue;
    }

    const hoursMatch = line.match(/^(?:hours|open|schedule)\s*[:\-]\s*(.+)$/i);
    if (hoursMatch) {
      updatedContact.hours = hoursMatch[1].trim();
      continue;
    }

    const priceMatch = line.match(/([$€£]\s?\d[\d,]*(?:\.\d{2})?)/);
    if (priceMatch) {
      const price = priceMatch[1].replace(/\s+/g, '');
      const parts = line
        .replace(priceMatch[0], '')
        .split(/[:\-–|•]/)
        .map((p) => p.trim())
        .filter(Boolean);
      const title = parts[0] || `Service ${parsedServices.length + 1}`;
      const tagline = parts[1] || 'Professional detailing treatment.';
      const duration = parts[2] || 'Full Session';
      const idx = parsedServices.length;
      parsedServices.push({
        id: `srv-custom-${Date.now()}-${idx}`,
        number: String(idx + 1).padStart(2, '0'),
        title,
        tagline,
        price,
        duration,
        imageUrl: currentConfig.services[idx]?.imageUrl || defaultImages[idx % defaultImages.length],
        span: idx % 2 === 1 ? 'wide' : 'standard',
      });
    }
  }

  return {
    brandName: updatedBrandName,
    contact: updatedContact,
    ...(parsedServices.length > 0 ? { services: parsedServices } : {}),
  };
}
