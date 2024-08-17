/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [points, setPoints] = useState(0);
  const [commission, setCommission] = useState(0); // State for commission

  useEffect(() => {
    // Fetch the user data from Telegram WebApp SDK
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      // Fetch the user's total points
      const fetchPoints = async () => {
        try {
          const response = await fetch(`/api/points?userId=${userData.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch points');
          }
          const data = await response.json();
          setPoints(data.points || 0);
        } catch (error) {
          console.error('Error fetching points:', error);
        }
      };

      // Fetch the user's total commission
      const fetchCommission = async () => {
        try {
          const response = await fetch(`/api/commission?userId=${userData.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch commission');
          }
          const data = await response.json();
          setCommission(data.commission || 0);
        } catch (error) {
          console.error('Error fetching commission:', error);
        }
      };

      fetchPoints();
      fetchCommission(); // Fetch the commission
    }
  }, [userData]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-5 h-screen overflow-auto">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>
      <div className="bg-white shadow-sm rounded p-4">
        <div className="flex items-center mb-4">
          <img
            src={userData.photo_url || '/images/default.png'}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{userData.first_name} {userData.last_name}</h2>
            <p className="text-gray-600">@{userData.username}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <ul className="mt-2 space-y-2">
            <li><strong>ID:</strong> {userData.id}</li>
            <li><strong>First Name:</strong> {userData.first_name}</li>
            {userData.last_name && <li><strong>Last Name:</strong> {userData.last_name}</li>}
            <li><strong>Username:</strong> @{userData.username}</li>
            <li><strong>Total Points:</strong> {points}</li> {/* Display total points */}
            <li><strong>Total Commission:</strong> ${commission.toFixed(2)}</li> {/* Display total commission */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
