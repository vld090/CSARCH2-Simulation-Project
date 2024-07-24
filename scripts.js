function simulateCache() {
    // Get input values
    const blockSize = parseInt(document.getElementById('blockSize').value);
    const mmSize = parseInt(document.getElementById('mmSize').value);
    const cacheSize = parseInt(document.getElementById('cacheSize').value);
    const programFlow = document.getElementById('programFlow').value.split(',').map(Number);

    // Initialize cache and other parameters
    const cache = [];
    let hits = 0;
    let misses = 0;
    const missPenalty = 100; // example value
    const memoryAccessTime = 10; // example value
    let totalMemoryAccessTime = 0;

    // Simulate the cache behavior
    programFlow.forEach(address => {
        const block = Math.floor(address / blockSize);

        // Check if the block is in the cache (MRU)
        const index = cache.indexOf(block);

        if (index !== -1) {
            // Cache hit
            hits++;
            cache.splice(index, 1);
        } else {
            // Cache miss
            misses++;
            totalMemoryAccessTime += missPenalty;
        }

        // Insert the block into the cache (most recently used)
        cache.unshift(block);

        // Ensure cache size limit
        if (cache.length > cacheSize) {
            cache.pop();
        }

        totalMemoryAccessTime += memoryAccessTime;
    });

    const averageMemoryAccessTime = totalMemoryAccessTime / programFlow.length;

    // Display results
    document.getElementById('hits').innerText = `Cache Hits: ${hits}`;
    document.getElementById('misses').innerText = `Cache Misses: ${misses}`;
    document.getElementById('missPenalty').innerText = `Miss Penalty: ${missPenalty}`;
    document.getElementById('averageMemoryAccessTime').innerText = `Average Memory Access Time: ${averageMemoryAccessTime}`;
    document.getElementById('totalMemoryAccessTime').innerText = `Total Memory Access Time: ${totalMemoryAccessTime}`;
    document.getElementById('cacheSnapshot').innerText = `Cache Snapshot: ${cache.join(', ')}`;
}

function downloadResults() {
    const hits = document.getElementById('hits').innerText;
    const misses = document.getElementById('misses').innerText;
    const missPenalty = document.getElementById('missPenalty').innerText;
    const averageMemoryAccessTime = document.getElementById('averageMemoryAccessTime').innerText;
    const totalMemoryAccessTime = document.getElementById('totalMemoryAccessTime').innerText;
    const cacheSnapshot = document.getElementById('cacheSnapshot').innerText;

    const results = `${hits}\n${misses}\n${missPenalty}\n${averageMemoryAccessTime}\n${totalMemoryAccessTime}\n${cacheSnapshot}`;

    const blob = new Blob([results], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cache_simulator_results.txt';
    link.click();
}
