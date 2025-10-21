// components/LoginButton.tsx
'use client';
import React from 'react';
import styles from './LoginPopup.module.css';

interface Props {
  onOpen: () => void;
}

export default function LoginButton({ onOpen }: Props) {
  return (
    <div className={styles.loginButtonWrapper}>
      <button className={styles.loginTopBtn} onClick={onOpen}>
        Login
      </button>
    </div>
  );
}
