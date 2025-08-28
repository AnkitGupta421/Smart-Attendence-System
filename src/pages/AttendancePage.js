import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AttendancePage = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    // TODO: Send image to backend for face recognition & attendance marking
    alert('Attendance marked (Mock)');
  };

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: 'user',
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mark Attendance
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
          <Webcam
            audio={false}
            height={300}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            videoConstraints={videoConstraints}
            style={{ borderRadius: '10px', border: '1px solid #ccc' }}
          />
        </Box>

        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={capture}
        >
          Scan & Mark Attendance
        </Button>

        {image && (
          <Box mt={3}>
            <Typography variant="subtitle1">Captured Image:</Typography>
            <img src={image} alt="Captured" width={300} style={{ borderRadius: 8 }} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AttendancePage;
