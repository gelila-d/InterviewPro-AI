import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeEditor = ({ code, setCode, language = 'javascript' }) => {
    const handleChange = (e) => {
        setCode(e.target.value);
    };

    return (
        <div className="relative font-mono text-sm leading-6 border border-gray-700 rounded-lg overflow-hidden bg-[#1d1f21] h-[500px] flex">
            {/* Editor Line Numbers & Text Area */}
            <textarea
                value={code}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white z-10 resize-none focus:outline-none"
                spellCheck="false"
            />
            {/* Syntax Highlighting Layer */}
            <div className="absolute inset-0 w-full h-full pointer-events-none p-4">
                <SyntaxHighlighter
                    language={language}
                    style={atomDark}
                    customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                    showLineNumbers={true}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeEditor;
