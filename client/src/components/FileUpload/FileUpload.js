// FileUpload.js
import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { Upload } from 'react-bootstrap-icons';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded successfully:', response.data);
      // Handle response from server
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
  };

  return (
    <div className="file-upload">
      <Typography variant="h5" gutterBottom>
        {/* File Upload */}
      </Typography>
      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<Upload />}
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default FileUpload;
