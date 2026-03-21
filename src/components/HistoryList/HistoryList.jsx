import React from 'react';
import styles from './HistoryList.module.css';
import { LANGUAGES } from '../LanguageSelector/LanguageSelector';

export default function HistoryList({ items, selectedId, onSelect }) {
    return (
        <div className={styles.list}>
            {items.map(item => {
                const langInfo = LANGUAGES.find(l => l.id === item.language) || LANGUAGES[0];
                const isActive = item.id === selectedId;

                let scoreClass = styles.scoreRed;
                if (item.score >= 80) scoreClass = styles.scoreGreen;
                else if (item.score >= 60) scoreClass = styles.scoreAccent;

                return (
                    <div
                        key={item.id}
                        className={`${styles.item} ${isActive ? styles.active : ''}`}
                        onClick={() => onSelect(item.id)}
                    >
                        <div className={styles.row1}>
                            <div className={styles.titleArea}>
                                <span className={styles.dot} style={{ backgroundColor: langInfo.color }}></span>
                                <span className={styles.filename} title={item.filename || item.codeSnippet}>
                                    {item.filename || item.codeSnippet}
                                </span>
                            </div>
                            <span className={`${styles.scoreBadge} ${scoreClass}`}>
                                {item.score}
                            </span>
                        </div>
                        <div className={styles.row2}>
                            {item.issuesCount} issue{item.issuesCount !== 1 ? 's' : ''} · {item.timeAgo}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
