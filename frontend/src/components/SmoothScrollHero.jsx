import React, { useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { 
  FiArrowRight, 
  FiMapPin, 
  FiAward, 
  FiActivity, 
  FiFileText, 
  FiCompass, 
  FiCpu, 
  FiShield,
  FiCheckCircle
} from 'react-icons/fi';
import { GiCaduceus } from 'react-icons/gi';

export const SmoothScrollHero = ({ children, onStartScreening, onScanReport }) => {
  return (
    <div className="bg-zinc-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      <ReactLenis
        root
        options={{
          lerp: 0.06,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
          smoothWheel: true,
        }}
      >
        <Nav onStartScreening={onStartScreening} onScanReport={onScanReport} />
        <Hero onStartScreening={onStartScreening} onScanReport={onScanReport} />
        <MilestonesSchedule />
        {children}
      </ReactLenis>
    </div>
  );
};

const Nav = ({ onStartScreening, onScanReport }) => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-zinc-950/70 border-b border-zinc-800/60 text-white transition-all duration-300">
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_28px_rgba(6,182,212,0.6)] transition-all">
          <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
            <GiCaduceus className="text-cyan-400 text-2xl group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-zinc-100">
              DIAGNOTECH
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              Bharat AI
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 hidden sm:block">
            Celebrating India’s Healthcare Innovations & AI Decision Support
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            document.getElementById("medical-milestones")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-400 hover:text-cyan-300 transition-colors py-1.5 px-3 rounded-lg hover:bg-zinc-900/60"
        >
          <FiAward className="text-cyan-400" />
          MILESTONES
        </button>

        <button
          onClick={() => {
            if (onScanReport) {
              onScanReport();
            } else {
              document.getElementById("report-scanner-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-300 hover:text-white transition-all py-1.5 px-3.5 rounded-lg border border-zinc-700/80 bg-zinc-900/70 hover:border-cyan-500/50 hover:bg-zinc-800/80"
        >
          <FiFileText className="text-emerald-400" />
          <span className="hidden sm:inline">AI REPORT</span> SCANNER
        </button>

        <button
          onClick={() => {
            if (onStartScreening) {
              onStartScreening();
            } else {
              document.getElementById("clinical-workspace")?.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-zinc-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all py-1.5 px-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>CLINICAL SUITE</span>
          <FiArrowRight className="text-sm" />
        </button>
      </div>
    </nav>
  );
};

const SECTION_HEIGHT = 1500;

const Hero = ({ onStartScreening, onScanReport }) => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full overflow-hidden"
    >
      <CenterImage />

      {/* Floating Hero Copy overlay */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 pt-32 sm:pt-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-wide mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CELEBRATING INDIA'S LANDMARK MEDICAL BREAKTHROUGHS & AI PRECISION</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.1]"
        >
          Bharat's Triumph In <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Medical Innovation
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mx-auto max-w-3xl text-sm sm:text-base md:text-lg text-zinc-300 font-medium leading-relaxed"
        >
          From indigenous vaccines protecting 2.2 billion lives to the world-record scale of Ayushman Bharat Digital Mission (ABDM), eSanjeevani telemedicine, and now Quantum-enhanced early AI screening.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              if (onStartScreening) {
                onStartScreening();
              } else {
                document.getElementById("clinical-workspace")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-6 py-3 rounded-full font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105"
          >
            <FiActivity className="text-cyan-600 text-base" />
            <span>Launch Clinical Screening</span>
            <FiArrowRight />
          </button>

          <button
            onClick={() => {
              document.getElementById("medical-milestones")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-full font-semibold text-sm bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <span>Explore Milestones Schedule</span>
          </button>
        </motion.div>
      </div>

      <ParallaxImages />

      {/* Smooth bottom gradient overlay transitioning into the milestones & workspace */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 via-zinc-950/80 to-zinc-950 pointer-events-none" />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full pointer-events-none"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        // High-res medical scientist & healthcare technology visual
        backgroundImage:
          "url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.68) contrast(1.15)",
      }}
    >
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-950/40 to-zinc-950/90" />
    </motion.div>
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-[180px] relative z-20">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2680&auto=format&fit=crop"
        alt="Indigenous Vaccine Innovation - Bharat Biotech & Serum Institute"
        badge="Indigenous Vaccines"
        title="2.2 Billion Doses Delivered"
        desc="Covaxin & Covishield powered the world's largest vaccination drive with verifiable digital certificates."
        start={-180}
        end={220}
        className="w-11/12 sm:w-1/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2680&auto=format&fit=crop"
        alt="Ayushman Bharat Digital Mission - Universal Digital Health Accounts"
        badge="ABDM & CoWIN"
        title="World's Largest Digital Health Stack"
        desc="500M+ Ayushman Bharat Health Accounts (ABHA) unifying interoperable EHRs across public & private sectors."
        start={220}
        end={-260}
        className="mx-auto w-11/12 sm:w-2/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2680&auto=format&fit=crop"
        alt="eSanjeevani Telemedicine - Reaching 100M+ Rural Citizens"
        badge="eSanjeevani"
        title="100M+ Rural Teleconsultations"
        desc="Democratizing super-specialist consultations directly to remote Primary Health Centres (PHCs)."
        start={-220}
        end={180}
        className="ml-auto w-11/12 sm:w-1/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2680&auto=format&fit=crop"
        alt="Robotic Telesurgery & AI Cath Labs - AIIMS & Apollo"
        badge="Robotic Telesurgery"
        title="Next-Gen Surgical Precision"
        desc="Pioneering robotic cardiovascular & neurosurgical interventions with sub-millimeter clinical accuracy."
        start={0}
        end={-520}
        className="sm:ml-28 w-11/12 sm:w-5/12"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end, badge, title, desc }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0.1]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.88]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      ref={ref}
      style={{ transform, opacity }}
      className={`group relative my-8 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 ${className}`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        {badge && (
          <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-950/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
            {badge}
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </p>
          {desc && (
            <p className="mt-0.5 text-xs text-zinc-400 line-clamp-2">
              {desc}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MilestonesSchedule = () => {
  return (
    <section
      id="medical-milestones"
      className="mx-auto max-w-5xl px-4 py-36 text-white relative z-20"
    >
      <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
        <FiAward className="text-sm" />
        <span>India's Medical Innovation Timeline & AI Deployment</span>
      </div>

      <motion.h2
        initial={{ y: 36, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-6 text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-50"
      >
        Landmark Milestones & Clinical Rollout
      </motion.h2>

      <p className="mb-16 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
        A documented track record of indigenous clinical breakthroughs, global pharmaceutical manufacturing, and the nationwide deployment of AI-powered preventive screening.
      </p>

      <div className="divide-y divide-zinc-800/80 border-t border-b border-zinc-800/80">
        <ScheduleItem 
          title="Covaxin Indigenous Whole-Virion Vaccine" 
          category="Biotech & Immunization"
          date="January 2021" 
          location="Bharat Biotech • Hyderabad" 
          highlight="1st indigenous adjuvant vaccine"
        />
        <ScheduleItem 
          title="CoWIN Digital Vaccine Infrastructure (2.2B Doses)" 
          category="Digital Public Infrastructure"
          date="October 2021" 
          location="Pan-India Open Cloud Stack" 
          highlight="100% digital QR verification"
        />
        <ScheduleItem 
          title="Ayushman Bharat Digital Mission (ABDM)" 
          category="Universal EHR Architecture"
          date="September 2021" 
          location="National Health Authority • New Delhi" 
          highlight="500M+ ABHA health IDs"
        />
        <ScheduleItem 
          title="eSanjeevani National Teleconsultation Milestone" 
          category="Rural Telemedicine Access"
          date="February 2023" 
          location="115,000+ Health & Wellness Centres" 
          highlight="100M+ remote OPD sessions"
        />
        <ScheduleItem 
          title="10,000 Indigenome Whole-Genome Mapping" 
          category="Genomic Medicine & Rare Disease"
          date="March 2024" 
          location="CSIR & DBT • National Consortium" 
          highlight="Pop-specific reference genome"
        />
        <ScheduleItem 
          title="DiagnoTech AI Quantum Decision Support Rollout" 
          category="Quantum-Kernel Preventive CDS"
          date="Active Deployment" 
          location="PHC & District Hospital Pilot" 
          highlight="17 CDC BRFSS calibrated markers"
        />
        <ScheduleItem 
          title="AI-Assisted Robotic Telesurgery & Cath Labs" 
          category="Advanced Surgical Intervention"
          date="Nationwide Expansion" 
          location="AIIMS • Apollo • Medanta" 
          highlight="Sub-millimeter catheter robotics"
        />
      </div>

      <div className="mt-14 flex items-center justify-between p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-zinc-900/40 to-emerald-950/30 backdrop-blur-md">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <FiShield className="text-emerald-400" />
            Integrated with National Health Informatics Standards
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Compliant with ABDM M1/M2 specifications, HL7 FHIR biometrics, and CDC BRFSS epidemiological surveillance benchmarks.
          </p>
        </div>
        <button
          onClick={() => {
            document.getElementById("clinical-workspace")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-white px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
        >
          <span>ENTER CLINICAL SUITE</span>
          <FiArrowRight />
        </button>
      </div>
    </section>
  );
};

const ScheduleItem = ({ title, category, date, location, highlight }) => {
  return (
    <motion.div
      initial={{ y: 32, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ease: "easeInOut", duration: 0.6 }}
      className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 px-3 transition-colors hover:bg-zinc-900/40 rounded-xl"
    >
      <div className="mb-3 sm:mb-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
            {category}
          </span>
          {highlight && (
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded flex items-center gap-1">
              <FiCheckCircle className="text-[10px]" />
              {highlight}
            </span>
          )}
        </div>
        <p className="text-lg font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
          {title}
        </p>
        <p className="text-xs font-medium text-zinc-500 mt-0.5">{date}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
        <FiMapPin className="text-cyan-400 text-base flex-shrink-0" />
        <span className="font-medium">{location}</span>
      </div>
    </motion.div>
  );
};
