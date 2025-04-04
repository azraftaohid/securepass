const fs = require('fs');
const path = require('path');

// Step 1: Read the file
const inputPath = path.join(__dirname, 'raw', 'words.txt');
const outputDir = path.join(__dirname, 'assets');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Step 2: Read and process the file content
const fileContent = fs.readFileSync(inputPath, 'utf8');

// Step 3: Split lines and process each line
const lines = fileContent.split(/\r?\n/);

lines.forEach((line, index) => {
  if (!line.trim()) return; // Skip empty lines

  const words = line.split('\t');

  // Step 4: Create output filename and write JSON
  const outputFilename = `word-list-${index + 1}.json`;
  const outputPath = path.join(outputDir, outputFilename);

  fs.writeFileSync(outputPath, JSON.stringify(words), 'utf8');
});

console.log(`✅ Processed ${lines.length} lines into individual JSON files.`);
