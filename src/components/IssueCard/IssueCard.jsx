import React, { useState, useEffect } from 'react';
import styles from './IssueCard.module.css';

export default function IssueCard({ issue, index, onHoverLine }) {
    const [suggestionOpen, setSuggestionOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Delay mount for staggered entrance animation
        const timer = setTimeout(() => {
            setMounted(true);
        }, index * 60 + 50);
        return () => clearTimeout(timer);
    }, [index]);

    const sevClass =
        issue.severity === 'critical' ? styles.sevCritical :
            issue.severity === 'warning' ? styles.sevWarning :
                styles.sevInfo;

    return (
        <div
            className={`${styles.card} ${mounted ? styles.mounted : ''}`}
            onMouseEnter={() => onHoverLine(issue.line)}
            onMouseLeave={() => onHoverLine(null)}
        >
            <div className={`${styles.indicator} ${sevClass}`}></div>

            <div className={styles.header}>
                <h3 className={styles.title}>{issue.title}</h3>
                <span className={styles.lineBadge} data-tooltip="Jump to line →">
                    Line {issue.line}
                </span>
            </div>

            <p className={styles.description}>{issue.description}</p>

            {issue.suggestion && (
                <div className={styles.suggestionSection}>
                    <button
                        className={styles.suggestionBtn}
                        onClick={() => setSuggestionOpen(!suggestionOpen)}
                    >
                        Fix suggestion {suggestionOpen ? '↑' : '↓'}
                    </button>

                    {suggestionOpen && (
                        <div className={styles.suggestionCode}>
                            {issue.suggestion}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
