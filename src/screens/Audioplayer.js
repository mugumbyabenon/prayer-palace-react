import React, { useEffect, useState } from 'react';
import { storage } from '../firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { Card, CardContent, CardMedia, IconButton, Slider, Typography, Box, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import DownloadIcon from '@mui/icons-material/Download';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const AudioPlayerTEST = ({ filePath, imageUrl, trackName, albumName, videoLink }) => {
    const [audioUrl, setAudioUrl] = useState('');
    const [audioElement, setAudioElement] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const fetchAudioUrl = async () => {
            try {
                const storageRef = ref(storage, filePath);
                const url = await getDownloadURL(storageRef);
                setAudioUrl(url);
            } catch (error) {
                console.error('Error fetching audio URL:', error);
            }
        };

        fetchAudioUrl();
    }, [filePath]);

    useEffect(() => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            setAudioElement(audio);

            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration);
            });

            return () => {
                audio.removeEventListener('timeupdate', () => {});
                audio.pause();
            };
        }
    }, [audioUrl]);

    const handlePlayPause = () => {
        if (playing) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        setPlaying(!playing);
    };

    const handleFastForward = () => {
        if (audioElement) {
            audioElement.currentTime += 10;
        }
    };

    const handleRewind = () => {
        if (audioElement) {
            audioElement.currentTime -= 10;
        }
    };

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue / 100);
        if (audioElement) {
            audioElement.volume = newValue / 100;
        }
    };

    const handleDownload = () => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = 'audio-file.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImageClick = () => {
        const isValidUrl = (url) => {
            const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate the protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!urlPattern.test(url);
        };
    
        if (videoLink && isValidUrl(videoLink)) {
           
        //    window.open(videoLink, '_blank');
        }
        window.open(videoLink, '_blank');
    };
    
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'row', height: 279, width: '100%', maxWidth: '92.5vw' }}>
            <Box sx={{ position: 'relative', width: 190, height: '100%', cursor: 'pointer' }} onClick={handleImageClick}>
                <CardMedia
                    component="img"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    image={imageUrl}
                    alt="Album cover"
                />
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    borderRadius: '50%', 
                    width: 60, 
                    height: 60 
                }}>
                    <PlayArrowIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
                <CardContent sx={{ padding: 1, flex: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '70%', overflow: 'hidden' ,maxWidth:'450px'}}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 'bold', 
                                whiteSpace: 'normal', 
                                wordBreak: 'break-word', 
                                marginLeft: 1 
                            }}>
                            {trackName}
                        </Typography>
                    </Box>
                </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 1, justifyContent: 'center', height: 30 }}>
                    {audioUrl ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.1 }}>
                                <IconButton onClick={handleRewind}>
                                    <FastRewindIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={handlePlayPause}>
                                    {playing ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                                </IconButton>
                                <IconButton onClick={handleFastForward}>
                                    <FastForwardIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={handleDownload}>
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.1, flex: 1, marginTop: 1 }}>
                                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                                <Slider
                                    value={(currentTime / duration) * 100 || 0}
                                    onChange={(event, newValue) => {
                                        if (audioElement) {
                                            audioElement.currentTime = (newValue / 100) * duration;
                                            setCurrentTime(audioElement.currentTime);
                                        }
                                    }}
                                    aria-labelledby="progress-slider"
                                    sx={{ flex: 1, marginLeft: 1 }}
                                />
                                <Typography variant="caption">{formatTime(duration)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.1, marginTop: 1 }}>
                                <IconButton onClick={() => handleVolumeChange(null, volume > 0 ? 0 : 100)}>
                                    {volume > 0 ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
                                </IconButton>
                                <Slider
                                    value={volume * 100}
                                    onChange={handleVolumeChange}
                                    aria-labelledby="volume-slider"
                                    sx={{ width: 80 }}
                                />
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

export default AudioPlayerTEST;
