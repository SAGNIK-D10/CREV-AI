import React from 'react';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import IssueCard from '../IssueCard/IssueCard';
import styles from './ReviewPanel.module.css';

export default function ReviewPanel({ isLoading, hasRun, results, setHighlightedLine }) {
    if (!hasRun && !isLoading && !results) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyArrow}>→</div>
                <div className={styles.emptyText}>Run a review to see results</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.shimmerContainer}>
                    <div className={styles.shimmerBar} style={{ width: '180px' }}></div>
                    <div className={styles.shimmerBar} style={{ width: '240px' }}></div>
                    <div className={styles.shimmerBar} style={{ width: '140px' }}></div>
                </div>
                <div className={styles.loadingText}>Analyzing with Claude...</div>
            </div>
        );
    }

    if (results) {
        return (
            <div className={styles.resultsContainer}>
                <div className={styles.resultsInner}>
                    <ScoreDisplay score={results.score} issues={results.issues} />
                    <hr className={styles.divider} />
                    <div className={styles.issuesList}>
                        {results.issues.map((issue, i) => (
                            <IssueCard
                                key={i}
                                issue={issue}
                                index={i}
                                onHoverLine={setHighlightedLine}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
