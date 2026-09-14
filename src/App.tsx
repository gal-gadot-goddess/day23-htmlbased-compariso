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

    const leftColor = topicData.leftColor || '#38bdf8';
    const rightColor = topicData.rightColor || '#f43f5e';

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

    // Clean category title
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
                            filter: `drop-shadow(0 0 25px ${leftColor}77)` 
                        }}
                    >
                        {mainTitle.left}
                    </span>
                    <span className="vs-badge">VS</span>
                    <span 
                        className="title-tech" 
                        style={{ 
                            color: rightColor,
                            filter: `drop-shadow(0 0 25px ${rightColor}77)` 
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
                            borderColor: `${leftColor}55`,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 50px ${leftColor}22`
                        }}
                    >
                        {/* 1. TOP: Explanation Context & Key Points (Always Visible, Non-collapsing) */}
                        <div className="card-explanation-box">
                            <h3 className="point-title" style={{ color: leftColor }}>
                                {currentDiff.leftTitle}
                            </h3>
                            <p className="point-description">
                                {currentDiff.leftDesc}
                            </p>
                        </div>

                        {/* 2. CENTER / BOTTOM: Animated Visual & Badge */}
                        <div className="card-visual-zone">
                            <ModernVisual
                                key={`left-${step}`}
                                side="left"
                                data={currentDiff}
                                color={leftColor}
                            />
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
                            borderColor: `${rightColor}55`,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 50px ${rightColor}22`
                        }}
                    >
                        {/* 1. TOP: Explanation Context & Key Points (Always Visible, Non-collapsing) */}
                        <div className="card-explanation-box">
                            <h3 className="point-title" style={{ color: rightColor }}>
                                {currentDiff.rightTitle}
                            </h3>
                            <p className="point-description">
                                {currentDiff.rightDesc}
                            </p>
                        </div>

                        {/* 2. CENTER / BOTTOM: Animated Visual & Badge */}
                        <div className="card-visual-zone">
                            <ModernVisual
                                key={`right-${step}`}
                                side="right"
                                data={currentDiff}
                                color={rightColor}
                            />
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
            initial={{ opacity: 0, scale: 0.88 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                gap: '26px'
            }}
        >
            <div 
                className="icon-glow-frame"
                style={{ 
                    background: `radial-gradient(circle, ${color}35 0%, rgba(15, 23, 42, 0.95) 75%)`,
                    border: `2.5px solid ${color}`,
                    boxShadow: `0 0 60px ${color}55, inset 0 0 35px ${color}44`
                }}
            >
                <div 
                    className="icon-ring-pulse"
                    style={{ borderColor: color }}
                />
                <IconComponent size={120} color={color} strokeWidth={2.4} />
            </div>

            {badgeText && (
                <div 
                    className="badge-tag-pill"
                    style={{ 
                        color: '#ffffff',
                        background: `${color}25`,
                        borderColor: color,
                        boxShadow: `0 8px 30px ${color}44`
                    }}
                >
                    {badgeText}
                </div>
            )}
        </motion.div>
    );
};
