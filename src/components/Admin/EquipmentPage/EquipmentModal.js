
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

const EquipmentModal = ({ equipment, isOpen, onClose, onSave }) => {
  const [equipmentName, setEquipmentName] = useState(equipment?.equipmentName || '');
  const [sportName, setSportName] = useState(equipment?.sportName || '');
  const [rentPrice, setRentPrice] = useState(equipment?.rentPrice || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(equipment?.image || '');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('equipmentName', equipmentName);
      formData.append('sportName', sportName);
      formData.append('rentPrice', rentPrice);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (equipment?._id) {
        // Update existing equipment
        await axios.put(`https://sfbs-backend.vercel.app/api/v1/equipment/${equipment._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
        });
        toast.success('Equipment updated successfully!'); // Success toast for update
      } else {
        // Create new equipment
        await axios.post('https://sfbs-backend.vercel.app/api/v1/equipment', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
        });
        toast.success('Equipment created successfully!'); // Success toast for create
      }

      onSave();

      setTimeout(() => {
        onClose(); 
        window.location.reload();
      }, 1000); 
      //window.location.reload();
      // onClose();
      // window.location.reload(); // Refresh after action
    } catch (error) {
      toast.error(`Error saving equipment: ${error.message}`); // Error toast for save
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full max-h-screen">
        <h2 className="text-lg font-bold mb-2">
          {equipment?.equipmentName ? 'Update Equipment Details' : 'Add New Equipment'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Equipment Name */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Equipment Name:</label>
            <input
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-2/3 p-1 border border-gray-300 rounded"
              required
            />
          </div>

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

          {/* Rent Price */}
          <div className="flex items-center mb-2">
            <label className="text-gray-700 w-1/3">Rent Price (Rs):</label>
            <input
              type="number"
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
              className="w-1/3 p-1 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Image Upload */}
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
              <img
                src={imagePreview}
                alt="Selected equipment"
                className="w-full h-32 object-cover rounded-lg"
              />
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
              {equipment?.equipmentName ? 'Save Changes' : 'Create Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;
