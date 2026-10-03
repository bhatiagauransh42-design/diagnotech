import React, { useState } from 'react';
import { HelpCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function ShapChart({ explanation }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!explanation || !explanation.features || explanation.features.length === 0) {
    return (
      <div className="glass-panel shap-card">
        <div style={{ color: 'var(--text-muted)' }}>No local SHAP explanation available.</div>
      </div>
    );
  }

  // Display top 8 features by impact
  const topFeatures = explanation.features.slice(0, 8);
  const maxMag = Math.max(...topFeatures.map(f => f.magnitude), 0.1);

  return (
    <div className="glass-panel shap-card" id="shap-explainability-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem', color: '#0F0F0F' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Explainable AI Interpretability
          </div>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem', color: '#0F0F0F' }}>
            Local SHAP Feature Contributions
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#DC2626' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#EF4444', display: 'inline-block' }}></span>
            <span>Increases Risk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10B981', display: 'inline-block' }}></span>
            <span>Decreases Risk</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '1.25rem' }}>
        TreeSHAP decomposes the model output into individual additive contributions from each lifestyle and biometric factor.
      </p>

      <div className="shap-list">
        {topFeatures.map((feat, idx) => {
          const isIncrease = feat.direction === 'increases_risk';
          const barWidth = Math.min(100, Math.max(8, (feat.magnitude / maxMag) * 100));
          const isHovered = activeTooltip === idx;

          return (
            <div 
              key={feat.feature}
              style={{
                position: 'relative',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: isHovered ? '#F8FAFC' : 'transparent',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={() => setActiveTooltip(idx)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="shap-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div className="shap-feature-name" title={feat.display_name} style={{ color: '#0F0F0F', fontWeight: 600, fontSize: '0.86rem', minWidth: '160px' }}>
                  {feat.display_name}
                </div>

                <div className="shap-bar-bg" style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    className={`shap-bar-fill ${isIncrease ? 'increase' : 'decrease'}`}
                    style={{ 
                      width: `${barWidth}%`, 
                      height: '100%', 
                      borderRadius: '9999px',
                      backgroundColor: isIncrease ? '#EF4444' : '#10B981',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>

                <div className="shap-val-text" style={{ color: isIncrease ? '#DC2626' : '#059669', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', minWidth: '60px', textAlign: 'right' }}>
                  {isIncrease ? '+' : ''}{feat.shap_value.toFixed(3)}
                </div>
              </div>

              {/* Explanatory description below item */}
              <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '0.25rem', paddingLeft: '2px' }}>
                {feat.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
