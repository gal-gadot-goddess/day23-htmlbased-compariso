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
        }, 2500); 
        return () => clearInterval(interval);
    }, [safeDifferences.length]);

    const currentDiff = safeDifferences[step] || safeDifferences[0];

    // Clean category title if it has numbers
    const cleanCategoryTitle = (currentDiff.title || `DIFFERENCE #${step + 1}`)
        .replace(/^\d+[\.\s\-:]*/, '')
        .trim();

    const progressPercentage = ((step + 1) / safeDifferences.length) * 100;

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

            {/* HEADER */}
            <header className="top-header">
                <div className="top-tag-container">
                    <div className="top-label-pill">
                        <span className="pulse-dot" />
                        <span>{topLabel || 'TECH SHOWDOWN'}</span>
                    </div>
                </div>

                <div className="main-title-container">
                    <span 
                        className="title-tech" 
                        style={{ 
                            color: leftColor, 
                            filter: `drop-shadow(0 0 25px ${leftColor}55)` 
                        }}
                    >
                        {mainTitle.left}
                    </span>
                    <span className="vs-badge">VS</span>
                    <span 
                        className="title-tech" 
                        style={{ 
                            color: rightColor,
                            filter: `drop-shadow(0 0 25px ${rightColor}55)` 
                        }}
                    >
                        {mainTitle.right}
                    </span>
                </div>

                <div className="badge-row">
                    <div className="differences-badge">
                        <span>⚡ {badge || 'THE 7 CORE DIFFERENCES'}</span>
                    </div>
                </div>
            </header>

            {/* TIMELINE PROGRESS */}
            <section className="timeline-section">
                <div className="timeline-header">
                    <span>PROGRESS</span>
                    <span>{step + 1} OF {safeDifferences.length}</span>
                </div>
                <div className="timeline-progress-rail">
                    <div 
                        className="timeline-progress-fill" 
                        style={{ width: `${progressPercentage}%` }} 
                    />
                </div>
                <div className="timeline-steps">
                    {safeDifferences.map((_, i) => (
                        <div 
                            key={i} 
                            className={`timeline-step ${i === step ? 'current' : (i < step ? 'active' : '')}`}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORY BANNER */}
            <div className="category-banner">
                <div className="category-banner-inner">
                    <span className="category-index">#{step + 1}</span>
                    <span className="category-title">{cleanCategoryTitle}</span>
                </div>
            </div>

            {/* COMPARISON CARDS */}
            <main className="cards-grid">
                {/* LEFT CARD */}
                <div className="card-column">
                    <div className="card-header-group">
                        <h2 className="card-hero-name" style={{ color: leftColor }}>
                            {mainTitle.left}
                        </h2>
                        <p className="card-hero-tagline">{topicData.leftSub || 'First Paradigm'}</p>
                    </div>

                    <div 
                        className="card-glass" 
                        style={{ 
                            borderColor: `${leftColor}44`,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${leftColor}15`
                        }}
                    >
                        <div className="card-visual-zone">
                            <AnimatePresence mode="wait">
                                <ModernVisual
                                    key={`left-${step}`}
                                    side="left"
                                    data={currentDiff}
                                    color={leftColor}
                                />
                            </AnimatePresence>
                        </div>
                        <div className="card-explanation-box">
                            <h3 className="point-title" style={{ color: leftColor }}>
                                {currentDiff.leftTitle}
                            </h3>
                            <p className="point-description">
                                {currentDiff.leftDesc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="card-column">
                    <div className="card-header-group">
                        <h2 className="card-hero-name" style={{ color: rightColor }}>
                            {mainTitle.right}
                        </h2>
                        <p className="card-hero-tagline">{topicData.rightSub || 'Second Paradigm'}</p>
                    </div>

                    <div 
                        className="card-glass" 
                        style={{ 
                            borderColor: `${rightColor}44`,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${rightColor}15`
                        }}
                    >
                        <div className="card-visual-zone">
                            <AnimatePresence mode="wait">
                                <ModernVisual
                                    key={`right-${step}`}
                                    side="right"
                                    data={currentDiff}
                                    color={rightColor}
                                />
                            </AnimatePresence>
                        </div>
                        <div className="card-explanation-box">
                            <h3 className="point-title" style={{ color: rightColor }}>
                                {currentDiff.rightTitle}
                            </h3>
                            <p className="point-description">
                                {currentDiff.rightDesc}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* WATERMARK */}
            <footer className="bottom-footer-bar">
                <span>⚡ @this.girl.tech</span>
                <span>•</span>
                <span className="brand-accent">ARCHITECTURE SHOWDOWN</span>
                <span>•</span>
                <span>VISUALIZED BY KREGGSCODE</span>
            </footer>
        </div>
    );
}

interface ModernVisualProps {
    side: 'left' | 'right';
    data: any;
    color: string;
}

const ModernVisual: React.FC<ModernVisualProps> = ({ side, data, color }) => {
    const iconName = side === 'left' ? data.leftIcon : data.rightIcon;
    const IconComponent = IconMap[iconName] || (side === 'left' ? Database : Server);
    const badgeText = side === 'left' ? data.leftVisualText : data.rightVisualText;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.85, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.85, y: -15 }} 
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                gap: '24px'
            }}
        >
            <div 
                className="icon-glow-frame"
                style={{ 
                    background: `radial-gradient(circle, ${color}28 0%, ${color}08 70%)`,
                    border: `2px solid ${color}55`,
                    boxShadow: `0 0 50px ${color}33, inset 0 0 30px ${color}22`
                }}
            >
                <div 
                    className="icon-ring-pulse"
                    style={{ borderColor: `${color}66` }}
                />
                <IconComponent size={100} color={color} strokeWidth={1.8} />
            </div>

            {badgeText && (
                <motion.div 
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="badge-tag-pill"
                    style={{ 
                        color: color,
                        borderColor: `${color}55`,
                        boxShadow: `0 8px 25px ${color}22`
                    }}
                >
                    {badgeText}
                </motion.div>
            )}
        </motion.div>
    );
};
