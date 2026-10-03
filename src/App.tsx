/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Award,
  Copy,
  Send,
} from 'lucide-react';
import {
  applyBrandThemeToDocument,
  DEFAULT_BUSINESS_CONFIG,
  HERO_DEFAULT_IMAGE,
} from './utils/brandUtils';
import { ResilientImage } from './components/ResilientImage';

export default function App() {
  const config = DEFAULT_BUSINESS_CONFIG;

  const [showIntroOverlay, setShowIntroOverlay] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    config.services[0]?.id || 'srv-standard-wash'
  );

  // Streamlined Top Booking Form State (Only Form + Service Package)
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Footer Interactive Customer Features State
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSent, setCallbackSent] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Smooth scroll parallax for Hero & Outro sections
  const { scrollYProgress } = useScroll();
  const heroImageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);

  // Apply LH Auto Detailing logo theme color on mount
  useEffect(() => {
    applyBrandThemeToDocument(config.themeColor);
  }, [config.themeColor]);

  // Smooth Intro Reveal (0.95s)
  useEffect(() => {
    if (!showIntroOverlay) return;
    const timer = setTimeout(() => {
      setShowIntroOverlay(false);
    }, 950);
    return () => clearTimeout(timer);
  }, [showIntroOverlay]);

  const handleSelectPackageAndBookTop = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setBookingConfirmed(false);
    const el = document.getElementById('top-booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 450);
  };

  const activeService =
    config.services.find((s) => s.id === selectedServiceId) ||
    config.services[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      setFormError('Please enter your name and phone number.');
      return;
    }
    setFormError(null);
    setBookingConfirmed(true);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setCallbackSent(true);
    setTimeout(() => {
      setCallbackPhone('');
      setCallbackSent(false);
    }, 4000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(config.contact.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F4F6FB] flex flex-col selection:bg-[var(--brand-accent)] selection:text-white">
      {/* CINEMATIC STUDIO INTRO REVEAL */}
      <AnimatePresence>
        {showIntroOverlay && (
          <motion.div
            key="studio-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#080C14] flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-5 px-6 text-center"
            >
              {config.logoDataUrl && (
                <img
                  src={config.logoDataUrl}
                  alt={config.brandName}
                  referrerPolicy="no-referrer"
                  className="h-24 sm:h-28 w-auto object-contain rounded-2xl shadow-2xl border border-[#9AB3DF]/30"
                />
              )}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-36 h-1 rounded-full origin-left"
                style={{
                  background: `linear-gradient(90deg, ${config.themeColor}, #9AB3DF)`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ROUNDED-EDGE MENUBAR */}
      <div className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto max-w-5xl mx-auto h-16 rounded-full bg-[#080C14]/80 backdrop-blur-xl border border-[#9AB3DF]/25 shadow-2xl shadow-black/60 px-5 sm:px-7 flex items-center justify-between"
        >
          {/* Zone 1: Single Brand Element */}
          <a
            href="#"
            className="text-base sm:text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 flex items-center"
          >
            {config.logoDataUrl ? (
              <img
                src={config.logoDataUrl}
                alt={config.brandName}
                referrerPolicy="no-referrer"
                className="h-9 sm:h-10 w-auto max-w-[165px] object-contain rounded-lg"
              />
            ) : (
              config.brandName
            )}
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#C6D4F0]">
            <a
              href="#top-booking"
              className="hover:text-white underline-offset-8 hover:underline transition-colors whitespace-nowrap"
            >
              Book Now
            </a>
            <a
              href="#services"
              className="hover:text-white underline-offset-8 hover:underline transition-colors whitespace-nowrap"
            >
              Packages
            </a>
            <a
              href="#before-after"
              className="hover:text-white underline-offset-8 hover:underline transition-colors whitespace-nowrap"
            >
              Before & After
            </a>
            <a
              href="#about"
              className="hover:text-white underline-offset-8 hover:underline transition-colors whitespace-nowrap"
            >
              About Us
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <a
              href="#top-booking"
              className="px-5 py-2.5 text-xs font-semibold rounded-full bg-[var(--brand-accent)] text-white hover:opacity-95 transition-opacity whitespace-nowrap shadow-md shadow-[#33599E]/40"
            >
              {config.ctaText}
            </a>
          </div>
        </motion.header>
      </div>

      <main className="flex-1">
        {/* TOP HERO + SIMPLE STREAMLINED BOOKING FORM SECTION */}
        <section
          id="top-booking"
          className="relative min-h-[92vh] w-full flex items-center overflow-hidden border-b border-[#9AB3DF]/15 pt-28 pb-16 lg:py-28"
        >
          {/* Background 16:9 High-Resolution Detailing Photography with Scroll Parallax */}
          <motion.div
            style={{ scale: heroImageScale }}
            className="absolute inset-0 z-0"
          >
            <ResilientImage
              src={HERO_DEFAULT_IMAGE}
              alt="LH Auto Detailing luxury car finish"
              className="w-full h-full object-cover object-center"
            />
            {/* Measured Contrast Scrim with LH Cobalt Blue Undertone */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/95 via-[#080C14]/80 to-[#080C14]/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-[#080C14]/50" />
            <div className="absolute inset-0 brand-ambient-glow pointer-events-none" />
          </motion.div>

          {/* Foreground Grid: Left Bold Headline + Single CTA | Right Simple Booking Form */}
          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Headline & One Simple Call-to-Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] font-display"
                style={{ textWrap: 'balance' }}
              >
                {config.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-[#C6D4F0] max-w-xl leading-relaxed">
                {config.heroSubheadline}
              </p>

              {/* ONE Simple Call-To-Action Button */}
              <div className="pt-2">
                <a
                  href="#services"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold bg-[var(--brand-accent)] text-white hover:opacity-95 transition-transform active:scale-[0.99] shadow-xl shadow-[#33599E]/40 whitespace-nowrap"
                >
                  <span>View Service Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Simple, Streamlined Booking Form at Top (Only Form + Service Package) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 rounded-3xl bg-[#0E1628]/95 backdrop-blur-md border border-[#9AB3DF]/30 p-6 sm:p-8 shadow-2xl"
            >
              {bookingConfirmed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-4"
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                    style={{
                      backgroundColor: config.themeColor,
                      color: '#FFFFFF',
                    }}
                  >
                    <Check className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white font-display">
                    Appointment Requested
                  </h2>
                  <p className="text-xs sm:text-sm text-[#C6D4F0] max-w-sm mx-auto">
                    Thank you, <span className="text-white font-semibold">{clientName}</span>. Your{' '}
                    <span className="text-white font-semibold">{activeService?.title}</span> ({activeService?.price}) appointment is reserved. We will call or text you at{' '}
                    <span className="font-mono-tabular text-white">{clientPhone}</span> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingConfirmed(false);
                      setClientName('');
                      setClientPhone('');
                      setPreferredDate('');
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors"
                  >
                    Book Another Vehicle
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4" noValidate>
                  <div className="flex items-center justify-between border-b border-[#9AB3DF]/15 pb-3">
                    <h2 className="text-xl font-bold text-white font-display">
                      Book Appointment
                    </h2>
                    <span
                      className="text-xl font-extrabold font-mono-tabular"
                      style={{ color: '#9AB3DF' }}
                    >
                      {activeService?.price}
                    </span>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                      {formError}
                    </div>
                  )}

                  {/* Service Package Dropdown */}
                  <div>
                    <label className="block text-xs text-[#9AB3DF] mb-1.5">
                      Service Package
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#080C14] border border-[#9AB3DF]/30 rounded-xl text-white focus:outline-none focus:border-[var(--brand-accent)]"
                    >
                      {config.services.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#080C14]">
                          {s.title} — {s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9AB3DF] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-[#080C14] border border-[#9AB3DF]/25 rounded-xl text-white focus:outline-none focus:border-[var(--brand-accent)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-[#9AB3DF] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(555) 234-5678"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#080C14] border border-[#9AB3DF]/25 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-[var(--brand-accent)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9AB3DF] mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#080C14] border border-[#9AB3DF]/25 rounded-xl text-white focus:outline-none focus:border-[var(--brand-accent)]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-semibold bg-[var(--brand-accent)] text-white hover:opacity-95 transition-opacity mt-1 shadow-lg shadow-[#33599E]/40"
                  >
                    Book {activeService?.title} ({activeService?.price})
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* VISUAL-FIRST SERVICE PACKAGES SECTION */}
        <section
          id="services"
          className="py-24 px-6 lg:px-12 max-w-[1280px] mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display"
              style={{ textWrap: 'balance' }}
            >
              Service Packages
            </h2>
            <p className="text-sm text-[#9AB3DF] mt-2">
              Select any package below to book your session.
            </p>
          </motion.div>

          {/* Clean Visual Bento Grid for Service Packages */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {config.services.map((service, index) => {
              const colSpanClass =
                index === 2 ? 'md:col-span-12' : 'md:col-span-6';
              const isSelected = service.id === selectedServiceId;

              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 2) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => handleSelectPackageAndBookTop(service.id)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#0E1628] border transition-all cursor-pointer flex flex-col justify-end min-h-[380px] sm:min-h-[420px] ${
                    isSelected
                      ? 'border-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]/40'
                      : 'border-[#9AB3DF]/20 hover:border-[var(--brand-accent)]'
                  } ${colSpanClass}`}
                >
                  {/* High-Resolution Service Photo */}
                  <div className="absolute inset-0 overflow-hidden">
                    <ResilientImage
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/60 to-transparent" />
                  </div>

                  {/* Minimal Visual-First Card Content */}
                  <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-mono-tabular text-[#9AB3DF]">
                        {service.number}. {service.duration}
                      </span>
                      <span
                        className="text-2xl sm:text-3xl font-extrabold font-mono-tabular"
                        style={{ color: '#9AB3DF' }}
                      >
                        {service.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                        {service.title}
                      </h3>
                      <span className="text-xs font-semibold text-white bg-[var(--brand-accent)] px-4 py-2 rounded-full opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Select Package →
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-200 max-w-2xl">
                      {service.tagline}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* BEFORE & AFTER GALLERY: Displayed As-Is Without Modification */}
        <section
          id="before-after"
          className="py-24 border-t border-[#9AB3DF]/15 bg-[#0B111E] brand-checker-subtle"
        >
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display"
                style={{ textWrap: 'balance' }}
              >
                Before & After Results
              </h2>
              <p className="text-sm text-[#9AB3DF] mt-2">
                Real interior & floorboard transformations from our studio.
              </p>
            </motion.div>

            {/* Unmodified Before & After Showcase List */}
            <div className="space-y-12">
              {config.beforeAfterGallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-2xl bg-[#0F172A]/90 border border-[#9AB3DF]/20 p-5 sm:p-7 space-y-5 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#9AB3DF]/15 pb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#9AB3DF] mt-0.5">
                        {item.caption}
                      </p>
                    </div>
                  </div>

                  {/* Pure Unmodified Image Container: No cropping, no filters, no overlays */}
                  {item.singleImageUrl ? (
                    <div className="w-full overflow-hidden rounded-xl bg-[#06090F] border border-white/10 flex items-center justify-center">
                      <ResilientImage
                        src={item.singleImageUrl}
                        alt={item.title}
                        asIsUnmodified={true}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* BEFORE PHOTO (UNMODIFIED) */}
                      <div className="space-y-2.5">
                        <span className="block text-xs font-mono-tabular font-semibold text-neutral-300">
                          01 · BEFORE
                        </span>
                        <div className="overflow-hidden rounded-xl bg-[#06090F] border border-white/10 flex items-center justify-center">
                          <ResilientImage
                            src={item.beforeImageUrl}
                            alt={`${item.title} - Before`}
                            asIsUnmodified={true}
                          />
                        </div>
                      </div>

                      {/* AFTER PHOTO (UNMODIFIED) */}
                      <div className="space-y-2.5">
                        <span
                          className="block text-xs font-mono-tabular font-semibold"
                          style={{ color: '#9AB3DF' }}
                        >
                          02 · AFTER
                        </span>
                        <div className="overflow-hidden rounded-xl bg-[#06090F] border border-[#9AB3DF]/30 flex items-center justify-center">
                          <ResilientImage
                            src={item.afterImageUrl}
                            alt={`${item.title} - After`}
                            asIsUnmodified={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION: Craftsmanship, Process & Brand Story */}
        <section
          id="about"
          className="relative py-28 px-6 lg:px-12 border-t border-[#9AB3DF]/15 overflow-hidden"
        >
          <div className="absolute inset-0 brand-ambient-glow pointer-events-none" />

          <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Story & Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs font-mono-tabular text-[#9AB3DF] tracking-wider">
                ABOUT {config.brandName.toUpperCase()}
              </span>

              <h2
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Built On Precision, Paint Safety & Honest Results.
              </h2>

              <p className="text-sm sm:text-base text-[#C6D4F0] leading-relaxed">
                At <strong className="text-white">{config.brandName}</strong>, every vehicle receives meticulous hand care—from deep floorboard and cabin extraction to pH-balanced hand washes and hydrophobic ceramic sealants. We treat every daily driver, SUV, and truck with showroom-level attention to detail.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#0E1628] border border-[#9AB3DF]/20 space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#9AB3DF]" />
                  <div className="text-sm font-bold text-white font-display">
                    100% Hand Wash
                  </div>
                  <p className="text-xs text-neutral-400">
                    Scratch-free microfiber mitts, foam bath, and deep wheel & tire cleaning.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0E1628] border border-[#9AB3DF]/20 space-y-1.5">
                  <Sparkles className="w-5 h-5 text-[#9AB3DF]" />
                  <div className="text-sm font-bold text-white font-display">
                    Deep Cabin Reset
                  </div>
                  <p className="text-xs text-neutral-400">
                    Seats, carpets, vents, trunk, and mats restored to factory fresh.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0E1628] border border-[#9AB3DF]/20 space-y-1.5">
                  <Award className="w-5 h-5 text-[#9AB3DF]" />
                  <div className="text-sm font-bold text-white font-display">
                    Ceramic Sealant
                  </div>
                  <p className="text-xs text-neutral-400">
                    Clay towel decontamination and lasting water-beading protection.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#top-booking"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-semibold bg-[var(--brand-accent)] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#33599E]/30"
                >
                  <span>Book Your Detail Now</span>
                  <ArrowUp className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Visual Showcase & Brand Signature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-5"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#9AB3DF]/25 shadow-2xl bg-[#0E1628]">
                <ResilientImage
                  src="/src/assets/images/service_ceramic_coating_1791040789542.jpg"
                  alt="LH Auto Detailing hydrophobic finish"
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 p-4 rounded-xl bg-[#080C14]/85 backdrop-blur-md border border-[#9AB3DF]/25">
                  {config.logoDataUrl && (
                    <img
                      src={config.logoDataUrl}
                      alt={config.brandName}
                      referrerPolicy="no-referrer"
                      className="h-11 w-auto object-contain rounded-lg shrink-0"
                    />
                  )}
                  <div className="text-right">
                    <div className="text-xs font-semibold text-white">
                      Sedans · SUVs · Pickup Trucks
                    </div>
                    <div className="text-[11px] text-[#9AB3DF] font-mono-tabular">
                      {config.contact.hours}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* EXPANDED FEATURE-RICH CUSTOMER FOOTER */}
      <footer className="border-t border-[#9AB3DF]/20 bg-[#05080E] text-[#C6D4F0] pt-20 pb-12 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          {/* Top 4-Column Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Column 1 (4 cols): Brand Logo, Mission & Service Guarantee */}
            <div className="lg:col-span-4 space-y-5">
              {config.logoDataUrl ? (
                <img
                  src={config.logoDataUrl}
                  alt={config.brandName}
                  referrerPolicy="no-referrer"
                  className="h-14 w-auto object-contain rounded-xl border border-[#9AB3DF]/25"
                />
              ) : (
                <div className="text-2xl font-extrabold text-white font-display">
                  {config.brandName}
                </div>
              )}

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
                Professional exterior hand washes, clay towel & ceramic sealant treatments, and deep interior cabin restoration for sedans, SUVs, and trucks.
              </p>

              <div className="text-xs text-[#9AB3DF] font-mono-tabular">
                100% Satisfaction Guarantee · Paint-Safe Microfiber Care
              </div>
            </div>

            {/* Column 2 (2 cols): Quick Select Package Links */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">
                Service Packages
              </h3>
              <ul className="space-y-2.5 text-xs">
                {config.services.map((srv) => (
                  <li key={srv.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectPackageAndBookTop(srv.id)}
                      className="text-neutral-400 hover:text-white transition-colors text-left flex items-center justify-between w-full gap-2"
                    >
                      <span>{srv.title}</span>
                      <span className="font-mono-tabular text-[#9AB3DF]">
                        {srv.price}
                      </span>
                    </button>
                  </li>
                ))}
                <li className="pt-2 border-t border-white/10">
                  <a
                    href="#before-after"
                    className="text-[#9AB3DF] hover:text-white transition-colors"
                  >
                    Before & After Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-[#9AB3DF] hover:text-white transition-colors"
                  >
                    About {config.brandName}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 (3 cols): Contact Info, Hours & One-Click Copy Feature */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">
                Contact & Hours
              </h3>
              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0E1628] border border-[#9AB3DF]/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-[#9AB3DF] shrink-0" />
                    <span className="font-mono-tabular truncate">
                      {config.contact.phone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#9AB3DF] hover:text-white transition-colors flex items-center gap-1 shrink-0"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#9AB3DF] shrink-0" />
                  <span>{config.contact.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9AB3DF] shrink-0" />
                  <span>{config.contact.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <Clock className="w-3.5 h-3.5 text-[#9AB3DF] shrink-0" />
                  <span>{config.contact.hours}</span>
                </div>
              </div>
            </div>

            {/* Column 4 (3 cols): Interactive Instant Text Quote / Callback Request Feature */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">
                Request a Fast Text Quote
              </h3>
              <p className="text-xs text-neutral-400">
                Enter your mobile number and our detailing team will text you right back to confirm availability.
              </p>

              {callbackSent ? (
                <div className="p-3.5 rounded-xl bg-[#0E1628] border border-[var(--brand-accent)] text-xs text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#9AB3DF] shrink-0" />
                  <span>We will text you shortly!</span>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Your mobile number"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#0E1628] border border-[#9AB3DF]/25 rounded-xl text-white font-mono-tabular focus:outline-none focus:border-[var(--brand-accent)]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[var(--brand-accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                    >
                      <span>Text Me</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Bar: Copyright & Smooth Back-to-Top Button */}
          <div className="pt-8 border-t border-[#9AB3DF]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div>
              © {new Date().getFullYear()} {config.brandName}. All rights reserved.
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E1628] hover:bg-[#16223D] border border-[#9AB3DF]/25 text-white text-xs font-medium transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#9AB3DF]" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
