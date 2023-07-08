// server.js
const app = require('./app');

const multer = require('multer');
const fileUploadController = require('./controllers/fileUploadController');
const upload = multer({ dest: 'uploads/' });

// API endpoint for file upload
app.post('/api/upload', upload.single('file'), fileUploadController.fileUpload);

//const connectDB = require('./config/db');

// Connect to MongoDB
//connectDB();

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});