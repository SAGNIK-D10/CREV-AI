import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import styles from './TopBar.module.css';

export default function TopBar({ isLoading, onRunReview, language, setLanguage, detectedLanguage }) {
    const [isPressed, setIsPressed] = useState(false);

    const handleRunClick = () => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 100);
        if (!isLoading && onRunReview) {
            onRunReview();
        }
    };

    return (
        <div className={styles.topBar}>
            <div className={styles.breadcrumb}>
                <span>Review</span>
                <span className={styles.separator}>/</span>
                <span className={styles.current}>New</span>
            </div>

            <div className={styles.centerSection}>
                <LanguageSelector
                    language={language}
                    setLanguage={setLanguage}
                    detectedLanguage={detectedLanguage}
                />
            </div>

            <div className={styles.actionSection}>
                <span className={styles.shortcut}>⌘↵</span>
                <button
                    className={`${styles.runButton} ${isPressed ? styles.pressed : ''}`}
                    onClick={handleRunClick}
                    disabled={isLoading}
                >
                    {isLoading ? 'Analyzing...' : 'Run Review'}
                </button>
            </div>
        </div>
    );
}
