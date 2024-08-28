'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import WebApp from '@twa-dev/sdk';
import styles from './index.module.css';

// Modal Component
const Modal = ({ option, isOpen, onClose, handleJoinClick, completedActions, tgMembership }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>{option.text}</h2>
        <p>Earn {option.points} points by completing this action.</p>
        <Image className={styles.image} src={option.icon} alt={option.text} width={60} height={60} />
        <button
          id={option.text}
          className={`${styles.joinButton} ${
            (option.requiresCheck && tgMembership) || completedActions[option.text] ? styles.checkButton : ''
          }`}
          onClick={(e) => handleJoinClick(e, option)}
        >
          {(option.requiresCheck && tgMembership) || completedActions[option.text] ? 'Check' : 'Join'}
        </button>
      </div>
    </div>
  );
};

const options = [
  {
    text: "Join ZobelTech",
    points: 1000,
    icon: "/assets/icons/youtube.png",
    link: "https://www.youtube.com/@JuniorScienceSquad?sub_confirmation=1",
  },
  {
    text: "Watch Zobel's Video",
    points: 1000,
    icon: "/assets/icons/youtube.png",
    link: "https://www.youtube.com/shorts/DDGI6Hzn7P4?sub_confirmation=1",
  },
  {
    text: "Join our TG channel",
    points: 5000,
    icon: "/assets/icons/telegram.png",
    link: "https://t.me/dz_ech",
    requiresCheck: true, // Indicates this option needs Telegram membership check
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
  const [tgMembership, setTgMembership] = useState(false);
  const [isMemberChecked, setIsMemberChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected card
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      setUserId(WebApp.initDataUnsafe.user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const checkTelegramMembership = async () => {
        try {
          const response = await fetch(`/api/checkMembership?userId=${userId}`);
          const data = await response.json();

          const isMember =
            data.result.status === 'member' ||
            data.result.status === 'administrator' ||
            data.result.status === 'creator';

          if (isMember) {
            setCompletedActions((prev) => ({ ...prev, "Join our TG channel": true }));
          }

          setTgMembership(isMember);
          setIsMemberChecked(true);
        } catch (error) {
          console.error('Error checking Telegram membership:', error);
          setIsMemberChecked(true);
        }
      };

      checkTelegramMembership();
    }
  }, [userId]);

  useEffect(() => {
    if (isMemberChecked) {
      const fetchCompletedActions = async () => {
        try {
          const response = await fetch(`/api/user/actions?userId=${userId}`);
          const data = await response.json();

          if (response.ok) {
            const actionStatus = {};
            options.forEach((option) => {
              if (option.text === "Join our TG channel") {
                if (!tgMembership) {
                  actionStatus[option.text] = data.completedActions.includes(option.text);
                }
              } else {
                actionStatus[option.text] = data.completedActions.includes(option.text);
              }
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
  }, [isMemberChecked, tgMembership, userId]);

  const handleJoinClick = async (event, option) => {
    event.preventDefault();

    window.open(option.link, '_blank');

    if (userId) {
      try {
        const response = await fetch('/api/user/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, action: option.text, points: option.points }),
        });

        if (response.ok) {
          setCompletedActions((prev) => ({ ...prev, [option.text]: true }));
        } else {
          const data = await response.json();
          console.error('Failed to save action:', data.message);
        }
      } catch (error) {
        console.error('Error saving action:', error);
      }
    }
  };

  const handleCardClick = (option) => {
    setSelectedOption(option); // Set the selected card
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedOption(null); // Clear the selected option
  };

  return (
    <div className={styles.container}>
      <div className={styles.earnOptions}>
        {options.map((option, index) => (
          <div key={index} className={styles.option} onClick={() => handleCardClick(option)}>
            <Image className={styles.image} src={option.icon} alt={option.text} width={60} height={60} />
            <div className={styles.text}>
              <p>{option.text}</p>
              <span>{`+${option.points}`}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedOption && (
        <Modal
          option={selectedOption}
          isOpen={isModalOpen}
          onClose={closeModal}
          handleJoinClick={handleJoinClick}
          completedActions={completedActions}
          tgMembership={tgMembership}
        />
      )}
    </div>
  );
};

export default EarnPage;
