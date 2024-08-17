'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import WebApp from '@twa-dev/sdk';
import styles from './index.module.css';

const options = [
  {
    text: "Join ZobelTech",
    points: 1000,
    icon: "/assets/icons/youtube.png",
    link: "https://www.youtube.com/join",
  },
  {
    text: "Watch Zobel's Video",
    points: 1000,
    icon: "/assets/icons/youtube.png",
    link: "https://www.youtube.com/watch",
  },
  {
    text: "Join our TG channel",
    points: 5000,
    icon: "/assets/icons/telegram.png",
    link: "https://t.me/+r2fXaKYAYz8wYWU0",
  },
  {
    text: "Follow our X account",
    points: 5000,
    icon: "/assets/icons/twitter.png",
    link: "https://www.twitter.com/follow",
  },
];

const EarnPage = () => {
  const [userId, setUserId] = useState(null);
  const [completedActions, setCompletedActions] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      setUserId(WebApp.initDataUnsafe.user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchCompletedActions = async () => {
        try {
          const response = await fetch(`/api/user/actions?userId=${userId}`);
          const data = await response.json();

          if (response.ok) {
            const actionStatus = {};
            options.forEach((option) => {
              actionStatus[option.text] = data.completedActions.includes(option.text);
            });
            setCompletedActions(actionStatus);
          } else {
            console.error('Failed to fetch completed actions:', data.message);
          }
        } catch (error) {
          console.error('Error fetching completed actions:', error);
        }
      };

      fetchCompletedActions();
    }
  }, [userId]);

  const handleJoinClick = async (event, link, text, points) => {
    event.preventDefault();

    if (completedActions[text]) {
      window.open(link, '_blank');
      return;
    }

    window.open(link, '_blank');

    if (userId) {
      try {
        const response = await fetch('/api/user/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, action: text, points }),
        });

        if (response.ok) {
          setCompletedActions((prev) => ({ ...prev, [text]: true }));
        } else {
          const data = await response.json();
          console.error('Failed to save action:', data.message);
        }
      } catch (error) {
        console.error('Error saving action:', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.earnOptions}>
        {options.map((option, index) => (
          <div key={index} className={styles.option}>
            <Image className={styles.image} src={option.icon} alt={option.text} width={60} height={60} />
            <div className={styles.text}>
              <p>{option.text}</p>
              <span>{`+${option.points}`}</span>
            </div>
            <div className={styles.button}>
              <button
                id={option.text}
                className={`${styles.joinButton} ${completedActions[option.text] ? styles.checkButton : ''}`}
                onClick={(e) => handleJoinClick(e, option.link, option.text, option.points)}
              >
                {completedActions[option.text] ? 'Check' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarnPage;
