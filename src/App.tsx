import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Database, Cpu, Network, Lock, Unlock, Zap, Server, 
    Code, Globe, Box, Layers, Shield, Activity, 
    ArrowRightLeft, FileCode, Search, Settings, 
    HardDrive, Layout, Share2, Terminal
} from 'lucide-react';
import topicData from './data/current_topic.json';

const IconMap = {
    Database, Cpu, Network, Lock, Unlock, Zap, Server,
    Code, Globe, Box, Layers, Shield, Activity,
    ArrowRightLeft, FileCode, Search, Settings,
    HardDrive, Layout, Share2, Terminal
};

export default function App() {
    const [step, setStep] = useState(0);
    const { topLabel, mainTitle, badge, differences } = topicData;

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % differences.length);
        }, 3400); 
        return () => clearInterval(interval);
    }, [differences.length]);

    const currentDiff = differences[step];

    return (
        <div className="app-wrapper">
            <div className="top-header">
                <p className="top-label">{topLabel}</p>
                <div className="main-title">
                    <span className="text-sql" style={{ color: topicData.leftColor || '#00d2ff' }}>{mainTitle.left}</span>
                    <span className="text-vs">{mainTitle.vs}</span>
                    <span className="text-nosql" style={{ color: topicData.rightColor || '#ff5c00' }}>{mainTitle.right}</span>
                </div>
                <div className="differences-badge">{badge}</div>
            </div>

            {/* TIMELINE */}
            <div className="timeline">
                <div className="timeline-line"></div>
                {differences.map((_, i) => (
                    <div key={i} className={`timeline-step ${step >= i ? 'active' : ''}`} style={{ borderColor: step >= i ? (i === step ? '#fff' : '#444') : '#222' }}>
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* MAIN COMPARISON */}
            <div className="cards-grid">

                {/* LEFT CARD */}
                <div className="card-column">
                    <div className="card-title-group">
                        <h2 className="card-hero-title" style={{ color: topicData.leftColor || '#00d2ff' }}>{mainTitle.left}</h2>
                        <p className="card-sub">{topicData.leftSub || 'Standard'}</p>
                    </div>

                    <div className="sql-card" style={{ borderColor: (topicData.leftColor || '#00d2ff') + '33' }}>
                        <div className="viz-content">
                            <AnimatePresence mode="wait">
                                <GenericVisual 
                                    key={`left-${step}`} 
                                    side="left" 
                                    step={step} 
                                    data={currentDiff} 
                                    color={topicData.leftColor || '#00d2ff'} 
                                />
                            </AnimatePresence>
                        </div>
                        <div className="explanation-footer">
                            <h3 className="exp-title" style={{ color: topicData.leftColor || '#00d2ff' }}>{currentDiff.leftTitle}</h3>
                            <p className="exp-desc">{currentDiff.leftDesc}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="card-column">
                    <div className="card-title-group">
                        <h2 className="card-hero-title" style={{ color: topicData.rightColor || '#ff5c00' }}>{mainTitle.right}</h2>
                        <p className="card-sub">{topicData.rightSub || 'Modern'}</p>
                    </div>

                    <div className="nosql-card" style={{ borderColor: (topicData.rightColor || '#ff5c00') + '33' }}>
                        <div className="viz-content">
                            <AnimatePresence mode="wait">
                                <GenericVisual 
                                    key={`right-${step}`} 
                                    side="right" 
                                    step={step} 
                                    data={currentDiff} 
                                    color={topicData.rightColor || '#ff5c00'} 
                                />
                            </AnimatePresence>
                        </div>
                        <div className="explanation-footer">
                            <h3 className="exp-title" style={{ color: topicData.rightColor || '#ff5c00' }}>{currentDiff.rightTitle}</h3>
                            <p className="exp-desc">{currentDiff.rightDesc}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div style={{ textAlign: 'center', opacity: 0.1, fontFamily: 'monospace', fontSize: '18px', marginTop: '40px' }}>
                @this.girl.tech • visualized by kreggscode
            </div>
        </div>
    );
}

const GenericVisual = ({ side, step, data, color }) => {
    const iconName = side === 'left' ? data.leftIcon : data.rightIcon;
    const Icon = IconMap[iconName] || (side === 'left' ? Database : Server);

    // Special logic for SQL vs NoSQL if we want to keep it, 
    // but better to make it generic based on data
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }} 
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                gap: '20px'
            }}
        >
            <div style={{ 
                padding: '40px', 
                borderRadius: '30px', 
                background: `${color}11`, 
                border: `2px solid ${color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 30px ${color}11`
            }}>
                <Icon size={120} color={color} strokeWidth={1.5} />
            </div>

            {data[side + 'VisualText'] && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ 
                        fontSize: '24px', 
                        fontFamily: 'monospace', 
                        color: color,
                        background: '#000',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: `1px solid ${color}44`
                    }}
                >
                    {data[side + 'VisualText']}
                </motion.div>
            )}
        </motion.div>
    );
};

