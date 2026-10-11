import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Phone,
  Home,
  Grid,
  Droplets,
  ChevronRight,
  CheckCircle2,
  X,
  Menu,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

// WhatsApp icon SVG component with strict #25D366 circle
const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-4 h-4", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.477-.15-.677.15-.201.301-.778.98-.954 1.18-.176.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.15-.677-1.631-.928-2.233-.244-.586-.492-.507-.677-.516-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.229 3.111c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.9-.12.577-.351 1.782-2.183 2.033-2.936.251-.753.251-1.399.176-1.55-.075-.15-.276-.226-.577-.376z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.892.527 3.662 1.443 5.177L2 22l4.985-1.408C8.448 21.493 10.17 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.616 0-3.13-.456-4.425-1.246l-.317-.193-2.964.838.835-2.887-.212-.328A8.163 8.163 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2c0 4.522-3.678 8.2-8.2 8.2z"
      fill="currentColor"
    />
  </svg>
);

const PHONE_NUMBER = "+56 9 7875 7479";
const PHONE_TEL = "tel:+56978757479";
const WHATSAPP_RAW = "56978757479";
const EMAIL = "Silimpiochile@gmail.com";

// Base helper for WhatsApp URL
const buildWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(message)}`;
};

export default function App() {
  // Hero Cotizador State
  const [selectedService, setSelectedService] = useState<string>('');
  const [comuna, setComuna] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Dialog Modal State for Gallery
  const [selectedImageModal, setSelectedImageModal] = useState<{ src: string; caption: string; alt: string } | null>(null);

  // Contact Form State
  const [formNombre, setFormNombre] = useState<string>('');
  const [formComuna, setFormComuna] = useState<string>('');
  const [formDireccion, setFormDireccion] = useState<string>('');
  const [formMetros, setFormMetros] = useState<string>('');
  const [formServicio, setFormServicio] = useState<string>('Alfombra muro a muro');
  const [formDetalle, setFormDetalle] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Floating Mobile Bar Visibility State
  const [showMobileBar, setShowMobileBar] = useState<boolean>(false);
  const heroPanelRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState<boolean>(false);

  // Calculate Progress Meter for Hero Cotizador (0%, 33%, 66%, 100%)
  const calculateMeterProgress = () => {
    let filled = 0;
    if (selectedService.trim()) filled += 1;
    if (comuna.trim()) filled += 1;
    if (cantidad.trim()) filled += 1;
    return Math.round((filled / 3) * 100);
  };

  const meterProgress = calculateMeterProgress();

  // Dynamic WhatsApp text for Hero Cotizador
  const getHeroCotizadorUrl = () => {
    let msg = "Hola, quiero cotizar lavado de alfombras.";
    if (selectedService) {
      msg += ` Servicio: ${selectedService}.`;
    }
    if (comuna.trim()) {
      msg += ` Comuna: ${comuna.trim()}.`;
    }
    if (cantidad.trim()) {
      msg += ` Cantidad: ${cantidad.trim()}.`;
    }
    return buildWhatsAppUrl(msg);
  };

  // Submit Contact Form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComuna.trim()) {
      setFormError('Por favor ingresa tu comuna para cotizar.');
      return;
    }
    if (!formServicio.trim()) {
      setFormError('Por favor selecciona el tipo de servicio.');
      return;
    }
    setFormError('');

    let msg = `Hola, quiero cotizar lavado de alfombras.`;
    if (formNombre.trim()) msg += `\nNombre: ${formNombre.trim()}`;
    msg += `\nComuna: ${formComuna.trim()}`;
    if (formDireccion.trim()) msg += `\nDirección: ${formDireccion.trim()}`;
    if (formMetros.trim()) msg += `\nMetros aprox: ${formMetros.trim()} m²`;
    msg += `\nTipo de servicio: ${formServicio}`;
    if (formDetalle.trim()) msg += `\nDetalle: ${formDetalle.trim()}`;

    window.location.href = buildWhatsAppUrl(msg);
  };

  // Observe scroll and intersections for header & mobile sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver to hide mobile bar when Hero Cotizador or Contact Section is visible
    let isHeroPanelVisible = true;
    let isContactVisible = false;

    const updateMobileBarVisibility = () => {
      if (window.innerWidth >= 768) {
        setShowMobileBar(false);
        return;
      }
      setShowMobileBar(!isHeroPanelVisible && !isContactVisible);
    };

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isHeroPanelVisible = entry.isIntersecting;
          updateMobileBarVisibility();
        });
      },
      { threshold: 0.15 }
    );

    const contactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isContactVisible = entry.isIntersecting;
          updateMobileBarVisibility();
        });
      },
      { threshold: 0.15 }
    );

    if (heroPanelRef.current) heroObserver.observe(heroPanelRef.current);
    if (contactSectionRef.current) contactObserver.observe(contactSectionRef.current);

    const handleResize = () => {
      updateMobileBarVisibility();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  // Handle ESC key for Dialog Modal and Mobile Menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageModal(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#E8F0F7] text-[#071A30] font-sans relative selection:bg-[#2E7BD6] selection:text-white">

      {/* 0. HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolledPastHero
            ? 'glass-nav py-3.5 shadow-sm'
            : 'bg-transparent py-5 lg:py-6'
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Left */}
          <a
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#2E7BD6] rounded-lg py-1 px-1.5"
          >
            <img
              src="https://www.lavadodealfombraschile.cl/img/l-lavado-de-alfombras.png"
              alt="Logo Lavado de Alfombras Chile"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              loading="eager"
              width={140}
              height={40}
              onError={(e) => {
                // If logo fails, gracefully hide image and rely on text wordmark
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-[17px] sm:text-[19px] font-[520] tracking-tight text-[#071A30] whitespace-nowrap">
              Lavado de Alfombras Chile
            </span>
          </a>

          {/* Center Glass Navigation Pill (Desktop) */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center p-1.5 rounded-full glass-panel-subtle text-[15px] font-[560] text-[#13243D] shadow-sm"
          >
            <a
              href="#servicios"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-white/70 transition-colors hover:text-[#071A30]"
            >
              <Home className="w-4 h-4 text-[#2E7BD6]" aria-hidden="true" />
              <span>Servicios</span>
            </a>
            <div className="w-[1px] h-4 bg-[#D8E3EF] mx-1" aria-hidden="true" />
            <a
              href="#trabajos"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-white/70 transition-colors hover:text-[#071A30]"
            >
              <Grid className="w-4 h-4 text-[#2E7BD6]" aria-hidden="true" />
              <span>Trabajos</span>
            </a>
          </nav>

          {/* Right Zone: Call link & WhatsApp Primary CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={PHONE_TEL}
              className="hidden lg:flex items-center gap-2 text-[15px] font-[500] text-[#4A5873] hover:text-[#071A30] transition-colors py-2 px-2"
            >
              <Phone className="w-4 h-4 text-[#2E7BD6]" aria-hidden="true" />
              <span>Llamar</span>
            </a>

            <a
              href={buildWhatsAppUrl("Hola, quiero cotizar lavado de alfombras.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-[#0D2240] text-white rounded-full text-[14px] sm:text-[15px] font-[520] hover:bg-[#071A30] transition-all hover:-translate-y-0.5 shadow-sm group"
            >
              <span className="whitespace-nowrap">Cotizar por WhatsApp</span>
              <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-sm">
                <WhatsAppIcon className="w-4 h-4" />
              </span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full glass-panel-subtle text-[#071A30] hover:bg-white transition-colors"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu (Glass) */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-x-4 top-20 z-50 glass-panel rounded-[24px] p-5 shadow-xl border border-white/90 animate-in fade-in slide-in-from-top-4 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col gap-3">
              <a
                href="#servicios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 text-[16px] font-[520] text-[#071A30]"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8F0F7] flex items-center justify-center text-[#2E7BD6]">
                  <Home className="w-4 h-4" />
                </div>
                <span>Servicios</span>
              </a>

              <a
                href="#espuma"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 text-[16px] font-[520] text-[#071A30]"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8F0F7] flex items-center justify-center text-[#2E7BD6]">
                  <Droplets className="w-4 h-4" />
                </div>
                <span>Nuestra espuma azul</span>
              </a>

              <a
                href="#trabajos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 text-[16px] font-[520] text-[#071A30]"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8F0F7] flex items-center justify-center text-[#2E7BD6]">
                  <Grid className="w-4 h-4" />
                </div>
                <span>Trabajos y antes/después</span>
              </a>

              <a
                href="#retiro"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 text-[16px] font-[520] text-[#071A30]"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8F0F7] flex items-center justify-center text-[#2E7BD6]">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span>Retiro y entrega</span>
              </a>

              <a
                href="#cobertura"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 text-[16px] font-[520] text-[#071A30]"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8F0F7] flex items-center justify-center text-[#2E7BD6]">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Cobertura comunas</span>
              </a>

              <div className="h-[1px] bg-[#D8E3EF] my-1" />

              <a
                href={PHONE_TEL}
                className="flex items-center justify-center gap-2 py-2.5 text-[15px] font-[500] text-[#071A30] rounded-xl hover:bg-white/60"
              >
                <Phone className="w-4 h-4 text-[#2E7BD6]" />
                <span>Llamar al {PHONE_NUMBER}</span>
              </a>

              <a
                href={buildWhatsAppUrl("Hola, quiero cotizar lavado de alfombras.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 bg-[#0D2240] text-white rounded-full text-[15px] font-[520] shadow-sm"
              >
                <span className="pl-2">Cotizar por WhatsApp</span>
                <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION (Full Viewport Height) */}
      <section
        id="hero"
        className="relative min-h-[100dvh] flex flex-col justify-between pt-24 pb-8 sm:pb-10 overflow-hidden"
      >
        {/* Real photo background with subtle ice veil & slow zoom */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#E8F0F7]">
          <img
            src="https://www.lavadodealfombraschile.cl/img2026/lavado-de-afombras-maquina-chile.jpg"
            alt="Máquina lavando alfombra con espuma en Santiago Chile"
            className="w-full h-full object-cover object-center animate-hero-bg opacity-85"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
            onError={(e) => {
              // Graceful fallback gradient container
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Ice veil gradient: 85% opacity on left to 20% on right */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#E8F0F7]/95 via-[#E8F0F7]/80 to-[#E8F0F7]/30 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#E8F0F7] via-transparent to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Decorative CSS Foam Bubbles in ice studio */}
          <div
            className="absolute top-1/4 left-1/3 w-28 h-28 rounded-full bg-[#2E7BD6]/10 blur-xl pointer-events-none animate-bubble-1"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-36 h-36 rounded-full bg-[#8DBEF0]/20 blur-2xl pointer-events-none animate-bubble-2"
            aria-hidden="true"
          />
        </div>

        {/* Main Hero Container */}
        <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto pt-6 sm:pt-10 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Support */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 sm:space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] sm:text-[14px] font-[470] text-[#13243D] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#2E7BD6]" aria-hidden="true" />
              <span>Todo Santiago · Rancagua y Machalí</span>
            </div>

            {/* H1 in two lines */}
            <h1 className="text-[38px] sm:text-[54px] lg:text-[64px] font-[360] tracking-[-0.035em] text-[#071A30] leading-[1.08] text-balance">
              <span>Lavado de alfombras</span>
              <br />
              <span className="font-[450]">a domicilio en Santiago</span>
            </h1>

            {/* Supporting Line */}
            <div className="flex items-center gap-3 pt-1 text-[16px] sm:text-[18px] text-[#4A5873] leading-relaxed max-w-xl">
              <div className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center shrink-0 text-[#2E7BD6]">
                <Droplets className="w-4 h-4 fill-[#2E7BD6]/20" aria-hidden="true" />
              </div>
              <p className="font-[400]">
                Muro a muro y alfombras sueltas, con retiro y entrega.
              </p>
            </div>

            {/* Visual reassurance pill for mobile */}
            <div className="lg:hidden flex items-center gap-2 text-[13px] text-[#56637C] pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7BD6]" />
              <span>Espuma azul de secado rápido · Producto chileno</span>
            </div>

          </div>

          {/* Right Column: Cotizador Panel (Glass 28px radius) */}
          <div
            ref={heroPanelRef}
            className="lg:col-span-5 w-full glass-panel rounded-[28px] p-6 sm:p-7 shadow-xl border border-white/90 relative"
          >
            {/* Header of Cotizador */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D8E3EF]/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2E7BD6]">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 className="text-[19px] sm:text-[20px] font-[520] text-[#071A30] tracking-tight">
                  Cotiza en 1 minuto
                </h2>
              </div>

              {/* Status indicator with slow pulse */}
              <div className="flex items-center gap-2 bg-[#E8F0F7]/90 px-2.5 py-1 rounded-full text-[12px] font-[500] text-[#13243D]">
                <span className="w-2 h-2 rounded-full bg-[#2E7BD6] animate-slow-pulse" aria-hidden="true" />
                <span>Respuesta rápida</span>
              </div>
            </div>

            {/* Form controls */}
            <div className="mt-5 space-y-4">
              
              {/* Service chips (single-select) */}
              <div>
                <label className="block text-[13px] font-[500] text-[#4A5873] mb-2">
                  Tipo de servicio
                </label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de servicio">
                  {[
                    "Muro a muro",
                    "Sueltas · retiro y entrega",
                    "Empresa"
                  ].map((service) => {
                    const isSelected = selectedService === service;
                    return (
                      <button
                        key={service}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedService(isSelected ? '' : service)}
                        className={`px-3.5 py-1.5 rounded-full text-[13px] font-[500] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#071A30] text-white shadow-sm scale-[1.02]'
                            : 'bg-white/80 hover:bg-white text-[#13243D] border border-white/90'
                        }`}
                      >
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comuna input */}
              <div>
                <label htmlFor="hero-comuna" className="block text-[13px] font-[500] text-[#4A5873] mb-1.5">
                  Comuna
                </label>
                <input
                  id="hero-comuna"
                  type="text"
                  placeholder="Ej: Las Condes, Santiago, Rancagua..."
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#D8E3EF] text-[14px] text-[#071A30] placeholder-[#56637C]/60 focus:bg-white focus:border-[#2E7BD6] transition-colors"
                />
              </div>

              {/* Cantidad input */}
              <div>
                <label htmlFor="hero-cantidad" className="block text-[13px] font-[500] text-[#4A5873] mb-1.5">
                  Cantidad (habitaciones o alfombras)
                </label>
                <input
                  id="hero-cantidad"
                  type="text"
                  placeholder="Ej: 2 dormitorios / 1 alfombra living"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#D8E3EF] text-[14px] text-[#071A30] placeholder-[#56637C]/60 focus:bg-white focus:border-[#2E7BD6] transition-colors"
                />
              </div>

              {/* Progress meter (Barra de progreso fina) */}
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-[500] text-[#56637C] mb-1">
                  <span>Progreso de cotización</span>
                  <span className="tabular-nums">{meterProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#D8E3EF]/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E7BD6] transition-all duration-300 rounded-full"
                    style={{ width: `${meterProgress}%` }}
                  />
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <a
                href={getHeroCotizadorUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-2 pl-4 bg-[#0D2240] hover:bg-[#071A30] text-white rounded-full text-[15px] font-[520] transition-all hover:-translate-y-0.5 shadow-md group mt-3 cursor-pointer"
              >
                <span>Enviar por WhatsApp</span>
                <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
              </a>

              {/* Small note */}
              <p className="text-[12px] text-center text-[#56637C] pt-1">
                También puedes adjuntar fotos en el chat.
              </p>

            </div>
          </div>

        </div>

        {/* Hero Bottom Row */}
        <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-[#D8E3EF]/60">
          
          {/* Left: Santiago / Rancagua large figures (Weight 200) */}
          <div className="flex items-baseline gap-4 sm:gap-6 text-[#071A30]">
            <div>
              <span className="text-[34px] sm:text-[44px] font-[200] tracking-tight leading-none">
                Santiago
              </span>
              <p className="text-[12px] sm:text-[13px] font-[470] text-[#56637C] mt-0.5">
                Región Metropolitana / a domicilio
              </p>
            </div>

            <div className="text-[28px] sm:text-[36px] font-[200] text-[#8DBEF0]" aria-hidden="true">
              /
            </div>

            <div>
              <span className="text-[34px] sm:text-[44px] font-[200] tracking-tight leading-none">
                Rancagua
              </span>
              <p className="text-[12px] sm:text-[13px] font-[470] text-[#56637C] mt-0.5">
                Machalí y alrededores
              </p>
            </div>
          </div>

          {/* Right: Glass pill "Ver trabajos" with circular thumbnail */}
          <a
            href="#trabajos"
            className="inline-flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full glass-panel text-[14px] font-[520] text-[#071A30] hover:bg-white transition-all hover:-translate-y-0.5 shadow-sm group"
          >
            <img
              src="https://www.lavadodealfombraschile.cl/img2026/lavado-alfombras-antes-y-despues-santiago-chile.jpg"
              alt="Miniatura antes y después lavado"
              className="w-7 h-7 rounded-full object-cover border border-white"
              loading="lazy"
              width={28}
              height={28}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>Ver trabajos</span>
            <ChevronRight className="w-4 h-4 text-[#2E7BD6] transition-transform group-hover:translate-x-0.5" />
          </a>

        </div>

      </section>

      {/* 2. SERVICIOS SECTION (#servicios) */}
      <section id="servicios" className="py-20 lg:py-28 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] font-[470] text-[#13243D] mb-3">
            <span>Para hogares y empresas</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] font-[380] tracking-[-0.03em] text-[#071A30] leading-tight text-balance">
            Servicios de lavado de alfombras a domicilio en Santiago
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#4A5873] mt-3 font-[400] leading-relaxed">
            Limpieza orientada a higiene y terminación prolija, para hogares y empresas.
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Muro a muro */}
          <div className="glass-panel rounded-[24px] p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div>
              <div className="overflow-hidden rounded-[20px] aspect-[4/3] bg-slate-200 mb-5 relative">
                <img
                  src="https://www.lavadodealfombraschile.cl/img2026/lavado-de-alfombras-casas-santiago-chile.jpg"
                  alt="Limpieza de alfombras muro a muro en casas y departamentos Santiago"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  width={600}
                  height={450}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-[12px] font-[520] text-[#2E7BD6] uppercase tracking-wider mb-1.5">
                Muro a muro
              </div>
              <h3 className="text-[20px] font-[520] text-[#071A30] tracking-tight mb-2">
                Limpieza de alfombras muro a muro
              </h3>
              <p className="text-[15px] text-[#56637C] leading-relaxed">
                Dormitorios, living, pasillos y salas, en departamentos y casas.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#D8E3EF]/70 flex items-center justify-between text-[13px] font-[500] text-[#13243D]">
              <span>Servicio a domicilio</span>
              <span className="text-[#2E7BD6]">Santiago y O'Higgins</span>
            </div>
          </div>

          {/* Card 2: Sueltas */}
          <div className="glass-panel rounded-[24px] p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div>
              <div className="overflow-hidden rounded-[20px] aspect-[4/3] bg-slate-200 mb-5 relative">
                <img
                  src="https://www.lavadodealfombraschile.cl/img/lavado-alfombras-decorativas-sueltas-dimensionadas-retiro-santaigo-chile.jpg"
                  alt="Lavado de alfombras decorativas sueltas dimensionadas con retiro"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  width={600}
                  height={450}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-[12px] font-[520] text-[#2E7BD6] uppercase tracking-wider mb-1.5">
                Sueltas
              </div>
              <h3 className="text-[20px] font-[520] text-[#071A30] tracking-tight mb-2">
                Alfombras sueltas y dimensionadas
              </h3>
              <p className="text-[15px] text-[#56637C] leading-relaxed">
                Retiro a domicilio y entrega programada. Ideal para piezas grandes, decorativas o pasilleras.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#D8E3EF]/70 flex items-center justify-between text-[13px] font-[500] text-[#13243D]">
              <span>Retiro y entrega coordinada</span>
              <span className="text-[#2E7BD6]">Sin moverlas tú</span>
            </div>
          </div>

          {/* Card 3: Empresas */}
          <div className="glass-panel rounded-[24px] p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1 group md:col-span-2 lg:col-span-1">
            <div>
              <div className="overflow-hidden rounded-[20px] aspect-[4/3] bg-slate-200 mb-5 relative">
                <img
                  src="https://www.lavadodealfombraschile.cl/img2026/retiro-alfombras-suletas-chile-santiago.jpg"
                  alt="Limpieza de alfombras para oficinas y empresas en Santiago"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  width={600}
                  height={450}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-[12px] font-[520] text-[#2E7BD6] uppercase tracking-wider mb-1.5">
                Empresas
              </div>
              <h3 className="text-[20px] font-[520] text-[#071A30] tracking-tight mb-2">
                Oficinas, hoteles y locales
              </h3>
              <p className="text-[15px] text-[#56637C] leading-relaxed">
                Espacios de alto tránsito, con planificación y mantención.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-[#D8E3EF]/70 flex items-center justify-between text-[13px] font-[500] text-[#13243D]">
              <span>Planificación flexible</span>
              <span className="text-[#2E7BD6]">Alto tránsito</span>
            </div>
          </div>

        </div>

        {/* Qué incluye normalmente el servicio: Franja de vidrio con 4 pasos en línea numerada 01-04 */}
        <div className="glass-panel rounded-[24px] p-6 sm:p-8 mt-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8F0F7] flex items-center justify-center text-[#2E7BD6]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-[19px] sm:text-[21px] font-[520] text-[#071A30] tracking-tight">
              Qué incluye normalmente el servicio
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="space-y-1.5">
              <span className="text-[28px] font-[300] text-[#2E7BD6]">01</span>
              <p className="text-[15px] font-[500] text-[#071A30] leading-snug">
                Aspirado y preparación del área.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[28px] font-[300] text-[#2E7BD6]">02</span>
              <p className="text-[15px] font-[500] text-[#071A30] leading-snug">
                Aplicación de detergente especializado según el tipo de alfombra.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[28px] font-[300] text-[#2E7BD6]">03</span>
              <p className="text-[15px] font-[500] text-[#071A30] leading-snug">
                Limpieza profunda y terminación.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[28px] font-[300] text-[#2E7BD6]">04</span>
              <p className="text-[15px] font-[500] text-[#071A30] leading-snug">
                Recomendaciones de secado y cuidado.
              </p>
            </div>
          </div>
        </div>

        {/* Single CTA per section */}
        <div className="mt-10 flex justify-center">
          <a
            href={buildWhatsAppUrl("Hola, quiero cotizar servicio de lavado de alfombras.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 pl-5 pr-2 py-2 bg-[#0D2240] hover:bg-[#071A30] text-white rounded-full text-[15px] font-[520] transition-all hover:-translate-y-0.5 shadow-md group"
          >
            <span>Cotizar por WhatsApp</span>
            <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <WhatsAppIcon className="w-4 h-4" />
            </span>
          </a>
        </div>

      </section>

      {/* 3. NUESTRA ESPUMA SECTION (#espuma) */}
      <section
        id="espuma"
        className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#E8F0F7] via-[#F0F6FB] to-[#E8F0F7]"
      >
        {/* Decorative slow floating CSS bubbles */}
        <div
          className="absolute top-10 right-10 w-44 h-44 rounded-full bg-[#2E7BD6]/10 blur-2xl pointer-events-none animate-bubble-1"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 left-8 w-56 h-56 rounded-full bg-[#8DBEF0]/20 blur-3xl pointer-events-none animate-bubble-2"
          aria-hidden="true"
        />

        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Big Photo of Blue Foam with 28px radius */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] overflow-hidden shadow-xl bg-slate-200 border border-white/80">
              <img
                src="https://www.lavadodealfombraschile.cl/img2026/lavado-alfombra-shampoo-azul-alta-espuma.jpg"
                alt="Espuma azul de secado rápido aplicada sobre alfombra"
                className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 hover:scale-[1.03]"
                loading="lazy"
                width={800}
                height={600}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl glass-panel-subtle text-[13px] text-[#071A30] font-[500] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E7BD6] shrink-0" />
                <span>Sello distintivo: espuma azul de alta densidad</span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & 3 Mini-Spec Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] font-[470] text-[#13243D]">
              <Droplets className="w-3.5 h-3.5 text-[#2E7BD6]" />
              <span>Nuestro shampoo</span>
            </div>

            <h2 className="text-[34px] sm:text-[44px] font-[380] tracking-[-0.03em] text-[#071A30] leading-tight text-balance">
              Espuma azul de secado rápido
            </h2>

            <p className="text-[17px] sm:text-[18px] text-[#4A5873] font-[400] leading-relaxed">
              Producto chileno, pensado para resultados y terminación. Alta espuma, secado rápido y buen acabado.
            </p>

            {/* 3 Atributos en formato mini-ficha */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="glass-panel rounded-[20px] p-4 text-center">
                <div className="text-[20px] font-[520] text-[#071A30] mb-1">
                  Alta densidad
                </div>
                <div className="text-[12px] text-[#56637C]">
                  Penetración y limpieza profunda
                </div>
              </div>

              <div className="glass-panel rounded-[20px] p-4 text-center">
                <div className="text-[20px] font-[520] text-[#2E7BD6] mb-1">
                  Secado rápido
                </div>
                <div className="text-[12px] text-[#56637C]">
                  Menor tiempo de espera
                </div>
              </div>

              <div className="glass-panel rounded-[20px] p-4 text-center">
                <div className="text-[20px] font-[520] text-[#071A30] mb-1">
                  Producto chileno
                </div>
                <div className="text-[12px] text-[#56637C]">
                  Formulado para resultados
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TRABAJOS SECTION (#trabajos) */}
      <section id="trabajos" className="py-20 lg:py-28 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] font-[470] text-[#13243D] mb-3">
            <span>Resultados comprobados</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] font-[380] tracking-[-0.03em] text-[#071A30] leading-tight">
            Antes y después
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#4A5873] mt-3 font-[400] leading-relaxed">
            Ejemplos reales de limpieza y terminación.
          </p>
        </div>

        {/* Gallery Grid (4 real photos with exact captions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Photo 1 */}
          <div
            onClick={() =>
              setSelectedImageModal({
                src: "https://www.lavadodealfombraschile.cl/img2026/lavado-alfombras-antes-y-despues-santiago-chile.jpg",
                caption: "Antes / después",
                alt: "Alfombra antes y después del lavado en Santiago"
              })
            }
            className="group cursor-pointer glass-panel rounded-[24px] p-3.5 transition-all hover:shadow-lg hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedImageModal({
                  src: "https://www.lavadodealfombraschile.cl/img2026/lavado-alfombras-antes-y-despues-santiago-chile.jpg",
                  caption: "Antes / después",
                  alt: "Alfombra antes y después del lavado en Santiago"
                });
              }
            }}
          >
            <div className="overflow-hidden rounded-[20px] aspect-[16/10] bg-slate-200 relative">
              <img
                src="https://www.lavadodealfombraschile.cl/img2026/lavado-alfombras-antes-y-despues-santiago-chile.jpg"
                alt="Alfombra antes y después del lavado en Santiago"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                width={700}
                height={437}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-[#071A30]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white/90 text-[13px] font-[520] text-[#071A30] shadow-sm">
                  Ver imagen completa
                </span>
              </div>
            </div>
            <div className="pt-3 px-1.5 flex items-center justify-between text-[14px] font-[500] text-[#071A30]">
              <span>Antes / después</span>
              <span className="text-[12px] text-[#56637C]">Limpieza profunda</span>
            </div>
          </div>

          {/* Photo 2 */}
          <div
            onClick={() =>
              setSelectedImageModal({
                src: "https://www.lavadodealfombraschile.cl/img/limpieza-de-alfombra-lavado-santiago-chile.jpg",
                caption: "Antes / después",
                alt: "Limpieza de alfombra lavado antes y después en Santiago Chile"
              })
            }
            className="group cursor-pointer glass-panel rounded-[24px] p-3.5 transition-all hover:shadow-lg hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedImageModal({
                  src: "https://www.lavadodealfombraschile.cl/img/limpieza-de-alfombra-lavado-santiago-chile.jpg",
                  caption: "Antes / después",
                  alt: "Limpieza de alfombra lavado antes y después en Santiago Chile"
                });
              }
            }}
          >
            <div className="overflow-hidden rounded-[20px] aspect-[16/10] bg-slate-200 relative">
              <img
                src="https://www.lavadodealfombraschile.cl/img/limpieza-de-alfombra-lavado-santiago-chile.jpg"
                alt="Limpieza de alfombra lavado antes y después en Santiago Chile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                width={700}
                height={437}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-[#071A30]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white/90 text-[13px] font-[520] text-[#071A30] shadow-sm">
                  Ver imagen completa
                </span>
              </div>
            </div>
            <div className="pt-3 px-1.5 flex items-center justify-between text-[14px] font-[500] text-[#071A30]">
              <span>Antes / después</span>
              <span className="text-[12px] text-[#56637C]">Eliminación de manchas</span>
            </div>
          </div>

          {/* Photo 3 */}
          <div
            onClick={() =>
              setSelectedImageModal({
                src: "https://www.lavadodealfombraschile.cl/img/limpieza-de-alfombra-santiago.jpg",
                caption: "Resultado de limpieza",
                alt: "Resultado de limpieza de alfombra en Santiago"
              })
            }
            className="group cursor-pointer glass-panel rounded-[24px] p-3.5 transition-all hover:shadow-lg hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedImageModal({
                  src: "https://www.lavadodealfombraschile.cl/img/limpieza-de-alfombra-santiago.jpg",
                  caption: "Resultado de limpieza",
                  alt: "Resultado de limpieza de alfombra en Santiago"
                });
              }
            }}
          >
            <div className="overflow-hidden rounded-[20px] aspect-[16/10] bg-slate-200 relative">
              <img
                src="https://www.lavadodealfombraschile.cl/img/limpieza-de-alfombra-santiago.jpg"
                alt="Resultado de limpieza de alfombra en Santiago"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                width={700}
                height={437}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-[#071A30]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white/90 text-[13px] font-[520] text-[#071A30] shadow-sm">
                  Ver imagen completa
                </span>
              </div>
            </div>
            <div className="pt-3 px-1.5 flex items-center justify-between text-[14px] font-[500] text-[#071A30]">
              <span>Resultado de limpieza</span>
              <span className="text-[12px] text-[#56637C]">Terminación prolija</span>
            </div>
          </div>

          {/* Photo 4 */}
          <div
            onClick={() =>
              setSelectedImageModal({
                src: "https://www.lavadodealfombraschile.cl/img/lavado-alfombras-decorativas-sueltas-dimensionadas-retiro-santaigo-chile.jpg",
                caption: "Sueltas y dimensionadas · retiro y entrega",
                alt: "Alfombras decorativas sueltas dimensionadas con retiro en Santiago Chile"
              })
            }
            className="group cursor-pointer glass-panel rounded-[24px] p-3.5 transition-all hover:shadow-lg hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedImageModal({
                  src: "https://www.lavadodealfombraschile.cl/img/lavado-alfombras-decorativas-sueltas-dimensionadas-retiro-santaigo-chile.jpg",
                  caption: "Sueltas y dimensionadas · retiro y entrega",
                  alt: "Alfombras decorativas sueltas dimensionadas con retiro en Santiago Chile"
                });
              }
            }}
          >
            <div className="overflow-hidden rounded-[20px] aspect-[16/10] bg-slate-200 relative">
              <img
                src="https://www.lavadodealfombraschile.cl/img/lavado-alfombras-decorativas-sueltas-dimensionadas-retiro-santaigo-chile.jpg"
                alt="Alfombras decorativas sueltas dimensionadas con retiro en Santiago Chile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                width={700}
                height={437}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-[#071A30]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white/90 text-[13px] font-[520] text-[#071A30] shadow-sm">
                  Ver imagen completa
                </span>
              </div>
            </div>
            <div className="pt-3 px-1.5 flex items-center justify-between text-[14px] font-[500] text-[#071A30]">
              <span>Sueltas y dimensionadas · retiro y entrega</span>
              <span className="text-[12px] text-[#56637C]">Piezas decorativas</span>
            </div>
          </div>

        </div>

        {/* Single CTA: Quiero un resultado así -> WhatsApp */}
        <div className="mt-12 flex justify-center">
          <a
            href={buildWhatsAppUrl("Hola, quiero cotizar un lavado de alfombras. Me interesó el resultado de sus trabajos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 pl-5 pr-2 py-2 bg-[#0D2240] hover:bg-[#071A30] text-white rounded-full text-[15px] font-[520] transition-all hover:-translate-y-0.5 shadow-md group"
          >
            <span>Quiero un resultado así</span>
            <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <WhatsAppIcon className="w-4 h-4" />
            </span>
          </a>
        </div>

      </section>

      {/* 5. RETIRO Y ENTREGA SECTION (#retiro) */}
      <section id="retiro" className="py-20 lg:py-28 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Photo of Furgón */}
          <div className="lg:col-span-5">
            <div className="rounded-[20px] overflow-hidden shadow-xl bg-slate-200 border border-white/80 relative">
              <img
                src="https://www.lavadodealfombraschile.cl/img2026/furgon-retiro-y-entrega-alfombras-santiago.jpg"
                alt="Furgón de retiro y entrega de alfombras en Santiago"
                className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-700 hover:scale-[1.03]"
                loading="lazy"
                width={600}
                height={750}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl glass-panel-subtle text-[13px] text-[#071A30] font-[500]">
                Retiro a domicilio y entrega programada en Santiago y Rancagua
              </div>
            </div>
          </div>

          {/* Right Column: Process & Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] font-[470] text-[#13243D]">
              <span>Servicio cómodo y coordinado</span>
            </div>

            <h2 className="text-[32px] sm:text-[42px] font-[380] tracking-[-0.03em] text-[#071A30] leading-tight text-balance">
              Retiro y entrega de alfombras sueltas
            </h2>

            <p className="text-[17px] sm:text-[18px] text-[#4A5873] font-[400] leading-relaxed">
              No tienes que mover alfombras grandes ni coordinar por varios canales.
            </p>

            {/* 4 Vertical Numbered Steps with Connecting Line */}
            <div className="space-y-6 relative pl-4 border-l-2 border-[#D8E3EF] py-2 ml-3">
              <div className="relative pl-6">
                <span className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-white border border-[#D8E3EF] flex items-center justify-center text-[13px] font-[600] text-[#2E7BD6] shadow-sm">
                  1
                </span>
                <p className="text-[16px] text-[#071A30] font-[500] leading-snug">
                  Nos escribes por WhatsApp con tu comuna y la cantidad de piezas.
                </p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-white border border-[#D8E3EF] flex items-center justify-center text-[13px] font-[600] text-[#2E7BD6] shadow-sm">
                  2
                </span>
                <p className="text-[16px] text-[#071A30] font-[500] leading-snug">
                  Coordinamos el retiro a domicilio.
                </p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-white border border-[#D8E3EF] flex items-center justify-center text-[13px] font-[600] text-[#2E7BD6] shadow-sm">
                  3
                </span>
                <p className="text-[16px] text-[#071A30] font-[500] leading-snug">
                  Realizamos la limpieza según material y suciedad.
                </p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-white border border-[#D8E3EF] flex items-center justify-center text-[13px] font-[600] text-[#2E7BD6] shadow-sm">
                  4
                </span>
                <p className="text-[16px] text-[#071A30] font-[500] leading-snug">
                  Coordinamos la entrega y te damos recomendaciones de cuidado.
                </p>
              </div>
            </div>

            {/* Recuadro de vidrio: Para cotizar, envíanos */}
            <div className="glass-panel rounded-[20px] p-5 border border-white/80">
              <h4 className="text-[15px] font-[520] text-[#071A30] mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#2E7BD6]" />
                <span>Para cotizar, envíanos:</span>
              </h4>
              <ul className="text-[14px] text-[#4A5873] space-y-1 pl-6 list-disc">
                <li>Comuna y horario preferido.</li>
                <li>Cantidad de alfombras.</li>
                <li>Medidas aproximadas.</li>
                <li>Foto opcional, sobre todo si hay manchas específicas.</li>
              </ul>
            </div>

            {/* Single CTA */}
            <div className="pt-2">
              <a
                href={buildWhatsAppUrl("Hola, quiero coordinar retiro de alfombras sueltas.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 bg-[#0D2240] hover:bg-[#071A30] text-white rounded-full text-[15px] font-[520] transition-all hover:-translate-y-0.5 shadow-md group"
              >
                <span>Coordinar retiro</span>
                <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 6. COBERTURA SECTION (#cobertura) */}
      <section id="cobertura" className="py-20 lg:py-28 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] font-[470] text-[#13243D] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#2E7BD6]" />
            <span>¿Llegan a mi comuna?</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] font-[380] tracking-[-0.03em] text-[#071A30] leading-tight">
            Cobertura en Santiago y Rancagua
          </h2>
          <p className="text-[17px] sm:text-[18px] text-[#4A5873] mt-3 font-[400] leading-relaxed">
            Atención a domicilio en la Región Metropolitana y Región de O’Higgins.
          </p>
        </div>

        {/* 2 Blocks: Santiago & O'Higgins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bloque Santiago */}
          <div className="glass-panel rounded-[24px] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8E3EF]">
              <h3 className="text-[20px] font-[520] text-[#071A30]">
                Región Metropolitana (Santiago)
              </h3>
              <span className="text-[12px] text-[#56637C]">5 grupos de comunas</span>
            </div>

            <p className="text-[14px] text-[#4A5873]">
              Presiona para ver la página de cada zona:
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { name: "Maipú · Estación Central", url: "https://www.lavadodealfombraschile.cl/maipu-estacion-central.php" },
                { name: "Santiago · Providencia · Ñuñoa", url: "https://www.lavadodealfombraschile.cl/santiago-providencia-nunoa.php" },
                { name: "La Florida · Macul · San Miguel", url: "https://www.lavadodealfombraschile.cl/florida-macul-san-miguel.php" },
                { name: "Las Condes · Vitacura · La Reina · Lo Barnechea", url: "https://www.lavadodealfombraschile.cl/las-condes-vitacura-la-reina-lo-barnechea.php" },
                { name: "Quilicura · Pudahuel · Huechuraba", url: "https://www.lavadodealfombraschile.cl/quilicura-pudahuel-huechuraba.php" }
              ].map((group) => (
                <a
                  key={group.name}
                  href={group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-[13px] font-[500] text-[#071A30] border border-[#D8E3EF] transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-1.5"
                >
                  <span>{group.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#2E7BD6]" />
                </a>
              ))}
            </div>
          </div>

          {/* Bloque O'Higgins */}
          <div className="glass-panel rounded-[24px] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8E3EF]">
              <h3 className="text-[20px] font-[520] text-[#071A30]">
                Región de O’Higgins
              </h3>
              <span className="text-[12px] text-[#56637C]">Rancagua, Machalí y comunas</span>
            </div>

            <p className="text-[14px] text-[#4A5873]">
              Cobertura en Rancagua, Machalí y comunas aledañas:
            </p>

            <div className="flex flex-wrap gap-2 pt-1 max-h-[190px] overflow-y-auto pr-1">
              {[
                "Rancagua",
                "Machalí",
                "Graneros",
                "Olivar",
                "Requínoa",
                "Doñihue",
                "Coltauco",
                "Coinco",
                "Codegua",
                "Mostazal",
                "San Francisco de Mostazal",
                "Malloa",
                "Quinta de Tilcoco",
                "San Vicente de Tagua Tagua",
                "Peumo",
                "Pichidegua",
                "Las Cabras"
              ].map((commune) => (
                <a
                  key={commune}
                  href="https://www.lavadodealfombraschile.cl/rancagua.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-[12px] font-[500] text-[#13243D] border border-[#D8E3EF] transition-colors"
                >
                  {commune}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Nota única y discreta */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-[#56637C] italic">
            Domicilio y retiro sujetos a zona y agenda. Escríbenos con tu comuna y te confirmamos.
          </p>
        </div>

        {/* Single CTA: Consultar mi comuna */}
        <div className="mt-8 flex justify-center">
          <a
            href={buildWhatsAppUrl("Hola, ¿tienen cobertura en mi comuna? Mi comuna es: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 pl-5 pr-2 py-2 bg-[#0D2240] hover:bg-[#071A30] text-white rounded-full text-[15px] font-[520] transition-all hover:-translate-y-0.5 shadow-md group"
          >
            <span>Consultar mi comuna</span>
            <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <WhatsAppIcon className="w-4 h-4" />
            </span>
          </a>
        </div>

      </section>

      {/* 7. CLIENTES SECTION */}
      <section className="py-16 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-subtle rounded-[24px] p-8 text-center space-y-4">
          <h3 className="text-[20px] sm:text-[22px] font-[520] text-[#071A30]">
            Algunos de nuestros clientes
          </h3>
          <p className="text-[15px] text-[#56637C] font-[400]">
            Destacando en garantía y respuesta.
          </p>

          <div className="pt-4 flex justify-center">
            <img
              src="https://www.lavadodealfombraschile.cl/img/clientes-selltonerchile.png"
              alt="Clientes atendidos por Lavado de Alfombras Chile"
              className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
              loading="lazy"
              width={320}
              height={64}
              onError={(e) => {
                // If this image is not accessible, hide the container gracefully
                e.currentTarget.parentElement?.parentElement?.remove();
              }}
            />
          </div>
        </div>
      </section>

      {/* 8. COTIZACIÓN FINAL (#contacto) */}
      <section
        id="contacto"
        ref={contactSectionRef}
        className="py-20 lg:py-28 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-panel rounded-[28px] p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/90 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Information */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[13px] font-[470] text-[#13243D]">
                <span>Cotización directa</span>
              </div>

              <h2 className="text-[32px] sm:text-[42px] font-[380] tracking-[-0.03em] text-[#071A30] leading-tight text-balance">
                Cotiza tu lavado de alfombras
              </h2>

              <p className="text-[16px] sm:text-[17px] text-[#4A5873] font-[400] leading-relaxed">
                Envíanos comuna, tipo de servicio y un detalle breve. Te respondemos con una propuesta clara.
              </p>

              {/* Direct channels */}
              <div className="space-y-3 pt-4">
                
                {/* WhatsApp */}
                <a
                  href={buildWhatsAppUrl("Hola, quiero cotizar lavado de alfombras.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white text-[#071A30] border border-[#D8E3EF] transition-all hover:shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[15px] font-[520]">
                      WhatsApp {PHONE_NUMBER}
                    </div>
                    <div className="text-[12px] text-[#56637C]">
                      Indícanos comuna + cantidad de alfombras o habitaciones
                    </div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={PHONE_TEL}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white text-[#071A30] border border-[#D8E3EF] transition-all hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1A3354] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[15px] font-[520]">
                      Teléfono {PHONE_NUMBER}
                    </div>
                    <div className="text-[12px] text-[#56637C]">
                      Para coordinación y agenda directa
                    </div>
                  </div>
                </a>

                {/* Email */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 text-[#071A30] border border-[#D8E3EF]">
                  <div className="w-10 h-10 rounded-full bg-[#E8F0F7] text-[#2E7BD6] flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-[500]">
                      Email
                    </div>
                    <div className="text-[13px] text-[#56637C] select-all">
                      {EMAIL}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[12px] text-[#56637C] pt-4">
              Atendemos todo Santiago, Rancagua, Machalí y comunas aledañas.
            </p>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-[24px] p-6 sm:p-8 border border-white">
            <h3 className="text-[20px] font-[520] text-[#071A30] mb-5">
              Formulario de cotización
            </h3>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-[500]">
                {formError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="form-nombre" className="block text-[13px] font-[500] text-[#071A30] mb-1">
                    Nombre
                  </label>
                  <input
                    id="form-nombre"
                    type="text"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E3EF] text-[14px] text-[#071A30] focus:border-[#2E7BD6] transition-colors"
                  />
                </div>

                {/* Comuna (required) */}
                <div>
                  <label htmlFor="form-comuna" className="block text-[13px] font-[500] text-[#071A30] mb-1">
                    Comuna <span className="text-[#2E7BD6]">*</span>
                  </label>
                  <input
                    id="form-comuna"
                    type="text"
                    required
                    value={formComuna}
                    onChange={(e) => setFormComuna(e.target.value)}
                    placeholder="Ej: Providencia, Las Condes, Rancagua"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E3EF] text-[14px] text-[#071A30] focus:border-[#2E7BD6] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dirección (opcional) */}
                <div>
                  <label htmlFor="form-direccion" className="block text-[13px] font-[500] text-[#071A30] mb-1">
                    Dirección (opcional)
                  </label>
                  <input
                    id="form-direccion"
                    type="text"
                    value={formDireccion}
                    onChange={(e) => setFormDireccion(e.target.value)}
                    placeholder="Calle / sector"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E3EF] text-[14px] text-[#071A30] focus:border-[#2E7BD6] transition-colors"
                  />
                </div>

                {/* Metros cuadrados (opcional) */}
                <div>
                  <label htmlFor="form-metros" className="block text-[13px] font-[500] text-[#071A30] mb-1">
                    Metros cuadrados (opcional)
                  </label>
                  <input
                    id="form-metros"
                    type="text"
                    value={formMetros}
                    onChange={(e) => setFormMetros(e.target.value)}
                    placeholder="Ej: 30 m² o medidas aprox"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E3EF] text-[14px] text-[#071A30] focus:border-[#2E7BD6] transition-colors"
                  />
                </div>
              </div>

              {/* Tipo de servicio (required) */}
              <div>
                <label htmlFor="form-servicio" className="block text-[13px] font-[500] text-[#071A30] mb-1">
                  Tipo de servicio <span className="text-[#2E7BD6]">*</span>
                </label>
                <select
                  id="form-servicio"
                  required
                  value={formServicio}
                  onChange={(e) => setFormServicio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E3EF] text-[14px] text-[#071A30] focus:border-[#2E7BD6] transition-colors"
                >
                  <option value="Alfombra muro a muro">Alfombra muro a muro</option>
                  <option value="Alfombras sueltas (retiro y entrega)">Alfombras sueltas (retiro y entrega)</option>
                  <option value="Empresa / oficina / local">Empresa / oficina / local</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Detalle */}
              <div>
                <label htmlFor="form-detalle" className="block text-[13px] font-[500] text-[#071A30] mb-1">
                  Detalle (mancha, suciedad, cantidad, habitaciones)
                </label>
                <textarea
                  id="form-detalle"
                  rows={3}
                  value={formDetalle}
                  onChange={(e) => setFormDetalle(e.target.value)}
                  placeholder="Describe brevemente tus alfombras (material, manchas de café o mascotas, piso, etc.)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8E3EF] text-[14px] text-[#071A30] focus:border-[#2E7BD6] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-between p-2 pl-5 bg-[#0D2240] hover:bg-[#071A30] text-white rounded-full text-[15px] font-[520] transition-all hover:-translate-y-0.5 shadow-md group cursor-pointer"
              >
                <span>Enviar por WhatsApp</span>
                <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
              </button>

              <p className="text-[12px] text-center text-[#56637C]">
                El formulario abrirá tu WhatsApp con los datos ordenados para coordinar.
              </p>

            </form>
          </div>

        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#071A30] text-white pt-16 pb-24 md:pb-16 border-t border-slate-800">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
            
            {/* Col 1: Identity */}
            <div className="space-y-4">
              <span className="text-[20px] font-[520] tracking-tight block">
                Lavado de Alfombras Chile
              </span>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                Santiago · Domicilio · Retiro y entrega
              </p>
              <div className="text-[13px] text-slate-400 space-y-1.5 pt-2">
                <div>
                  <span className="text-slate-500">Teléfono & WhatsApp: </span>
                  <a href={PHONE_TEL} className="text-white hover:text-[#8DBEF0] transition-colors">
                    {PHONE_NUMBER}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500">Email: </span>
                  <span className="text-slate-300 select-all">{EMAIL}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Servicios */}
            <div className="space-y-3">
              <div className="text-[14px] font-[600] text-slate-200 uppercase tracking-wider">
                Servicios
              </div>
              <ul className="text-[13px] text-slate-400 space-y-2">
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/departamentos.php"
                    className="hover:text-white transition-colors"
                  >
                    Departamentos
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/casas.php"
                    className="hover:text-white transition-colors"
                  >
                    Casas
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/dimensionadas-sueltas.php"
                    className="hover:text-white transition-colors"
                  >
                    Dimensionadas y sueltas
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/limpieza-oficinas.php"
                    className="hover:text-white transition-colors"
                  >
                    Limpieza de oficinas
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/hoteles.php"
                    className="hover:text-white transition-colors"
                  >
                    Hoteles
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/contacto.php"
                    className="hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Cobertura Santiago */}
            <div className="space-y-3">
              <div className="text-[14px] font-[600] text-slate-200 uppercase tracking-wider">
                Cobertura Santiago
              </div>
              <ul className="text-[13px] text-slate-400 space-y-2">
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/santiago-providencia-nunoa.php"
                    className="hover:text-white transition-colors"
                  >
                    Santiago · Providencia · Ñuñoa
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/las-condes-vitacura-la-reina-lo-barnechea.php"
                    className="hover:text-white transition-colors"
                  >
                    Las Condes · Vitacura · La Reina · Lo Barnechea
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/maipu-estacion-central.php"
                    className="hover:text-white transition-colors"
                  >
                    Maipú · Estación Central
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/florida-macul-san-miguel.php"
                    className="hover:text-white transition-colors"
                  >
                    La Florida · Macul · San Miguel
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/quilicura-pudahuel-huechuraba.php"
                    className="hover:text-white transition-colors"
                  >
                    Quilicura · Pudahuel · Huechuraba
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: O'Higgins */}
            <div className="space-y-3">
              <div className="text-[14px] font-[600] text-slate-200 uppercase tracking-wider">
                Región de O’Higgins
              </div>
              <ul className="text-[13px] text-slate-400 space-y-2">
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/rancagua.php"
                    className="hover:text-white transition-colors"
                  >
                    Rancagua
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/rancagua.php"
                    className="hover:text-white transition-colors"
                  >
                    Machalí
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/rancagua.php"
                    className="hover:text-white transition-colors"
                  >
                    Graneros · Requínoa · Olivar
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lavadodealfombraschile.cl/rancagua.php"
                    className="hover:text-white transition-colors"
                  >
                    San Vicente · Mostazal
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
            <div>
              © 2026 Lavado de Alfombras Chile. Todos los derechos reservados.
            </div>
            <div>
              Limpieza de alfombras profesional en Santiago y Región de O’Higgins.
            </div>
          </div>

        </div>
      </footer>

      {/* 10. BARRA FIJA EN MÓVIL (Mobile Bottom Sticky Bar) */}
      {showMobileBar && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-[max(12px,env(safe-area-inset-bottom))] glass-nav border-t border-white/80 shadow-2xl animate-in slide-in-from-bottom duration-200"
          style={{ maxHeight: '15vh' }}
        >
          <div className="max-w-md mx-auto flex items-center gap-2.5">
            {/* Secondary Call Button (1/3 approx) */}
            <a
              href={PHONE_TEL}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-white text-[#071A30] border border-[#D8E3EF] text-[14px] font-[520] shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#2E7BD6]" />
              <span>Llamar</span>
            </a>

            {/* Primary WhatsApp Button (2/3 approx) */}
            <a
              href={buildWhatsAppUrl("Hola, quiero cotizar lavado de alfombras.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] flex items-center justify-between py-2 pl-4 pr-1.5 rounded-full bg-[#0D2240] text-white text-[14px] font-[520] shadow-md hover:bg-[#071A30] transition-colors"
            >
              <span>WhatsApp</span>
              <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <WhatsAppIcon className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      )}

      {/* DIALOG MODAL FOR GALLERY ENLARGEMENT */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A30]/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImageModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-[24px] overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D8E3EF]">
              <span className="text-[17px] font-[520] text-[#071A30]">
                {selectedImageModal.caption}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#071A30] transition-colors"
                aria-label="Cerrar vista ampliada"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-[16px] overflow-hidden max-h-[75vh] flex items-center justify-center bg-slate-100">
              <img
                src={selectedImageModal.src}
                alt={selectedImageModal.alt}
                className="max-h-[70vh] w-auto object-contain mx-auto"
                loading="eager"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[13px] text-[#56637C]">
                Foto real de trabajo en terreno · Lavado de Alfombras Chile
              </p>
              <a
                href={buildWhatsAppUrl("Hola, quiero cotizar un resultado como el de la foto.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D2240] text-white rounded-full text-[13px] font-[520] hover:bg-[#071A30] transition-colors"
              >
                <span>Cotizar este servicio</span>
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
