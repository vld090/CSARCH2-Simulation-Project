document.getElementById('cacheForm').addEventListener('submit', function(event) {
    event.preventDefault();

    simulateCache();
});

function convertToBlocks(size, unit, blockSize) {
    if (unit === "words") {
        return Math.ceil(size / blockSize);
    }
    return size;
}

function convertProgramFlowToBlocks(programFlow, unit, blockSize) {
    if (unit === "words") {
        const blockNumbers = programFlow.map(address => Math.floor(address / blockSize));
        const offsets = programFlow.map(address => address % blockSize);
        return { PFlowConverted: blockNumbers, PFlowOffset: offsets };
    }
    return { PFlowConverted: programFlow, PFlowOffset: [] };
}

function simulateCache() {
    const memoryAccessTime = parseInt(document.getElementById('memoryAccessTime').value);
    const blockSize = parseInt(document.getElementById('blockSize').value);
    const mmSize = parseInt(document.getElementById('mmSize').value);
    const mmSizeUnit = document.querySelector('input[name="mmSizeUnit"]:checked').value;
    const cacheSize = parseInt(document.getElementById('cacheSize').value);
    const cacheSizeUnit = document.querySelector('input[name="cacheSizeUnit"]:checked').value;
    const programFlow = document.getElementById('programFlow').value.split(',').map(Number);
    const programFlowUnit = document.querySelector('input[name="programFlowUnit"]:checked').value;

    const MMConverted = convertToBlocks(mmSize, mmSizeUnit, blockSize);
    const CacheConverted = convertToBlocks(cacheSize, cacheSizeUnit, blockSize);

    const { PFlowConverted, PFlowOffset } = convertProgramFlowToBlocks(programFlow, programFlowUnit, blockSize);

    console.log("Main Memory Size in Blocks:", MMConverted);
    console.log("Cache Memory Size in Blocks:", CacheConverted);
    console.log("Program Flow in Blocks:", PFlowConverted);
    console.log("Program Flow Offsets:", PFlowOffset);

    document.getElementById('hits').textContent = "Hits: ...";
    document.getElementById('misses').textContent = "Misses: ...";
    document.getElementById('missPenalty').textContent = "Miss Penalty: ...";
    document.getElementById('averageMemoryAccessTime').textContent = "Average Memory Access Time: ...";
    document.getElementById('totalMemoryAccessTime').textContent = "Total Memory Access Time: ...";
    document.getElementById('cacheSnapshot').textContent = "Cache Snapshot: ...";
}

function downloadResults() {
    const results = `
        Cache Hits: ${document.getElementById('hits').innerText}
        Cache Misses: ${document.getElementById('misses').innerText}
        Miss Penalty: ${document.getElementById('missPenalty').innerText}
        Average Memory Access Time: ${document.getElementById('averageMemoryAccessTime').innerText}
        Total Memory Access Time: ${document.getElementById('totalMemoryAccessTime').innerText}
        Cache Snapshot: ${document.getElementById('cacheSnapshot').innerText}
    `;
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cache_simulation_results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
