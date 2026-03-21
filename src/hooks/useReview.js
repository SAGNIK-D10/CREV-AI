import { useState } from 'react';

/* ── Smart mock analyzer ───────────────────────────────────── */

function analyzeCode(code, language) {
    const lines = code.split('\n');
    const issues = [];
    let deductions = 0;

    const checks = [
        {
            pattern: /["']\s*\+\s*\w+.*(?:SELECT|INSERT|UPDATE|DELETE|WHERE)/i,
            severity: 'critical', title: 'SQL injection vulnerability',
            desc: 'User input is concatenated directly into a query string without sanitization.',
            fix: 'Use parameterized queries or prepared statements instead of string concatenation.',
            cost: 18
        },
        {
            pattern: /password\s*=\s*["'][^"']+["']/i,
            severity: 'critical', title: 'Hardcoded credentials',
            desc: 'Passwords or secrets are stored as plaintext in source code.',
            fix: 'Move secrets to environment variables or a secure vault like AWS Secrets Manager.',
            cost: 15
        },
        {
            pattern: /(?:SELECT|DELETE|UPDATE)\s+\*\s+FROM/i,
            severity: 'warning', title: 'Unscoped wildcard query',
            desc: 'Using SELECT * fetches all columns, which can hurt performance.',
            fix: 'Specify only the columns you need: SELECT id, name FROM ...',
            cost: 6
        },
        {
            pattern: /catch\s*\([^)]*\)\s*\{[\s\n]*(?:\/\/.*)?[\s\n]*\}/,
            severity: 'warning', title: 'Empty catch block',
            desc: 'Exceptions are silently swallowed, hiding runtime errors.',
            fix: 'Log the exception or re-throw it: catch (Exception e) { log.error(e); throw e; }',
            cost: 8
        },
        {
            pattern: /catch\s*\(\s*Exception\s/,
            severity: 'info', title: 'Overly broad exception handling',
            desc: 'Catching generic Exception may mask specific errors.',
            fix: 'Catch specific exceptions such as SQLException, IOException, etc.',
            cost: 3
        },
        {
            pattern: /==\s*["']/,
            severity: 'warning', title: 'String comparison with ==',
            desc: 'Using == compares references, not values. This can cause unexpected bugs.',
            fix: 'Use .equals() for string comparison: str.equals("value")',
            cost: 7
        },
        {
            pattern: /new\s+ArrayList\(\)/,
            severity: 'info', title: 'Raw generic type',
            desc: 'ArrayList used without type parameter loses compile-time type safety.',
            fix: 'Use generics: new ArrayList<String>() or use List.of() for immutable lists.',
            cost: 3
        },
        {
            pattern: /System\.(out|err)\.print/,
            severity: 'info', title: 'Console logging in production code',
            desc: 'System.out/err is not appropriate for production — use a logging framework.',
            fix: 'Use SLF4J or java.util.logging: logger.info("message");',
            cost: 3
        },
        {
            pattern: /\.getConnection\s*\(/,
            severity: 'warning', title: 'Possible connection leak',
            desc: 'Database connection obtained but may not be properly closed.',
            fix: 'Use try-with-resources: try (Connection conn = ds.getConnection()) { ... }',
            cost: 7
        },
        {
            pattern: /(?:var|let|const)\s+\w+\s*=\s*document\.getElementById/,
            severity: 'info', title: 'Direct DOM manipulation',
            desc: 'Directly accessing the DOM is fragile and harder to test.',
            fix: 'Use a framework-level approach (refs in React, ViewChild in Angular).',
            cost: 3
        },
        {
            pattern: /eval\s*\(/,
            severity: 'critical', title: 'Use of eval()',
            desc: 'eval() executes arbitrary code and is a critical security risk.',
            fix: 'Replace eval() with JSON.parse() or a safe alternative.',
            cost: 20
        },
        {
            pattern: /TODO|FIXME|HACK|XXX/,
            severity: 'info', title: 'Unresolved TODO/FIXME comment',
            desc: 'Code contains unresolved developer notes that should be addressed.',
            fix: 'Resolve the TODO or create a tracking issue before shipping.',
            cost: 2
        },
        {
            pattern: /Thread\.sleep/,
            severity: 'warning', title: 'Thread.sleep in production code',
            desc: 'Blocking threads with sleep() can degrade application performance.',
            fix: 'Use ScheduledExecutorService or async patterns instead.',
            cost: 5
        },
        {
            pattern: /public\s+\w+\s+\w+\s*;/,
            severity: 'info', title: 'Public mutable field',
            desc: 'Public fields break encapsulation and make refactoring harder.',
            fix: 'Make fields private and provide getter/setter methods.',
            cost: 3
        }
    ];

    // Run every check against each line
    for (const check of checks) {
        for (let i = 0; i < lines.length; i++) {
            if (check.pattern.test(lines[i])) {
                issues.push({
                    line: i + 1,
                    severity: check.severity,
                    title: check.title,
                    description: check.desc,
                    suggestion: check.fix
                });
                deductions += check.cost;
                break; // one hit per rule
            }
        }
    }

    // Check the full code block too (multi-line patterns)
    if (/try\s*\{/.test(code) && /try-with-resources|try\s*\(/.test(code)) {
        // using try-with-resources is good — no penalty
    } else if (/try\s*\{/.test(code) && !/\.close\(\)/.test(code) && /Connection|Statement|ResultSet|InputStream|OutputStream/.test(code)) {
        if (!issues.find(i => i.title === 'Possible connection leak')) {
            issues.push({
                line: null, severity: 'warning',
                title: 'Resource not explicitly closed',
                description: 'Closeable resources should be closed in a finally block or try-with-resources.',
                suggestion: 'Wrap resource creation in try-with-resources to ensure automatic cleanup.'
            });
            deductions += 6;
        }
    }

    // Bonus points for good practices
    let bonuses = 0;
    if (/PreparedStatement/.test(code)) bonuses += 5;
    if (/try\s*\(/.test(code)) bonuses += 5;            // try-with-resources
    if (/Optional[<.]/.test(code)) bonuses += 3;
    if (/private\s+final\s/.test(code)) bonuses += 3;
    if (/Logger|log\./.test(code)) bonuses += 3;
    if (/@Override/.test(code)) bonuses += 2;

    const rawScore = 100 - deductions + bonuses;
    const score = Math.min(100, Math.max(0, rawScore));

    // If nothing was found, add a positive note
    if (issues.length === 0) {
        issues.push({
            line: null, severity: 'info',
            title: 'Clean code',
            description: 'No significant issues detected. Nice work!',
            suggestion: 'Consider adding unit tests to maintain this quality.'
        });
    }

    return { score, issues: issues.slice(0, 10) };
}

/* ── Hook ──────────────────────────────────────────────────── */

export default function useReview() {
    const [isLoading, setIsLoading] = useState(false);
    const [hasRun, setHasRun] = useState(false);
    const [results, setResults] = useState(null);
    const [toast, setToast] = useState(null);

    const runReview = async (code, language) => {
        setIsLoading(true);
        setHasRun(true);
        setResults(null);

        try {
            const response = await fetch('http://localhost:8080/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('crev_token') || ''}`
                },
                body: JSON.stringify({ code, language })
            });

            if (response.status === 401) {
                throw new Error('401');
            } else if (response.status === 429) {
                throw new Error('429');
            } else if (!response.ok) {
                throw new Error('network');
            }

            const data = await response.json();
            setResults(data);
            setIsLoading(false);
        } catch (error) {
            if (error.message === '401') {
                setToast({ message: 'Unauthorized. Please check your token.', type: 'error' });
                setIsLoading(false);
            } else if (error.message === '429') {
                setToast({ message: 'Rate limit reached. Try again in 30s.', type: 'warning' });
                setIsLoading(false);
            } else {
                // Backend not available — use smart local analyzer
                setTimeout(() => {
                    setResults(analyzeCode(code, language));
                    setIsLoading(false);
                }, 1800);
            }
        }
    };

    const closeToast = () => setToast(null);

    return {
        isLoading,
        hasRun,
        results,
        runReview,
        toast,
        closeToast
    };
}
