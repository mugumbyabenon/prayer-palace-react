// PubliSermons.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import AudioPlayerTEST from './Audioplayer';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function PubliSermons() {
  const [allSermons, setAllSermons] = useState([]); // Store all data from Firestore
  const [sermons, setSermons] = useState([]); // Filtered and paginated data
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const sermonRef = collection(db, 'sermons');
        const q = query(sermonRef, orderBy('sermonName'));
        const querySnapshot = await getDocs(q);
        const sermonsData = querySnapshot.docs.map(doc => doc.data());

        setAllSermons(sermonsData); // Store all data in state
        setPage(1); // Reset to first page on new data
      } catch (error) {
        console.error('Error fetching sermons:', error);
      }
    };

    fetchSermons();
  }, []);

  useEffect(() => {
    const filterAndPaginate = () => {
      let filteredSermons = allSermons;

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        // First filter: Items that start with the search term
        const startsWithFiltered = allSermons.filter(sermon =>
          sermon.sermonName.toLowerCase().startsWith(lowerCaseSearchTerm)
        );
        
        // Second filter: Items that contain the search term
        const containsFiltered = allSermons.filter(sermon =>
          sermon.sermonName.toLowerCase().includes(lowerCaseSearchTerm)
        );

        // Combine results: prioritize "starts with" results, then add "contains" results
        filteredSermons = [...startsWithFiltered, ...containsFiltered.filter(
          sermon => !startsWithFiltered.includes(sermon)
        )];
        
        setNoResults(filteredSermons.length === 0);
      } else {
        setNoResults(false);
      }

      const startIndex = (page - 1) * itemsPerPage;
      const paginatedSermons = filteredSermons.slice(startIndex, startIndex + itemsPerPage);
      setSermons(paginatedSermons);
      setTotalPages(Math.ceil(filteredSermons.length / itemsPerPage));
    };

    filterAndPaginate();
  }, [allSermons, page, searchTerm]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div style={{ marginLeft: '10px' }}>
      <TextField
        label="Search Sermons"
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {noResults && <p>No results found.</p>}

      {sermons.map((sermon, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <AudioPlayerTEST
            filePath={sermon.audioConfig}
            imageUrl="https://aztec.x10.mx/wp/wp-content/uploads/2024/07/cropped-church-logo-2.webp"
            trackName={sermon.sermonName}
            albumName={sermon.albumName || 'Unknown Album'}
          />
        </div>
      ))}

      {totalPages > 1 && (
        <Stack spacing={2} style={{ marginTop: '20px' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}
    </div>
  );
}

export default PubliSermons;
