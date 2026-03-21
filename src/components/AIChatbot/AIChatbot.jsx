import React, { useState, useRef, useEffect } from 'react';
import AiOrb from './AiOrb';
import { sendToGemini } from './useGemini';
import styles from './AIChatbot.module.css';

const SUGGESTIONS = [
    'How do I prevent SQL injection?',
    'Explain SOLID principles briefly',
    'Best practices for error handling in Java',
];

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const sendMessage = async (text) => {
        const userMsg = text || input.trim();
        if (!userMsg) return;

        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);

        try {
            const reply = await sendToGemini(newMessages);
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ Sorry, I encountered an error: ${err.message}`
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMessage = (text) => {
        // Simple markdown-like formatting
        return text
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className={styles.container}>
            {isOpen && (
                <div className={styles.chatPanel}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.chatTitle}>
                            ◆ CREV AI
                            <span className={styles.statusPill}>Online</span>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    {/* Messages */}
                    <div className={styles.messages}>
                        {messages.length === 0 && (
                            <>
                                <div className={styles.welcomeMessage}>
                                    <h3>Hey there 👋</h3>
                                    <p>I'm CREV AI — your code review companion. Ask me anything about code quality, security, or best practices.</p>
                                </div>
                                <div className={styles.suggestions}>
                                    {SUGGESTIONS.map((s, i) => (
                                        <button
                                            key={i}
                                            className={styles.suggestionBtn}
                                            onClick={() => sendMessage(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`${styles.message} ${styles[msg.role]}`}
                                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                            />
                        ))}

                        {isThinking && (
                            <div className={styles.thinkingDots}>
                                <span /><span /><span />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={styles.inputArea}>
                        <input
                            className={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about code quality, patterns..."
                            disabled={isThinking}
                        />
                        <button
                            className={styles.sendBtn}
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isThinking}
                        >
                            ↑
                        </button>
                    </div>
                </div>
            )}

            {/* 3D Orb Trigger */}
            <div className={styles.fabTrigger} onClick={() => setIsOpen(!isOpen)}>
                <AiOrb isThinking={isThinking} />
            </div>
        </div>
    );
}
