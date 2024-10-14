import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Only toast is needed here, no ToastContainer

const FacilityModal = ({ facility, isOpen, onClose, onSave }) => {
  const [sportName, setSportName] = useState(facility?.sportName || '');
  const [sportCategory, setSportCategory] = useState(facility?.sportCategory || 'Indoor Games');
  const [courtNumber, setCourtNumber] = useState(facility?.courtNumber || '');
  const [courtPrice, setCourtPrice] = useState(facility?.courtPrice || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(facility?.image || '');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('sportName', sportName);
    formData.append('sportCategory', sportCategory);
    formData.append('courtNumber', courtNumber);
    formData.append('courtPrice', courtPrice);
    if (imageFile) formData.append('image', imageFile);

    try {
      const token = localStorage.getItem('token');
      let response;
      if (facility?._id) {
        response = await axios.put(
          `https://sfbs-backend.vercel.app/api/v1/facilities/${facility._id}`,
          formData,
          { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Facility updated successfully!');
      } else {
        response = await axios.post('https://sfbs-backend.vercel.app/api/v1/facilities', formData, {
          headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Facility created successfully!');
      }

      onSave(response.data); 

      setTimeout(() => {
        onClose(); 
        window.location.reload(); 
      }, 2000); 
    } catch (err) {
      toast.error(`Error saving facility: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full max-h-screen">
        <h2 className="text-lg font-bold mb-2">
          {facility?.sportName ? 'Update Facility Details' : 'Add New Facility'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Sport Name */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Sport Name:</label>
            <input
              type="text"
              value={sportName}
              onChange={(e) => setSportName(e.target.value)}
              className="w-2/3 p-1 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Sport Category */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Category:</label>
            <select
              value={sportCategory}
              onChange={(e) => setSportCategory(e.target.value)}
              className="w-2/3 p-1 border border-gray-300 rounded"
            >
              <option value="Indoor Games">Indoor Games</option>
              <option value="Outdoor Games">Outdoor Games</option>
              <option value="Aquatic Sports">Aquatic Sports</option>
            </select>
          </div>

          {/* Court Number */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Court No:</label>
            <input
              type="number"
              value={courtNumber}
              onChange={(e) => setCourtNumber(e.target.value)}
              className="w-1/6 p-1 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Hourly Booking Fee */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Hourly Fee (Rs):</label>
            <input
              type="number"
              value={courtPrice}
              onChange={(e) => setCourtPrice(e.target.value)}
              className="w-1/4 p-1 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-2/3 p-1 border border-gray-300 rounded"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-2">
              <label className="block text-gray-700 mb-1">Image Preview</label>
              <img src={imagePreview} alt="Selected facility" className="w-full h-32 object-cover rounded-lg" />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-700 text-white py-2 px-3 rounded-lg hover:bg-teal-800"
            >
              {facility?.sportName ? 'Save Changes' : 'Create Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityModal;
