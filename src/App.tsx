import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Database, Cpu, Network, Lock, Unlock, Zap, Server, 
    Code, Globe, Box, Layers, Shield, Activity, 
    ArrowRightLeft, FileCode, Search, Settings, 
    HardDrive, Layout, Share2, Terminal
} from 'lucide-react';
import topicData from './data/current_topic.json';

const IconMap: Record<string, React.ComponentType<any>> = {
    Database, Cpu, Network, Lock, Unlock, Zap, Server,
    Code, Globe, Box, Layers, Shield, Activity,
    ArrowRightLeft, FileCode, Search, Settings,
    HardDrive, Layout, Share2, Terminal
};

export default function App() {
    const [step, setStep] = useState(0);
    const { topLabel, mainTitle, badge, differences } = topicData;

    const leftColor = topicData.leftColor || '#00d2ff';
    const rightColor = topicData.rightColor || '#ff5c00';

    const safeDifferences = (differences && differences.length > 0) ? differences : [
        {
            title: "1. ARCHITECTURE",
            leftTitle: "Client-Server",
            rightTitle: "Embedded",
            leftDesc: "Runs as a dedicated service managing multi-client networks.",
            rightDesc: "Embedded in-process library without separate background services.",
            leftIcon: "Server",
            rightIcon: "Box",
            leftVisualText: "Server Node",
            rightVisualText: "In-App File"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % safeDifferences.length);
        }, 3000); 
        return () => clearInterval(interval);
    }, [safeDifferences.length]);

    const currentDiff = safeDifferences[step] || safeDifferences[0];

    return (
        <div className="app-wrapper">
            {/* Ambient dynamic background lighting */}
            <div 
                className="bg-ambient-orb left" 
                style={{ backgroundColor: leftColor }} 
            />
            <div 
                className="bg-ambient-orb right" 
                style={{ backgroundColor: rightColor }} 
            />
            <div className="bg-grid-overlay" />

            {/* TOP HEADER */}
            <header className="top-header">
                <p className="top-label">{topLabel || 'TECH SHOWDOWN'}</p>
                <div className="main-title">
                    <span 
                        className="text-left-topic" 
                        style={{ 
                            color: leftColor,
                            textShadow: `0 0 35px ${leftColor}66`
                        }}
                    >
                        {mainTitle.left}
                    </span>
                    <span className="text-vs">{mainTitle.vs || 'VS'}</span>
                    <span 
                        className="text-right-topic" 
                        style={{ 
                            color: rightColor,
                            textShadow: `0 0 35px ${rightColor}66`
                        }}
                    >
                        {mainTitle.right}
                    </span>
                </div>
                <div className="differences-badge">
                    <span>⚡ {badge || 'THE 7 CORE DIFFERENCES'}</span>
                </div>
            </header>

            {/* TIMELINE */}
            <div className="timeline">
                <div className="timeline-track"></div>
                {safeDifferences.map((_, i) => (
                    <div 
                        key={i} 
                        className={`timeline-step ${i === step ? 'current' : (i < step ? 'active' : '')}`}
                        style={{
                            borderColor: i === step ? '#ffffff' : (i < step ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)'),
                            color: i === step ? '#000000' : (i < step ? '#ffffff' : '#666666'),
                            background: i === step ? '#ffffff' : (i < step ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,10,0.6)')
                        }}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* DIFFERENCE CATEGORY PILL */}
            {currentDiff.title && (
                <div className="diff-category-container">
                    <div className="diff-category-pill">
                        <span className="diff-category-num">#{step + 1}</span>
                        <span className="diff-category-text">{currentDiff.title.replace(/^\d+[\.\s\-:]*/, '').trim()}</span>
                    </div>
                </div>
            )}

            {/* MAIN COMPARISON */}
            <main className="cards-grid">
                {/* LEFT CARD */}
                <div className="card-column">
                    <div className="card-title-group">
                        <h2 className="card-hero-title" style={{ color: leftColor }}>
                            {mainTitle.left}
                        </h2>
                        <p className="card-sub">{topicData.leftSub || 'Standard'}</p>
                    </div>

                    <div 
                        className="comparison-card" 
                        style={{ 
                            borderColor: `${leftColor}44`,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 45px ${leftColor}18`
                        }}
                    >
                        {/* Upper Section: Icon & Visual Tag */}
                        <div className="viz-content">
                            <AnimatePresence mode="wait">
                                <GenericVisual 
                                    key={`left-${step}`} 
                                    side="left" 
                                    step={step} 
                                    data={currentDiff} 
                                    color={leftColor} 
                                />
                            </AnimatePresence>
                        </div>

                        {/* Lower Section: Informative Educational Footer */}
                        <div className="explanation-footer" style={{ borderTopColor: `${leftColor}33` }}>
                            <div className="exp-badge" style={{ color: leftColor, borderColor: `${leftColor}55`, background: `${leftColor}15` }}>
                                {currentDiff.leftVisualText || 'KEY MECHANISM'}
                            </div>
                            <h3 className="exp-title" style={{ color: leftColor }}>
                                {currentDiff.leftTitle}
                            </h3>
                            <p className="exp-desc">
                                {currentDiff.leftDesc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="card-column">
                    <div className="card-title-group">
                        <h2 className="card-hero-title" style={{ color: rightColor }}>
                            {mainTitle.right}
                        </h2>
                        <p className="card-sub">{topicData.rightSub || 'Modern'}</p>
                    </div>

                    <div 
                        className="comparison-card" 
                        style={{ 
                            borderColor: `${rightColor}44`,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 45px ${rightColor}18`
                        }}
                    >
                        {/* Upper Section: Icon & Visual Tag */}
                        <div className="viz-content">
                            <AnimatePresence mode="wait">
                                <GenericVisual 
                                    key={`right-${step}`} 
                                    side="right" 
                                    step={step} 
                                    data={currentDiff} 
                                    color={rightColor} 
                                />
                            </AnimatePresence>
                        </div>

                        {/* Lower Section: Informative Educational Footer */}
                        <div className="explanation-footer" style={{ borderTopColor: `${rightColor}33` }}>
                            <div className="exp-badge" style={{ color: rightColor, borderColor: `${rightColor}55`, background: `${rightColor}15` }}>
                                {currentDiff.rightVisualText || 'KEY MECHANISM'}
                            </div>
                            <h3 className="exp-title" style={{ color: rightColor }}>
                                {currentDiff.rightTitle}
                            </h3>
                            <p className="exp-desc">
                                {currentDiff.rightDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER WATERMARK */}
            <footer className="footer-watermark">
                @this.girl.tech • visualized by kreggscode
            </footer>
        </div>
    );
}

interface GenericVisualProps {
    side: 'left' | 'right';
    step: number;
    data: any;
    color: string;
}

const GenericVisual: React.FC<GenericVisualProps> = ({ side, data, color }) => {
    const iconName = side === 'left' ? data.leftIcon : data.rightIcon;
    const Icon = IconMap[iconName] || (side === 'left' ? Database : Server);
    const badgeText = side === 'left' ? data.leftVisualText : data.rightVisualText;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.85 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.85 }} 
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                gap: '18px'
            }}
        >
            <div 
                className="icon-glow-box"
                style={{ 
                    padding: '38px', 
                    borderRadius: '34px', 
                    background: `radial-gradient(circle, ${color}35 0%, rgba(10, 14, 24, 0.95) 80%)`, 
                    border: `2px solid ${color}77`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 50px ${color}40, inset 0 0 30px ${color}28`
                }}
            >
                <Icon size={136} color={color} strokeWidth={1.85} />
            </div>

            {badgeText && (
                <motion.div 
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="visual-badge"
                    style={{ 
                        fontSize: '25px', 
                        fontFamily: 'var(--font-mono)', 
                        color: '#ffffff',
                        background: `${color}25`,
                        padding: '12px 28px',
                        borderRadius: '14px',
                        border: `2px solid ${color}77`,
                        boxShadow: `0 8px 24px ${color}35`,
                        fontWeight: 800,
                        letterSpacing: '1.2px'
                    }}
                >
                    {badgeText}
                </motion.div>
            )}
        </motion.div>
    );
};

