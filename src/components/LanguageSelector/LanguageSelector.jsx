import React, { useState, useRef, useEffect } from 'react';
import styles from './LanguageSelector.module.css';

export const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', color: '#F7DF1E' },
    { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
    { id: 'python', name: 'Python', color: '#3DDC84' },
    { id: 'java', name: 'Java', color: '#FF9040' },
    { id: 'go', name: 'Go', color: '#00ADD8' },
    { id: 'rust', name: 'Rust', color: '#E8C547' },
    { id: 'cpp', name: 'C++', color: '#A97EFC' },
    { id: 'php', name: 'PHP', color: '#8892BF' }
];

export default function LanguageSelector({ language = 'javascript', setLanguage, detectedLanguage }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selected = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.dot} style={{ backgroundColor: selected.color }}></span>
                <span className={styles.label}>{selected.name}</span>
                <span className={styles.chevron}>▾</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.id}
                            className={`${styles.item} ${lang.id === language ? styles.active : ''}`}
                            onClick={() => {
                                setLanguage(lang.id);
                                setIsOpen(false);
                            }}
                        >
                            <div className={styles.itemLeft}>
                                <span className={styles.dot} style={{ backgroundColor: lang.color }}></span>
                                <span>{lang.name}</span>
                            </div>
                            {lang.id === detectedLanguage && (
                                <span className={styles.detectedBadge}>Detected</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
