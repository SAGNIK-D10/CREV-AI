import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { crevDarkTheme, crevLightTheme } from '../../utils/monacoTheme';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './CodeEditor.module.css';

const DEFAULT_CODE = `// Paste your code here and click Run Review
// Supports: JavaScript, Python, Java, TypeScript,
// Go, Rust, C++, and 30+ more languages`;

export default function CodeEditor({ code, setCode, language, highlightedLine }) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsCollectionRef = useRef(null);
    const { theme } = useTheme();

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('crev-dark', crevDarkTheme);
        monaco.editor.defineTheme('crev-light', crevLightTheme);
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        decorationsCollectionRef.current = editor.createDecorationsCollection();
    };

    useEffect(() => {
        if (editorRef.current && monacoRef.current && decorationsCollectionRef.current) {
            if (highlightedLine) {
                decorationsCollectionRef.current.set([{
                    range: new monacoRef.current.Range(highlightedLine, 1, highlightedLine, 1),
                    options: {
                        isWholeLine: true,
                        className: styles.highlightedLine
                    }
                }]);
            } else {
                decorationsCollectionRef.current.clear();
            }
        }
    }, [highlightedLine]);

    const lineCount = code ? code.split('\n').length : 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>INPUT</span>
                <div className={styles.headerRight}>
                    {lineCount > 0 && <span className={styles.lineCount}>{lineCount} lines</span>}
                    <button className={styles.clearBtn} onClick={() => setCode('')}>Clear</button>
                </div>
            </div>
            <div className={styles.editorWrapper}>
                <Editor
                    height="100%"
                    language={language}
                    theme={theme === 'light' ? 'crev-light' : 'crev-dark'}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                    options={{
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", monospace',
                        lineHeight: 22,
                        padding: { top: 20, bottom: 20 },
                        minimap: { enabled: false },
                        scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                        overviewRulerLanes: 0,
                        renderLineHighlight: 'line',
                        lineNumbers: 'on',
                        lineNumbersMinChars: 3,
                        glyphMargin: false,
                        folding: false,
                        renderIndentGuides: true,
                        wordWrap: 'on'
                    }}
                />
            </div>
        </div>
    );
}
