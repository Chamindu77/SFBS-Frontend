import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchAvailableFacilities } from '../../redux/actions/facilityActions';
import Footer from '../Layout/Footer';
import LogoutNavbar from '../Layout/LogoutNavbar';
import FilterSection from './FilterSection';
import SportsList from './SportsList';
import MessiHero from '../../assets/image-hero-sportcategorypage.jpg';

const SportCategoryPage = ({ fetchAvailableFacilities, availableFacilities }) => {
  const [filteredSports, setFilteredSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);

  useEffect(() => {
    fetchAvailableFacilities();
  }, [fetchAvailableFacilities]);

  const handleFilter = (sport) => {
    setSelectedSport(sport);
    if (sport) {
      setFilteredSports(
        availableFacilities.filter(facility => facility.sportName === sport)
      );
    } else {
      setFilteredSports([]);
    }
  };

  const handleReset = () => {
    setSelectedSport(null);
    setFilteredSports([]);
  };

  return (
    <div>
      <LogoutNavbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div
          className="relative bg-cover bg-center text-white p-24 rounded-lg shadow-md mb-8"
          style={{ backgroundImage: `url(${MessiHero})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
          <div className="relative z-10 animate-blurToFocus">
            <h1 className="text-5xl font-bold mb-4">
              Select Your <span className="text-green-400">Sport</span> and Start Your <span className="text-green-400">Booking</span>
            </h1>
            <p className="text-2xl">
              Choose Your Preferred Sport, Then Proceed To Book The Facility That Matches Your Needs.
            </p>
          </div>
        </div>
        <div className="flex">
          <FilterSection
            availableFacilities={availableFacilities}
            selectedSport={selectedSport}
            onFilter={handleFilter}
            onReset={handleReset}
          />
          <SportsList
            availableFacilities={availableFacilities}
            filteredSports={filteredSports}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  availableFacilities: state.facility.availableFacilities,
});

export default connect(mapStateToProps, { fetchAvailableFacilities })(SportCategoryPage);
