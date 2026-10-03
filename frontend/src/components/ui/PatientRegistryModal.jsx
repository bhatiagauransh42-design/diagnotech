import React, { useState } from 'react';
import { 
  Search, 
  X, 
  UserCheck, 
  Activity, 
  Video, 
  Stethoscope
} from 'lucide-react';
import { PATIENT_REGISTRY } from '../../data/patientRegistryData';

export default function PatientRegistryModal({
  isOpen,
  onClose,
  onSelectPatient,
  onOpenTelehealth,
  currentPatientId
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAcuity, setFilterAcuity] = useState('ALL');

  if (!isOpen) return null;

  const filteredPatients = PATIENT_REGISTRY.filter((pt) => {
    const matchesSearch = 
      pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.assignedDoctor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAcuity = 
      filterAcuity === 'ALL' || pt.acuity.toUpperCase() === filterAcuity;

    return matchesSearch && matchesAcuity;
  });

  const getAcuityClass = (acuity) => {
    if (acuity === 'High') return 'koru-acuity-high';
    if (acuity === 'Moderate') return 'koru-acuity-moderate';
    return 'koru-acuity-low';
  };

  return (
    <div className="koru-modal-backdrop" onClick={onClose} id="patient-registry-modal-backdrop">
      <div 
        className="koru-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1020px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', color: '#0F0F0F' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
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
              background: 'linear-gradient(135deg, #00c9e8, #4469ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(68, 105, 238, 0.25)'
            }}>
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F0F0F', margin: 0 }}>
                Patient Look-Up List & Registry
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Koru UX Category 1 • Multi-parameter search & acuity risk stratification
              </span>
            </div>
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
            id="close-registry-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{
          padding: '1rem 1.75rem',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#F8FAFC'
        }}>
          {/* Search Input */}
          <div className="koru-search-box" style={{ flex: 1, minWidth: '280px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB' }}>
            <Search size={18} color="#0284C7" />
            <input
              type="text"
              placeholder="Search by Patient Name, MRN ID, Condition, or Physician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#0F0F0F',
                width: '100%',
                fontSize: '0.88rem'
              }}
              autoFocus
              id="registry-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Acuity Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((tag) => {
              const isActive = filterAcuity === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setFilterAcuity(tag)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isActive 
                      ? '1px solid #2563EB' 
                      : '1px solid #E5E7EB',
                    background: isActive 
                      ? '#EFF6FF' 
                      : '#FFFFFF',
                    color: isActive ? '#2563EB' : '#4B5563',
                    boxShadow: isActive ? '0 1px 4px rgba(37, 99, 235, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  id={`filter-pill-${tag.toLowerCase()}`}
                >
                  {tag === 'ALL' ? 'All Patients' : `${tag} Acuity`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Table Content */}
        <div style={{ overflowY: 'auto', flex: 1, maxHeight: '52vh', backgroundColor: '#FFFFFF' }}>
          <table className="koru-patient-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Acuity Tier</th>
                <th>Clinical Profile</th>
                <th>Latest Vitals</th>
                <th>Wearable Source</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((pt) => {
                const isSelected = pt.id === currentPatientId;
                const initials = pt.name
                  .split(' ')
                  .filter(n => !n.startsWith('Dr.'))
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <tr key={pt.id} style={{ background: isSelected ? '#EFF6FF' : 'transparent' }}>
                    {/* Patient Column */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          className="koru-avatar-badge"
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            fontSize: '0.85rem',
                            background: pt.avatarBg 
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F0F0F', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {pt.name}
                            {isSelected && (
                              <span style={{ fontSize: '0.65rem', background: '#00E87E', color: '#050811', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                            {pt.mrn} • {pt.age}y {pt.gender[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Acuity Column */}
                    <td>
                      <span className={`koru-acuity-pill ${getAcuityClass(pt.acuity)}`}>
                        <span 
                          className="koru-acuity-dot" 
                          style={{ 
                            background: pt.acuity === 'High' ? '#ef4444' : pt.acuity === 'Moderate' ? '#f59e0b' : '#00e87e' 
                          }} 
                        />
                        {pt.acuity}
                      </span>
                    </td>

                    {/* Condition Column */}
                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#1E293B', maxWidth: '240px', lineHeight: 1.35, fontWeight: 500 }}>
                        {pt.primaryCondition}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                        {pt.assignedDoctor}
                      </div>
                    </td>

                    {/* Vitals Column */}
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F0F0F' }}>
                        BP {pt.vitalsSummary.bp}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 500 }}>
                        BMI {pt.vitalsSummary.bmi} • HbA1c {pt.vitalsSummary.hba1c}
                      </div>
                    </td>

                    {/* Wearable Column */}
                    <td>
                      <span className="koru-wearable-tag">
                        <Activity size={12} />
                        {pt.wearableSync}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            onSelectPatient(pt);
                            onClose();
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            borderRadius: '9999px',
                            backgroundColor: '#00E87E',
                            color: '#050811',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0, 232, 126, 0.3)'
                          }}
                          id={`select-patient-btn-${pt.id}`}
                        >
                          <UserCheck size={14} />
                          <span>Load Vitals</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectPatient(pt);
                            onClose();
                            if (onOpenTelehealth) onOpenTelehealth('call');
                          }}
                          style={{
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.76rem',
                            borderRadius: '9999px',
                            backgroundColor: '#FFFFFF',
                            color: '#1E293B',
                            border: '1px solid #E5E7EB',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                          title="Launch direct video consultation"
                        >
                          <Video size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No patients match your search criteria. Try a different search term or reset filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.9rem 1.75rem',
          borderTop: '1px solid #E5E7EB',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748B'
        }}>
          <div>
            Showing <strong>{filteredPatients.length}</strong> of <strong>{PATIENT_REGISTRY.length}</strong> verified clinical records
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ color: '#059669', fontWeight: 600 }}>● Encrypted HIPAA & HITECH Compliant Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
}
