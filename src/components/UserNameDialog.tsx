"use client";

import { useState, useRef } from "react";
import styles from "./UserNameDialog.module.css";

const COLORS = [
  "#D583F0",
  "#F08385",
  "#F0D885",
  "#85EED6",
  "#85BBF0",
  "#8594F0",
  "#85DBF0",
  "#87EE85",
];

type UserNameDialogProps = {
  onSubmit: (name: string, color: string) => void;
};

export function UserNameDialog({ onSubmit }: UserNameDialogProps) {
  const [name, setName] = useState("");
  const randomColor = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), randomColor.current);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>Welcome!</h2>
        <p className={styles.subtitle}>Enter your name to join the room</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={30}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!name.trim()}
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
