import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'error', onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClosing(true);
            setTimeout(onClose, 150); // wait for fade out animation
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const typeClass = type === 'error' ? styles.toastError : styles.toastWarning;

    return (
        <div className={`${styles.toast} ${typeClass} ${isClosing ? styles.closing : ''}`}>
            <div className={styles.content}>{message}</div>
            <div className={styles.progressBar}></div>
        </div>
    );
}
