import React, { useState } from 'react';
import { FaMapMarkerAlt, FaMoneyBill } from 'react-icons/fa';
import FacilityModal from './FacilityModal';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const SportCard = ({ facility, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [updatedFacility, setUpdatedFacility] = useState(facility);

  const getFacilityLabel = (category) => {
    switch (category) {
      case 'Indoor Games':
        return 'Court No';
      case 'Outdoor Games':
        return 'Ground No';
      case 'Aquatic Sports':
        return 'Pool No';
      default:
        return 'Facility No';
    }
  };

  // Handle opening the update modal
  const handleBookNow = () => {
    setModalOpen(true);
  };

  // Handle saving the updated facility
  const handleSave = (updatedDetails) => {
    setUpdatedFacility(updatedDetails);
    setModalOpen(false);
  };

  // Handle delete facility
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this facility?');
    
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token'); // Get auth token
        await axios.delete(`https://sfbs-backend.vercel.app/api/v1/facilities/${facility._id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        
        toast.success('Facility deleted successfully!');// Success toast
        
        // Delay page reload for 3 seconds to allow toast to be visible
        setTimeout(() => {
          
        onDelete(facility._id);// Execute parent deletion handler
          
        }, 3000);
        window.location.reload();
        //window.location.reload(); // 3-second delay
      } catch (err) {
        toast.error(`Error deleting facility: ${err.message}`); // Error toast
      }
    } else {
      toast.info('Deletion canceled'); // Toast message for cancellation
    }
  };

  // Handle toggle active/deactivate status
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://sfbs-backend.vercel.app/api/v1/facilities/toggle/${facility._id}`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setUpdatedFacility(response.data); // Update facility with new active status
      toast.success(
        updatedFacility.isActive ? 'Facility deactivated successfully!' : 'Facility activated successfully!'
      );
    } catch (err) {
      toast.error(`Error toggling facility status: ${err.message}`);
    }
  };

  return (
    <>
      <div className={`bg-white p-4 rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:scale-105 ${updatedFacility.isActive ? '' : 'opacity-50'}`}>
        <img
          src={updatedFacility.image}
          alt={updatedFacility.sportName}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />

        {/* Flex container for sport name and status */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{updatedFacility.sportName}</h3>

          {/* Show status label on the right */}
          <p className={`text-md mr-2 font-bold ${updatedFacility.isActive ? 'text-teal-600' : 'text-red-600'}`}>
            {updatedFacility.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-2 text-sky-600" />
          <p className="text-lg">{`${getFacilityLabel(updatedFacility.sportCategory)}: ${updatedFacility.courtNumber}`}</p>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaMoneyBill className="mr-2 text-green-500" />
          <p className="text-base">{`Hourly Booking Fee : Rs. ${updatedFacility.courtPrice}`}</p>
        </div>

        {/* Button container to align buttons in the same row */}
        <div className="flex space-x-4">
          {/* Update button */}
          <button
            className="bg-teal-700 text-white flex-1 py-2 rounded-lg hover:bg-teal-800 transition duration-300"
            onClick={handleBookNow}
          >
            Update
          </button>

          {/* Toggle Active/Deactivate button */}
          <button
            className={`${
              updatedFacility.isActive ? 'bg-slate-500 ' : 'bg-sky-800'
            } text-white flex-1 py-2 rounded-lg hover:${
              updatedFacility.isActive ? 'bg-gray-700 ' : 'bg-sky-900'
            } transition duration-300`}
            onClick={handleToggleStatus}
          >
            {updatedFacility.isActive ? 'Deactivate' : 'Activate'}
          </button>

          {/* Delete button */}
          <button
            className="bg-red-500 text-white flex-1 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal for updating facility */}
      <FacilityModal
        facility={updatedFacility}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default SportCard;
