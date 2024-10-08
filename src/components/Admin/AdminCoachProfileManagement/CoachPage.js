
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoachProfiles } from '../../../redux/actions/coachActions';
import AdminNavbar from '../../Layout/AdminNavbar';
import Footer from '../../Layout/Footer';
import CoachCard from './CoachCard'; 
import FilterSection from './FilterSection'; 
import axios from 'axios';  

const CoachPage = () => {
  const dispatch = useDispatch();
  
  // State to store user details with the isActive status
  const [users, setUsers] = useState([]);

  const coaches = useSelector(state => state.coaches.coaches);
  const [filteredCoaches, setFilteredCoaches] = useState(coaches);
  const [coachingSportFilter, setCoachingSportFilter] = useState('');
  const [coachLevelFilter, setCoachLevelFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCoachProfiles());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCoaches(
      coaches.filter(coach =>
        (coachingSportFilter ? coach.coachingSport === coachingSportFilter : true) &&
        (coachLevelFilter ? coach.coachLevel === coachLevelFilter : true) &&
        (searchTerm ? coach.coachName.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      )
    );
  }, [coaches, coachingSportFilter, coachLevelFilter, searchTerm]);

  // Fetch user data to get isActive status
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');  
      const response = await axios.get('https://sfbs-backend.vercel.app/api/v1/user/all', {
        headers: { 'x-auth-token': token }
      });
      setUsers(response.data); // Store the user data with isActive status
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch the user data when the component mounts
  }, []);

  const handleFilter = (coachingSport, coachLevel) => {
    setCoachingSportFilter(coachingSport);
    setCoachLevelFilter(coachLevel);
  };

  // Function to toggle the active status of the coach
  const handleToggleStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');  
      const response = await axios.put(
        `https://sfbs-backend.vercel.app/api/v1/user/toggle/${userId}`,  
        { isActive: newStatus },  // Toggle the user's isActive status
        { headers: { 'x-auth-token': token } }
      );
      if (response.status === 200) {
        // Optimistically update the user state with new isActive status
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? { ...user, isActive: newStatus } : user
          )
        );
      } else {
        console.error('Error toggling user status:', response.status);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  // Find the user status based on userId
  const getUserStatus = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.isActive : false;
  };

  const uniqueCoachingSports = useMemo(() => [...new Set(coaches.map(coach => coach.coachingSport))], [coaches]);
  const uniqueCoachLevels = useMemo(() => [...new Set(coaches.map(coach => coach.coachLevel))], [coaches]);

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen ">
        <div className='p-12 pt-6 pb-2'>
        <h1 className="text-3xl font-bold mb-6 ml-36 text-teal-700">Coaches Management</h1>
        
        {/* Filter Section */}
        <FilterSection 
          uniqueCoachingSports={uniqueCoachingSports} 
          uniqueCoachLevels={uniqueCoachLevels} 
          coachingSportFilter={coachingSportFilter} 
          coachLevelFilter={coachLevelFilter} 
          handleFilter={handleFilter} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        </div>

        {/* Coaches Section */}
        <div className="bg-gray-100 py-8">
          <div className="max-w-6xl mx-auto">
            {filteredCoaches.length > 0 ? (
              filteredCoaches.map((coach, index) => (
                <CoachCard 
                  key={index} 
                  coach={coach} 
                  isActive={getUserStatus(coach.userId)}  // Get the user's active status
                  handleToggleStatus={handleToggleStatus}  // Pass handleToggleStatus
                />
              ))
            ) : (
              <div className="text-center text-gray-700">
                <p>No coaches found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoachPage;
