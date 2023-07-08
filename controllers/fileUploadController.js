const path = require('path');
const fs = require('fs');
const PDFJS = require('pdfjs-dist/legacy/build/pdf');
const XLSX = require('xlsx');

const fileUpload = async (req, res) => {
  // Access the uploaded PDF file using req.file
  const uploadedFile = req.file;

  try {
    // Read the uploaded PDF file
    const pdfBuffer = fs.readFileSync(uploadedFile.path);

    // Convert the PDF buffer to an ArrayBuffer
    const pdfData = new Uint8Array(pdfBuffer).buffer;

    // Load the PDF data
    const pdf = await PDFJS.getDocument({ data: pdfData }).promise;

    // Get the text content of page 7
    const page = await pdf.getPage(7);
    const content = await page.getTextContent();

    // Filter out the table elements based on the start and end indices and remove the space
    const tableElements = content.items.filter((item, index) => {
      return index >= 72 && index <= 97 && item.height > 0;
    });

    // Extract the text from the table elements
    const columnData = tableElements.map(item => item.str);

    // Create an Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Category', 'Attribute', 'Value'], // Interchanged col1 and col3
      ...transpose([
        [
        'Company Information', // First row
        ...Array(columnData.length - 1).fill(''), // Empty spaces for remaining rows
      ],
        columnData.filter((_, i) => i % 2 === 0),
        columnData.filter((_, i) => i % 2 === 1),
      ]),
    ]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Company Data');

    // Generate a unique filename for the Excel spreadsheet
    const excelFilename = `Company_Information.xlsx`;

    // Construct the path to save the Excel file
    const saveFolderPath = path.join(__dirname, '..', 'files');
    const savePath = path.join(saveFolderPath, excelFilename);

    // Create the "files" folder if it doesn't exist
    if (!fs.existsSync(saveFolderPath)) {
      fs.mkdirSync(saveFolderPath);
    }

    // Save the Excel spreadsheet to disk
    XLSX.writeFile(workbook, savePath);

    // Send the Excel spreadsheet as a response
    res.download(savePath, excelFilename, err => {
      if (err) {
        console.error('Error sending the Excel file:', err);
        res.status(500).json({ error: 'Failed to send the Excel file' });
      }
      // Delete the temporary PDF file
      fs.unlinkSync(uploadedFile.path);
    });
  } catch (error) {
    console.error('Error reading or processing PDF:', error);
    res.status(500).json({ error: 'Failed to process the PDF file' });
  }
};

// Helper function to transpose a matrix
function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

module.exports = {
  fileUpload,
};
