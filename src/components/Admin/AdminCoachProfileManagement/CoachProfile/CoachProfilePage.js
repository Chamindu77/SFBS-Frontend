import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachProfileById } from '../../../../redux/actions/coachActions';
import { fetchReviewsByCoach } from '../../../../redux/actions/reviewActions';
import CoachProfile from './CoachProfile';
import ReviewsSection from './ReviewsSection';
import { FaPlay, FaPowerOff } from 'react-icons/fa';

const CoachProfilePage = ({ coachId, coachUserId }) => {  // Receive both coachId and coachUserId
  const dispatch = useDispatch();
  const coachProfile = useSelector(state => state.coaches.selectedCoach);
  const reviewsData = useSelector(state => state.reviews.reviewsByCoach[coachId]);

  const reviews = reviewsData?.reviews || [];
  const avgRating = reviewsData?.avgRating || 'No Ratings';

  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState({});

  useEffect(() => {
    // Fetch coach profile by coachId
    dispatch(fetchCoachProfileById(coachId)).then((result) => {
      if (result && result.payload) {
        setCoach(result.payload);
      } else if (result) {
        setCoach(result);
      }
      setLoading(false);
    });

    // Fetch reviews for the coach by coachId
    dispatch(fetchReviewsByCoach(coachId));
  }, [dispatch, coachId]);

  // Toggle coach status (activate/deactivate) using coachUserId
  const handleToggleStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://sfbs-backend.vercel.app/api/v1/coach-profile/toggle/${coachUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ isActive: status }),
      });

      if (response.ok) {
        const updatedCoach = await response.json();
        setCoach(updatedCoach);
      } else {
        console.error('Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!coachProfile) {
    return <div>Coach profile not found.</div>;
  }

  return (
    <div className="space-y-4">
      <CoachProfile coachProfile={coachProfile} avgRating={avgRating} />
      <ReviewsSection reviews={reviews} />
      <div className="flex justify-end mt-4">
        {coach.isActive ? (
          <button
            className="bg-sky-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-900 flex items-center"
            onClick={() => handleToggleStatus(false)}  // Deactivate using coachUserId
          >
            <FaPowerOff className="mr-2" /> Deactivate
          </button>
        ) : (
          <button
            className="bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-800 flex items-center"
            onClick={() => handleToggleStatus(true)}  // Activate using coachUserId
          >
            <FaPlay className="mr-2" /> Activate
          </button>
        )}
      </div>
    </div>
  );
};

export default CoachProfilePage;
