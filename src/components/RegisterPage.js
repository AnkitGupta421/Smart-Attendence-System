// src/components/RegisterPage.js
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../context/ThemeContext'; // ✅ Correct

import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SendIcon from '@mui/icons-material/Send';


import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const RegisterPage = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const webcamRef = useRef(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const handleSubmit = () => {
    if (!name || !image) {
      alert('Please enter your name and capture a photo.');
      return;
    }

    // Will be connected to backend later
    alert('Submitted successfully!');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        </Box>

        <Typography variant="h4" gutterBottom>
          Register Face
        </Typography>

        <TextField
          fullWidth
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            height={300}
            style={{ borderRadius: '10px', border: '1px solid #ccc' }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={capture}
          sx={{ mr: 2 }}
          startIcon={<CameraAltIcon />}
>
          Capture Face
        </Button>


        {image && (
          <Box mt={2}>
            <Typography variant="subtitle1">Preview:</Typography>
            <img src={image} alt="Captured" width={300} style={{ borderRadius: 8 }} />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
          onClick={handleSubmit}
          endIcon={<SendIcon />}
          >
          Submit Registration
</Button>

      </Paper>
    </Container>
  );
};

export default RegisterPage;
