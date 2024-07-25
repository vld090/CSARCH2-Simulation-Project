// Define constant values for cache and memory access times
const CACHE_ACCESS_TIME = 1;  // in nanoseconds
const MEMORY_ACCESS_TIME = 10;  // in nanoseconds

// Function to handle the simulate button click
function simulateCache() {
    // Get values from the form inputs
    const blockSize = parseInt(document.getElementById('blockSize').value);
    const mmSize = parseInt(document.getElementById('mmSize').value);
    const cacheSize = parseInt(document.getElementById('cacheSize').value);
    const programFlow = document.getElementById('programFlow').value;
    const loadThru = document.getElementById('loadThru').value === 'Yes' ? 1 : 0; // Convert Yes to 1, No to 0

    // Example of displaying the values (you can modify this as per your simulation logic)
    console.log("Block Size:", blockSize);
    console.log("Main Memory Size:", mmSize);
    console.log("Cache Size:", cacheSize);
    console.log("Program Flow:", programFlow);
    console.log("Load-Thru:", loadThru);

    // Perform your cache simulation logic here using the extracted values
}

// Function to handle download button click (example)
function downloadResults() {
    // Example download logic
    console.log("Downloading results...");
}
