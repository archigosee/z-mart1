'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import WebApp from '@twa-dev/sdk';
import { FaInstagram, FaTelegramPlane, FaFacebook } from 'react-icons/fa'; // Import social media icons
import styles from './index.module.css';

// Modal Component
const Modal = ({ option, isOpen, onClose, handleJoinClick, completedActions, tgMembership, inviteLink }) => {
  if (!isOpen) return null;

  // Social media share URLs
  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(inviteLink)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=Join%20now!`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>{option.text}</h2>
        <p>Earn {option.points} points by completing this action.</p>
        <Image className={styles.image} src={option.icon} alt={option.text} width={60} height={60} />

        {/* Conditional rendering for "Invite Your Friend" */}
        {option.text === 'Invite Your Friend' ? (
          <div>
            <p>{inviteLink}</p>
            <button className={styles.copyButton} onClick={() => navigator.clipboard.writeText(inviteLink)}>
              Copy Link
            </button>

            {/* Social Media Sharing Icons */}
            <div className={styles.socialIcons}>
              <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} className={styles.icon} />
              </a>
              <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer">
                <FaTelegramPlane size={30} className={styles.icon} />
              </a>
              <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} className={styles.icon} />
              </a>
            </div>
          </div>
        ) : (
          <button
            id={option.text}
            className={`${styles.joinButton} ${
              (option.requiresCheck && tgMembership) || completedActions[option.text] ? styles.checkButton : ''
            }`}
            onClick={(e) => handleJoinClick(e, option)}
          >
            {(option.requiresCheck && tgMembership) || completedActions[option.text] ? 'Check' : 'Join'}
          </button>
        )}
      </div>
    </div>
  );
};

const EarnPage = () => {
  const [userId, setUserId] = useState(null);
  const [options, setOptions] = useState([]); // State to hold the fetched options
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [completedActions, setCompletedActions] = useState({});
  const [tgMembership, setTgMembership] = useState(false);
  const [isMemberChecked, setIsMemberChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected card
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [inviteLink, setInviteLink] = useState(''); // State to hold the invite link

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      setUserId(WebApp.initDataUnsafe.user.id);

      // Generate and store the invite link when userId is available
      const generateInviteLink = async () => {
        try {
          const response = await fetch(`/api/invite`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();
          if (data.success) {
            setInviteLink(data.inviteLink);
          } else {
            console.error('Failed to generate invite link:', data.message);
          }
        } catch (error) {
          console.error('Error generating invite link:', error);
        }
      };

      generateInviteLink();
    }
  }, [userId]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/earnOptions'); // Fetch options from your API
        const data = await response.json();
        if (response.ok) {
          setOptions(data.data); // Set the fetched options
        } else {
          console.error('Failed to fetch options:', data.message);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchOptions();
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
              if (option.requiresCheck && !tgMembership) {
                actionStatus[option.text] = data.completedActions.includes(option.text);
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
  }, [isMemberChecked, tgMembership, userId, options]);

  const handleInviteClick = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setInviteLink(data.inviteLink); // Set the invite link
        window.open(data.inviteLink, '_blank'); // Open the invite link in a new tab
      }
    } catch (error) {
      console.error('Error generating invite link:', error);
    }
  };

  const handleJoinClick = async (event, option) => {
    event.preventDefault();

    if (option.text === "Invite Your Friend") {
      handleInviteClick(); // Handle invite logic
    } else {
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

  if (loading) {
    return <div>Loading...</div>; // Add a loading state
  }

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

      {/* Modal */}
      {selectedOption && (
        <Modal
          option={selectedOption}
          isOpen={isModalOpen}
          onClose={closeModal}
          handleJoinClick={handleJoinClick}
          completedActions={completedActions}
          tgMembership={tgMembership}
          inviteLink={inviteLink}
        />
      )}
    </div>
  );
};

export default EarnPage;
