// Define constant values for cache and memory access times
const CACHE_ACCESS_TIME = 1;  // in nanoseconds
const MEMORY_ACCESS_TIME = 10;  // in nanoseconds

class CacheSimulator {
    constructor(blockSize, mmSize, cacheSize, programFlow, mmSizeUnit, cacheSizeUnit, programFlowUnit) {
        this.blockSize = blockSize;
        this.mmSize = this.convertToBlocks(mmSize, mmSizeUnit);
        this.cacheSize = this.convertToBlocks(cacheSize, cacheSizeUnit);
        this.programFlow = this.convertToBlocksArray(programFlow.split(',').map(Number), programFlowUnit);
        this.cache = [];
        this.hits = 0;
        this.misses = 0;
        this.accessOrder = [];
    }

    convertToBlocks(size, unit) {
        return unit === 'blocks' ? size : Math.ceil(size / this.blockSize);
    }

    convertToBlocksArray(array, unit) {
        return unit === 'blocks' ? array : array.map(value => Math.floor(value / this.blockSize));
    }

    accessMemory(block) {
        if (this.cache.includes(block)) {
            this.hits += 1;
            const index = this.accessOrder.indexOf(block);
            this.accessOrder.splice(index, 1);
            this.accessOrder.push(block);
        } else {
            this.misses += 1;
            if (this.cache.length >= this.cacheSize) {
                const mruBlock = this.accessOrder.pop();
                const mruIndex = this.cache.indexOf(mruBlock);
                this.cache.splice(mruIndex, 1);
            }
            this.cache.push(block);
            this.accessOrder.push(block);
        }
    }

    simulate() {
        this.programFlow.forEach(block => this.accessMemory(block));
    }

    calculateTimes() {
        const missPenalty = (this.blockSize * MEMORY_ACCESS_TIME) + 2; // example value
        const totalAccesses = this.hits + this.misses;
        const totalMemoryAccessTime = this.hits * CACHE_ACCESS_TIME + this.misses * missPenalty;
        const averageMemoryAccessTime = (this.hits / totalAccesses) * CACHE_ACCESS_TIME + (this.misses / totalAccesses) * missPenalty;
        return {
            missPenalty,
            totalMemoryAccessTime,
            averageMemoryAccessTime
        };
    }

    snapshotCache() {
        return this.cache;
    }

    outputResults() {
        const { missPenalty, totalMemoryAccessTime, averageMemoryAccessTime } = this.calculateTimes();
        return {
            hits: this.hits,
            misses: this.misses,
            missPenalty,
            totalMemoryAccessTime,
            averageMemoryAccessTime,
            cacheSnapshot: this.snapshotCache()
        };
    }
}

// Function to handle the simulate button click
function simulateCache() {
    // Get values from the form inputs
    const blockSize = parseInt(document.getElementById('blockSize').value);
    const mmSize = parseInt(document.getElementById('mmSize').value);
    const cacheSize = parseInt(document.getElementById('cacheSize').value);
    const programFlow = document.getElementById('programFlow').value;
    const mmSizeUnit = document.querySelector('input[name="mmSizeUnit"]:checked').value;
    const cacheSizeUnit = document.querySelector('input[name="cacheSizeUnit"]:checked').value;
    const programFlowUnit = document.querySelector('input[name="programFlowUnit"]:checked').value;

    // Create a new instance of CacheSimulator
    const simulator = new CacheSimulator(blockSize, mmSize, cacheSize, programFlow, mmSizeUnit, cacheSizeUnit, programFlowUnit);
    simulator.simulate();
    const results = simulator.outputResults();

    // Display the results in the webpage
    document.getElementById('hits').innerText = `Cache Hits: ${results.hits}`;
    document.getElementById('misses').innerText = `Cache Misses: ${results.misses}`;
    document.getElementById('missPenalty').innerText = `Miss Penalty: ${results.missPenalty}`;
    document.getElementById('averageMemoryAccessTime').innerText = `Average Memory Access Time: ${results.averageMemoryAccessTime}`;
    document.getElementById('totalMemoryAccessTime').innerText = `Total Memory Access Time: ${results.totalMemoryAccessTime}`;
    document.getElementById('cacheSnapshot').innerText = `Cache Snapshot: ${results.cacheSnapshot}`;
}

// Function to handle download button click (example)
function downloadResults() {
    // Example download logic
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
