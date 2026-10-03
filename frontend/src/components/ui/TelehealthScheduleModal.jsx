import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Activity, 
  Sparkles, 
  User, 
  CheckCircle, 
  FileText, 
  Download,
  AlertCircle
} from 'lucide-react';

const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh K. Sharma',
    title: 'Chief of Endocrinology & Diabetes Care',
    institution: 'AIIMS New Delhi',
    avatar: 'RS',
    avatarBg: '#00c9e8',
    specialty: 'Metabolic & Glycemic Disorders',
    nextSlot: 'Today, 03:30 PM'
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Nair, MD, DM',
    title: 'Senior Consultant Interventional Cardiologist',
    institution: 'AIIMS New Delhi / Cardiology Wing',
    avatar: 'PN',
    avatarBg: '#4469ee',
    specialty: 'Cardiovascular Risk & Atherosclerosis',
    nextSlot: 'Tomorrow, 10:15 AM'
  },
  {
    id: 'doc-3',
    name: 'Dr. M. S. Joshi',
    title: 'Director of Preventive Health & Wellness',
    institution: 'AIIMS New Delhi',
    avatar: 'MJ',
    avatarBg: '#00e87e',
    specialty: 'Epidemiological Prevention',
    nextSlot: 'Tomorrow, 02:00 PM'
  }
];

const TIME_SLOTS = [
  '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
  '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
];

export default function TelehealthScheduleModal({
  isOpen,
  onClose,
  initialMode = 'schedule', // 'schedule' or 'call'
  patient,
  screeningRisk
}) {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[2]);
  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  const [consultType, setConsultType] = useState('virtual'); // 'virtual', 'in-clinic', 'monitoring'
  const [isBooked, setIsBooked] = useState(false);

  // Telehealth call state
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [transcriptLines, setTranscriptLines] = useState([
    { speaker: 'Dr. Rajesh Sharma', time: '14:02:10', text: 'Good afternoon. I am reviewing your recent DiagnoTech screening biomarkers.' },
    { speaker: 'System AI NLP', time: '14:02:15', text: '● Live Telemetry Synced: Resting BP 144/92 mmHg, BMI 29.8 kg/m², Fasting Glycemia 168 mg/dL.' },
    { speaker: 'Patient', time: '14:02:28', text: 'Doctor, I noticed higher fatigue after morning walks and wanted to review my medication.' },
    { speaker: 'Dr. Rajesh Sharma', time: '14:02:45', text: 'Understood. The 6-qubit quantum classifier flagged metabolic sensitivity. We will initiate daily morning BP logging.' }
  ]);

  useEffect(() => {
    setActiveMode(initialMode);
    setIsBooked(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleConfirmBooking = () => {
    setIsBooked(true);
  };

  return (
    <div className="koru-modal-backdrop" onClick={onClose} id="telehealth-modal-backdrop">
      <div 
        className="koru-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: activeMode === 'call' ? '980px' : '860px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#0F0F0F' }}
      >
        {/* Modal Top Bar */}
        <div style={{
          padding: '1.2rem 1.75rem',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00c9e8, #00e87e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0, 201, 232, 0.25)'
            }}>
              {activeMode === 'call' ? <Video size={20} /> : <Calendar size={20} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F0F0F', margin: 0 }}>
                  {activeMode === 'call' ? 'AIIMS Telemedicine Virtual Consultation Room' : 'Clinical Appointment Scheduling'}
                </h2>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: activeMode === 'call' ? '#F0FDF4' : '#EFF6FF',
                  color: activeMode === 'call' ? '#166534' : '#2563EB',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: `1px solid ${activeMode === 'call' ? '#BBF7D0' : '#DBEAFE'}`
                }}>
                  {activeMode === 'call' ? 'CATEGORY 4 • TELEMEDICINE' : 'CATEGORY 3 • SCHEDULING'}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Active Patient: <strong>{patient ? patient.name : 'Ramesh Chandra Kumar'}</strong> ({patient ? patient.mrn : 'MRN-89410'})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '9999px', padding: '3px', border: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setActiveMode('schedule')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  background: activeMode === 'schedule' ? '#0284C7' : 'transparent',
                  color: activeMode === 'schedule' ? '#FFFFFF' : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Schedule Slot
              </button>
              <button
                onClick={() => setActiveMode('call')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  background: activeMode === 'call' ? '#00E87E' : 'transparent',
                  color: activeMode === 'call' ? '#050811' : '#4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Live Room
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4B5563',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODE 1: APPOINTMENT SCHEDULING (Koru Category 3) */}
        {activeMode === 'schedule' && (
          <div style={{ padding: '1.75rem', overflowY: 'auto', maxHeight: '72vh', backgroundColor: '#FFFFFF' }}>
            {!isBooked ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
                {/* Left: Doctor Directory & Consultation Type */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em', marginBottom: '0.85rem', fontWeight: 800 }}>
                    1. Select AIIMS Healthcare Specialist
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {DOCTORS.map((doc) => {
                      const isSelected = selectedDoctor.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctor(doc)}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '14px',
                            background: isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isSelected ? '1.5px solid #0284C7' : '1px solid #E5E7EB',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)'
                          }}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: doc.avatarBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: '#ffffff',
                            flexShrink: 0
                          }}>
                            {doc.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: '#0F0F0F', fontSize: '0.9rem' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 600 }}>
                              {doc.specialty}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {doc.institution} • Next: {doc.nextSlot}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em', marginBottom: '0.75rem', fontWeight: 800 }}>
                    2. Consultation Mode
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[
                      { key: 'virtual', label: 'Telehealth Video', icon: Video },
                      { key: 'in-clinic', label: 'In-Clinic AIIMS', icon: User },
                      { key: 'monitoring', label: 'Telemetry Audit', icon: Activity }
                    ].map((type) => {
                      const isChosen = consultType === type.key;
                      return (
                        <button
                          key={type.key}
                          onClick={() => setConsultType(type.key)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: '10px',
                            border: isChosen ? '1.5px solid #00E87E' : '1px solid #E5E7EB',
                            background: isChosen ? '#F0FDF4' : '#FFFFFF',
                            color: isChosen ? '#065F46' : '#4B5563',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: isChosen ? '0 2px 8px rgba(0, 232, 126, 0.2)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <type.icon size={16} color={isChosen ? '#00E87E' : '#64748B'} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Date, Time Slots & Pre-visit Context */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em', marginBottom: '0.85rem', fontWeight: 800 }}>
                    3. Select Date & Dedicated Time Slot
                  </h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#0F0F0F',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {TIME_SLOTS.map((slot) => {
                      const isChosen = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '0.55rem 0.2rem',
                            borderRadius: '8px',
                            border: isChosen ? '1.5px solid #0284C7' : '1px solid #E5E7EB',
                            background: isChosen ? '#0284C7' : '#FFFFFF',
                            color: isChosen ? '#FFFFFF' : '#4B5563',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: isChosen ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pre-Visit Clinical Context (Koru Consideration) */}
                  <div style={{
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '12px',
                    padding: '0.9rem',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#166534', fontWeight: 800 }}>
                      Automatic Pre-Visit Clinical Transfer
                    </span>
                    <p style={{ fontSize: '0.8rem', color: '#1E293B', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      Biometrics from current screening (BP 144/92, BMI 29.8, SHAP risk factors) will be forwarded to {selectedDoctor.name} before the encounter.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    style={{
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      backgroundColor: '#00E87E',
                      color: '#050811',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0, 232, 126, 0.35)'
                    }}
                    id="confirm-booking-btn"
                  >
                    <CheckCircle size={18} />
                    <span>Confirm & Book Appointment</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Success Confirmation (Koru Category 3) */
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#F0FDF4',
                  border: '2px solid #00E87E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: '#00E87E'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F0F0F' }}>
                  Clinical Appointment Confirmed!
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
                  Your appointment with <strong>{selectedDoctor.name}</strong> ({selectedDoctor.institution}) is scheduled for <strong>{selectedDate} at {selectedSlot}</strong>.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveMode('call')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.4rem',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      backgroundColor: '#00E87E',
                      color: '#050811',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0, 232, 126, 0.35)'
                    }}
                  >
                    <Video size={16} />
                    <span>Enter Virtual Telehealth Room Now</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Appointment calendar file (.ics) downloaded.');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.2rem',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      backgroundColor: '#FFFFFF',
                      color: '#1E293B',
                      border: '1px solid #E5E7EB',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Download size={15} />
                    <span>Save to Calendar (.ics)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: LIVE TELEMEDICINE VIRTUAL ROOM (Koru Category 4) */}
        {activeMode === 'call' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '1.25rem' }}>
              {/* Left: Video Pane & Live Telemetry HUD */}
              <div>
                <div className="koru-telehealth-video-pane">
                  {/* Telemetry HUD (Koru UX Feature) */}
                  <div className="koru-telemetry-hud">
                    <div className="koru-telemetry-pill">
                      <Activity size={14} color="#00e87e" />
                      <span>HEART RATE: <strong>78 BPM</strong></span>
                    </div>
                    <div className="koru-telemetry-pill">
                      <Sparkles size={14} color="#00c9e8" />
                      <span>SPO2: <strong>98%</strong></span>
                    </div>
                    <div className="koru-telemetry-pill">
                      <AlertCircle size={14} color="#f59e0b" />
                      <span>BP: <strong>144/92 mmHg</strong></span>
                    </div>
                  </div>

                  {/* Doctor Video Mock */}
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00c9e8, #4469ee)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.8rem',
                      color: '#ffffff',
                      margin: '0 auto 0.75rem',
                      boxShadow: '0 0 30px rgba(0, 201, 232, 0.4)'
                    }}>
                      RS
                    </div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
                      Dr. Rajesh K. Sharma (AIIMS)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#00e87e' }}>
                      ● Connected • High Definition Encrypted Stream
                    </div>
                  </div>

                  {/* Self Picture-in-Picture */}
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    width: '130px',
                    height: '85px',
                    background: '#151c2e',
                    border: '1.5px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    color: '#94a3b8',
                    flexDirection: 'column'
                  }}>
                    <User size={18} color="#00c9e8" />
                    <span>Patient Feed</span>
                  </div>
                </div>

                {/* Call Control Toolbar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <button
                    onClick={() => setMicOn(!micOn)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: micOn ? '#F1F5F9' : '#FEE2E2',
                      color: micOn ? '#0F0F0F' : '#EF4444',
                      border: micOn ? '1px solid #CBD5E1' : '1px solid #FECACA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                    }}
                    title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>

                  <button
                    onClick={() => setVideoOn(!videoOn)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: videoOn ? '#F1F5F9' : '#FEE2E2',
                      color: videoOn ? '#0F0F0F' : '#EF4444',
                      border: videoOn ? '1px solid #CBD5E1' : '1px solid #FECACA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                    }}
                    title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
                  >
                    {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
                  </button>

                  <button
                    onClick={onClose}
                    style={{
                      padding: '0 1.25rem',
                      height: '44px',
                      borderRadius: '9999px',
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <PhoneOff size={18} />
                    <span>End Consultation</span>
                  </button>
                </div>
              </div>

              {/* Right: Live AI Real-Time Transcription & Notes */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#0284C7', fontWeight: 800, letterSpacing: '0.05em' }}>
                    Live AI Encounter Transcript
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                    REC • 00:03:42
                  </span>
                </div>

                <div className="koru-transcript-stream" style={{ height: '280px', maxHeight: '280px', backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1rem', overflowY: 'auto' }}>
                  {transcriptLines.map((line, idx) => (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                        <strong style={{ color: line.speaker.includes('Doctor') ? '#0284C7' : line.speaker.includes('AI') ? '#059669' : '#1E293B' }}>
                          {line.speaker}
                        </strong>
                        <span>{line.time}</span>
                      </div>
                      <div style={{ marginTop: '2px', color: '#1E293B', fontSize: '0.82rem', lineHeight: 1.4 }}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consultation Quick Actions */}
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setTranscriptLines(prev => [
                        ...prev,
                        { speaker: 'Doctor Note', time: new Date().toLocaleTimeString(), text: 'Prescription added: Telmisartan 40mg daily + Metformin 500mg SR.' }
                      ]);
                    }}
                    style={{
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.6rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      color: '#1E293B',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                    }}
                  >
                    <FileText size={13} />
                    <span>Append Clinical Note & Rx</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
