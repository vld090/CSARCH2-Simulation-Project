document.getElementById('cacheForm').addEventListener('submit', function(event) {
    event.preventDefault();
    simulateCache();
});

function convertToBlocks(size, unit, blockSize) {
    return unit === "words" ? Math.ceil(size / blockSize) : size;
}

function convertProgramFlowToBlocks(programFlow, unit, blockSize) {
    if (unit === "words") {
        const blockNumbers = programFlow.map(address => Math.floor(address / blockSize));
        return { PFlowConverted: blockNumbers, PFlowOffset: programFlow.map(address => address % blockSize) };
    }
    return { PFlowConverted: programFlow, PFlowOffset: [] };
}

class CacheSimulator {
    constructor(blockSize, mmSize, cacheSize, programFlow, memoryAccessTime) {
        this.blockSize = blockSize;
        this.cacheSize = cacheSize;
        this.programFlow = programFlow;
        this.memoryAccessTime = memoryAccessTime;
        this.cacheAccessTime = 1;
        this.cache = [];
        this.hits = 0;
        this.misses = 0;
        this.accessOrder = [];
    }

    accessMemory(block) {
        if (this.cache.includes(block)) {
            this.hits++;
            this.accessOrder.splice(this.accessOrder.indexOf(block), 1);
        } else {
            this.misses++;
            if (this.cache.length >= this.cacheSize) {
                this.cache.splice(this.cache.indexOf(this.accessOrder.pop()), 1);
            }
            this.cache.push(block);
        }
        this.accessOrder.push(block);
    }

    simulate() {
        this.programFlow.forEach(block => this.accessMemory(block));
    }

    calculateTimes() {
        const missPenalty = this.cacheAccessTime + (this.blockSize * this.memoryAccessTime) + this.cacheAccessTime;
        const totalAccesses = this.hits + this.misses;
        const avgMemoryAccessTime = ((this.hits / totalAccesses) * this.cacheAccessTime) + ((this.misses / totalAccesses) * missPenalty);
        const totalMemoryAccessTime = (this.hits * this.blockSize * this.cacheAccessTime) + (this.misses * this.blockSize * (this.cacheAccessTime + this.memoryAccessTime)) + (this.misses * this.cacheAccessTime);
        return {
            totalMemoryAccessTime: totalMemoryAccessTime.toFixed(2),
            avgMemoryAccessTime: avgMemoryAccessTime.toFixed(2),
            missPenalty: missPenalty.toFixed(2)
        };
    }

    outputResults() {
        const { totalMemoryAccessTime, avgMemoryAccessTime, missPenalty } = this.calculateTimes();
        document.getElementById('hits').textContent = `Hits: ${this.hits}`;
        document.getElementById('misses').textContent = `Misses: ${this.misses}`;
        document.getElementById('missPenalty').textContent = `Miss Penalty: ${missPenalty} ns`;
        document.getElementById('averageMemoryAccessTime').textContent = `Average Memory Access Time: ${avgMemoryAccessTime} ns`;
        document.getElementById('totalMemoryAccessTime').textContent = `Total Memory Access Time: ${totalMemoryAccessTime} ns`;
        document.getElementById('cacheSnapshot').textContent = `Cache Snapshot: ${this.cache}`;
    }
}

function simulateCache() {
    const memoryAccessTime = parseInt(document.getElementById('memoryAccessTime').value);
    const blockSize = parseInt(document.getElementById('blockSize').value);
    let mmSize = convertToBlocks(parseInt(document.getElementById('mmSize').value), document.querySelector('input[name="mmSizeUnit"]:checked').value, blockSize);
    let cacheSize = convertToBlocks(parseInt(document.getElementById('cacheSize').value), document.querySelector('input[name="cacheSizeUnit"]:checked').value, blockSize);
    let programFlow = document.getElementById('programFlow').value.split(',').map(Number);
    const { PFlowConverted } = convertProgramFlowToBlocks(programFlow, document.querySelector('input[name="programFlowUnit"]:checked').value, blockSize);

    const cacheSimulator = new CacheSimulator(blockSize, mmSize, cacheSize, PFlowConverted, memoryAccessTime);
    cacheSimulator.simulate();
    cacheSimulator.outputResults();
}

function downloadResults() {
    const results = `
        Cache Hits: ${document.getElementById('hits').textContent}
        Cache Misses: ${document.getElementById('misses').textContent}
        Miss Penalty: ${document.getElementById('missPenalty').textContent}
        Average Memory Access Time: ${document.getElementById('averageMemoryAccessTime').textContent}
        Total Memory Access Time: ${document.getElementById('totalMemoryAccessTime').textContent}
        Cache Snapshot: ${document.getElementById('cacheSnapshot').textContent}
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
