// Home.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import AudioPlayerTEST from '../Audioplayer';
import AddSermonDialog from '../AddSermons';


function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const profileUrl = 'https://aztec.x10.mx/wp/wp-content/uploads/2024/07/cropped-church-logo-2.webp';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App" style={{ marginLeft: '40vw' }}>
      <Button
        style={{ display: 'block', marginBottom: '10px' }}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Add Sermon
      </Button>
      <AddSermonDialog open={open} onClose={handleClose} />
      <div style={{ display: 'block', marginBottom: '10px' }}>
        <AudioPlayerTEST
          filePath="Audio/TitoM-Tshwala-Bam.mp3"
          imageUrl={profileUrl}
          trackName="hhhghdssssssssssssssssssss"
          albumName="hsahhhaj"
        />
      </div>
    </div>
  );
}

export default Home;
