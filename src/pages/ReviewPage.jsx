import React, { useState } from 'react';
import TopBar from '../components/TopBar/TopBar';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import ReviewPanel from '../components/ReviewPanel/ReviewPanel';
import Toast from '../components/Toast/Toast';
import useAutoDetect from '../hooks/useAutoDetect';
import useReview from '../hooks/useReview';

const DEFAULT_CODE = `// Paste your code here and click Run Review
// Supports: JavaScript, Python, Java, TypeScript,
// Go, Rust, C++, and 30+ more languages`;

export default function ReviewPage() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [language, setLanguage] = useState('javascript');
    const [detectedLanguage, setDetectedLanguage] = useState(null);
    const [highlightedLine, setHighlightedLine] = useState(null);

    const { isLoading, hasRun, results, runReview, toast, closeToast } = useReview();

    useAutoDetect(code, (detected) => {
        setDetectedLanguage(detected);
    });

    const handleRunReview = () => {
        runReview(code, language);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TopBar
                language={language}
                setLanguage={setLanguage}
                isLoading={isLoading}
                onRunReview={handleRunReview}
                detectedLanguage={detectedLanguage}
            />
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: '0 0 55%', borderRight: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <CodeEditor
                        code={code}
                        setCode={setCode}
                        language={language}
                        highlightedLine={highlightedLine}
                    />
                </div>
                <div style={{ flex: '0 0 45%', overflow: 'hidden' }}>
                    <ReviewPanel
                        isLoading={isLoading}
                        hasRun={hasRun}
                        results={results}
                        setHighlightedLine={setHighlightedLine}
                    />
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    );
}
