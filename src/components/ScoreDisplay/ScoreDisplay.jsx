import React, { useEffect, useState } from 'react';
import styles from './ScoreDisplay.module.css';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function ScoreDisplay({ score, issues }) {
    const [displayScore, setDisplayScore] = useState(0);
    const [fillWidth, setFillWidth] = useState(0);

    useEffect(() => {
        let startTime;
        const duration = 800; // ms

        // For animating the number
        const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setDisplayScore(Math.floor(score * easeOutExpo(progress)));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayScore(score);
            }
        };

        requestAnimationFrame(animate);

        // Animate the bar 
        setTimeout(() => {
            setFillWidth(score);
        }, 50);
    }, [score]);

    const criticals = issues.filter(i => i.severity === 'critical').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    const infos = issues.filter(i => i.severity === 'info').length;

    let colorClass = styles.red;
    if (score >= 80) colorClass = styles.green;
    else if (score >= 60) colorClass = styles.accent;

    return (
        <div className={styles.container}>
            <div className={styles.scoreHeader}>
                <span className={styles.scoreLarge}>{displayScore}</span>
                <span className={styles.scoreMax}>/100</span>
            </div>

            <div className={styles.barTrack}>
                <div
                    className={`${styles.barFill} ${colorClass}`}
                    style={{ width: `${fillWidth}%` }}
                ></div>
            </div>

            <div className={styles.pillsRow}>
                <div className={`${styles.pill} ${styles.pillCritical}`}>
                    {criticals} Critical
                </div>
                <div className={`${styles.pill} ${styles.pillWarning}`}>
                    {warnings} Warning{warnings !== 1 ? 's' : ''}
                </div>
                <div className={`${styles.pill} ${styles.pillInfo}`}>
                    {infos} Info
                </div>
            </div>
        </div>
    );
}
