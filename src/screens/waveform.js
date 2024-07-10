import React from 'react';
import { Box } from '@mui/material';
import styled, { keyframes } from 'styled-components';

const waveAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const WaveformContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 20px;
  overflow: hidden;
  background: linear-gradient(90deg, #00f260 50%, transparent 50%);
`;

const WaveformProgress = styled.div`
  position: absolute;
  width: 200%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    #00f260 0%,
    #00f260 2px,
    transparent 2px,
    transparent 4px
  );
  animation: ${waveAnimation} 1.5s linear infinite;
`;

const CustomWaveformProgressBar = ({ progress }) => {
  return (
    <WaveformContainer sx={{ width: '100%' }}>
      <WaveformProgress style={{ width: `${progress}%` }} />
    </WaveformContainer>
  );
};

export default CustomWaveformProgressBar;
