
import React from 'react';
import SportCard from './SportCard';

const SportsList = ({ availableFacilities, setAvailableFacilities }) => {

  // Handle the deletion of a facility
  const handleDelete = (id) => {
    const updatedFacilities = availableFacilities.filter((facility) => facility._id !== id);
    setAvailableFacilities(updatedFacilities); // Update the facilities list in the parent component's state
  };

  // Render facilities by category, showing both active and inactive facilities
  const renderSportsByCategory = (category) => {
    const categorySports = availableFacilities.filter(facility => facility.sportCategory === category);

    if (categorySports.length === 0) return null;

    return (
      <div className="ml-14 mr-14">
        <h2 className="text-2xl font-bold mb-4">{category}</h2>
        <div className="grid grid-cols-3 gap-6">
          {categorySports.map((facility) => (
            <SportCard key={facility._id} facility={facility} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full pl-16 pr-16 pt-2">
      {availableFacilities.length === 0 ? (
        <p>No facilities available.</p>
      ) : (
        <>
          {renderSportsByCategory('Indoor Games')}
          <div className="mt-8">{renderSportsByCategory('Outdoor Games')}</div>
          <div className="mt-8">{renderSportsByCategory('Aquatic Sports')}</div>
        </>
      )}
    </div>
  );
};

export default SportsList;
