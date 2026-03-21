import { useEffect } from 'react';

export default function useAutoDetect(code, onDetected) {
    useEffect(() => {
        if (!code || code.trim() === '') {
            onDetected(null);
            return;
        }

        const detect = () => {
            if (/def\s+\w+/.test(code)) return 'python';
            if (/func\s+\w+/.test(code) || /package\s+main/.test(code)) return 'go';
            if (/fn\s+\w+/.test(code) || /let\s+mut/.test(code)) return 'rust';
            if (/<\?php/.test(code) || (/\$[\w]+\s*=/.test(code) && /echo|print/.test(code))) return 'php';
            if (/(public|private|protected)\s+class/.test(code) && /System\.out\.print/.test(code)) return 'java';
            if (/#include\s*</.test(code) || /std::/.test(code)) return 'cpp';
            if (/interface\s+\w+/.test(code) || /type\s+\w+\s*=/.test(code) || /:\s*(string|number|boolean|any)/.test(code)) return 'typescript';
            if (/const\s+\w+\s*=/.test(code) || /=>/.test(code) || /function\s+\w+/.test(code) || /console\.log/.test(code)) return 'javascript';
            return null;
        };

        const detected = detect();
        if (detected) {
            onDetected(detected);
        }
    }, [code, onDetected]);
}
