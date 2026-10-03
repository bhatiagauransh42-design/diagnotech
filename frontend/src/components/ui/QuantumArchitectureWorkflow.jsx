import React from 'react';
import { motion } from 'framer-motion';
import { Database, Filter, Cpu, Activity, ArrowRight, Zap, Target } from 'lucide-react';

const workflowSteps = [
  {
    id: 'data',
    title: 'Clinical Data Input',
    desc: '17 CDC BRFSS Biometric Features',
    icon: <Database size={24} color="#0284C7" />,
    color: '#0284c7',
    bg: '#E0F2FE'
  },
  {
    id: 'pca',
    title: 'Dimensionality Reduction',
    desc: 'PCA maps to 6 intrinsic features',
    icon: <Filter size={24} color="#059669" />,
    color: '#059669',
    bg: '#DCFCE7'
  },
  {
    id: 'zzmap',
    title: 'Quantum State Encoding',
    desc: '6-Qubit ZZFeatureMap (Non-linear)',
    icon: <Cpu size={24} color="#7c3aed" />,
    color: '#7c3aed',
    bg: '#EDE9FE'
  },
  {
    id: 'kernel',
    title: 'Hilbert Space Fidelity',
    desc: 'Inner product K(x, z) evaluated',
    icon: <Zap size={24} color="#d97706" />,
    color: '#d97706',
    bg: '#FEF3C7'
  },
  {
    id: 'qsvc',
    title: 'QSVC Classification',
    desc: 'Hyperplane separation in Hilbert space',
    icon: <Target size={24} color="#e11d48" />,
    color: '#e11d48',
    bg: '#FFE4E6'
  },
  {
    id: 'output',
    title: 'Diagnostic Prediction',
    desc: 'Enhanced Sensitivity for Early Risk',
    icon: <Activity size={24} color="#00E87E" />,
    color: '#059669',
    bg: '#ECFDF5'
  }
];

export function QuantumArchitectureWorkflow() {
  return (
    <div style={{
      width: '100%',
      padding: '3rem 2rem',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      marginBottom: '3rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F0F0F', marginBottom: '0.5rem' }}>
          Quantum Machine Learning Architecture Pipeline
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          End-to-end data flow from clinical features to high-dimensional quantum kernel classification.
        </p>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        position: 'relative',
        zIndex: 2
      }}>
        {workflowSteps.map((step, index) => {
          const isLast = index === workflowSteps.length - 1;
          return (
            <React.Fragment key={step.id}>
              {/* Node Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.5rem 1rem',
                  width: '180px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  cursor: 'default'
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  backgroundColor: step.bg, border: `1px solid ${step.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {step.icon}
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F0F0F', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                  {step.desc}
                </p>
              </motion.div>

              {/* Connecting Arrow/Line */}
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 0.25rem',
                    color: '#94A3B8'
                  }}
                >
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
