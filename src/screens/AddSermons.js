import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';

function AddSermonDialog({ open, onClose }) {
  const [sermonName, setSermonName] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const [inputMethod, setInputMethod] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sermonNames, setSermonNames] = useState([]);

  useEffect(() => {
    const fetchSermonNames = async () => {
      try {
        const q = query(collection(db, 'sermons'));
        const querySnapshot = await getDocs(q);
        const names = querySnapshot.docs.map((doc) => doc.data().sermonName.toLowerCase());
        setSermonNames(names);
      } catch (error) {
        console.error('Error fetching sermon names:', error);
      }
    };

    if (open) {
      fetchSermonNames();
    }
  }, [open]);

  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError('');
    } else {
      setAudioFile(null);
      setError('Please select a valid audio file.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (sermonNames.includes(sermonName.toLowerCase())) {
        setError('Sermon name already exists.');
        setLoading(false);
        return;
      }

      let audioFilePath = '';
      let downloadURL = '';

      if (inputMethod === 'audioFile' && audioFile) {
        const storageRef = ref(storage, `audio/${sermonName}.mp3`);
        await uploadBytes(storageRef, audioFile);
        downloadURL = await getDownloadURL(storageRef);
        audioFilePath = `audio/${sermonName}.mp3`;
      }

      const uniqueId = `sermon_${new Date().toISOString()}`;

      const sermonData = {
        sermonName,
        audioLink: inputMethod === 'audioLink' ? audioLink : downloadURL,
        videoLink,
        audioConfig: audioFilePath,
        uniqueId,
      };

      await setDoc(doc(db, 'sermons', uniqueId), sermonData);
      setLoading(false);
      onClose();
    } catch (error) {
      alert('Error uploading file or saving data:');
      setError('Error uploading file or saving data');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Add Sermon
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the details for the new sermon.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Sermon Name"
          fullWidth
          value={sermonName}
          onChange={(e) => setSermonName(e.target.value)}
          error={sermonNames.includes(sermonName.toLowerCase())}
          helperText={sermonNames.includes(sermonName.toLowerCase()) ? 'Sermon name already exists.' : ''}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="input-method-label">Input Method</InputLabel>
          <Select
            labelId="input-method-label"
            value={inputMethod}
            onChange={(e) => setInputMethod(e.target.value)}
          >
            <MenuItem value="audioFile">Upload Audio File</MenuItem>
            <MenuItem value="audioLink">Provide Audio Link</MenuItem>
          </Select>
        </FormControl>
        {inputMethod === 'audioFile' && (
          <TextField
            margin="dense"
            type="file"
            accept="audio/*"
            fullWidth
            onChange={handleAudioFileChange}
            error={Boolean(error)}
            helperText={error}
          />
        )}
        {inputMethod === 'audioLink' && (
          <TextField
            margin="dense"
            label="Audio Link"
            fullWidth
            value={audioLink}
            onChange={(e) => setAudioLink(e.target.value)}
          />
        )}
        <TextField
          margin="dense"
          label="Video Link"
          fullWidth
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AddSermonDialog;
