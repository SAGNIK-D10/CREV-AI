export const crevDarkTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '3D3D4A' },
        { token: 'keyword', foreground: 'E8C547' },
        { token: 'string', foreground: '3DDC84' },
        { token: 'number', foreground: 'FF9040' },
        { token: 'identifier.function', foreground: 'A8C4FF' },
        { token: 'type.identifier', foreground: 'A8C4FF' },
    ],
    colors: {
        'editor.background': '#0D0D0F',
        'editor.foreground': '#EEEEF0',
        'editor.lineHighlightBackground': '#131316',
        'editor.selectionBackground': '#2A2A32',
        'editorCursor.foreground': '#E8C547',
        'editorLineNumber.foreground': '#3D3D4A',
        'editorLineNumber.activeForeground': '#EEEEF0',
        'editor.inactiveSelectionBackground': '#2A2A3280'
    }
};

export const crevLightTheme = {
    base: 'vs',
    inherit: true,
    rules: [
        { token: 'comment', foreground: 'A1A1A6' },
        { token: 'keyword', foreground: 'D97706' },
        { token: 'string', foreground: '34C759' },
        { token: 'number', foreground: 'FF9500' },
        { token: 'identifier.function', foreground: '0066CC' },
        { token: 'type.identifier', foreground: '0066CC' },
    ],
    colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#1D1D1F',
        'editor.lineHighlightBackground': '#FAFAFA',
        'editor.selectionBackground': '#EBEBEF',
        'editorCursor.foreground': '#D97706',
        'editorLineNumber.foreground': '#A1A1A6',
        'editorLineNumber.activeForeground': '#1D1D1F',
        'editor.inactiveSelectionBackground': '#EBEBEF80'
    }
};
