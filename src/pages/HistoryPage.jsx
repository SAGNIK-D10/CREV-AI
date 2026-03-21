import React, { useState } from 'react';
import HistoryList from '../components/HistoryList/HistoryList';
import ReviewPanel from '../components/ReviewPanel/ReviewPanel';

const MOCK_HISTORY = [
    {
        id: 1,
        language: 'javascript',
        filename: 'AuthMiddleware.js',
        codeSnippet: 'function verifyToken(req, res, next) { ...',
        score: 82,
        issuesCount: 3,
        timeAgo: '2 hours ago',
        results: {
            score: 82,
            issues: [
                { line: 12, severity: 'warning', title: 'Missing return type', description: 'Consider adding JSDoc or migrating to TS' },
                { line: 18, severity: 'info', title: 'Console log left in production', description: 'Remove console.log before committing' }
            ]
        }
    },
    {
        id: 2,
        language: 'python',
        filename: 'data_processor.py',
        codeSnippet: 'def process_data(df):',
        score: 45,
        issuesCount: 8,
        timeAgo: '1 day ago',
        results: {
            score: 45,
            issues: [
                { line: 5, severity: 'critical', title: 'Hardcoded credentials', description: 'Never hardcode secrets in source code.' }
            ]
        }
    }
];

export default function HistoryPage() {
    const [selectedId, setSelectedId] = useState(MOCK_HISTORY[0]?.id);
    const selectedRecord = MOCK_HISTORY.find(r => r.id === selectedId);

    return (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '320px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '18px', color: 'var(--text-primary)', margin: 0 }}>Review History</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <HistoryList
                        items={MOCK_HISTORY}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                </div>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-base)' }}>
                {selectedRecord ? (
                    <ReviewPanel
                        hasRun={true}
                        isLoading={false}
                        results={selectedRecord.results}
                        setHighlightedLine={() => { }}
                    />
                ) : (
                    <div style={{ padding: 40, color: 'var(--text-muted)' }}>Select a review to see details.</div>
                )}
            </div>
        </div>
    );
}
