// cacheSimulation.test.js
const {
    convertToBlocks,
    convertProgramFlowToBlocks,
    simulateCache,
} = require('./scripts copy.js'); // Same folder, so use './script'

test('convertToBlocks converts size correctly for words', () => {
    expect(convertToBlocks(1024, 'words', 16)).toBe(64);
});

test('convertToBlocks does not change size if unit is not words', () => {
    expect(convertToBlocks(64, 'blocks', 16)).toBe(64);
});

test('convertProgramFlowToBlocks converts program flow correctly for words', () => {
    const programFlow = [0, 16, 32, 48];
    const result = convertProgramFlowToBlocks(programFlow, 'words', 16);
    expect(result).toEqual({
        PFlowConverted: [0, 1, 2, 3],
        PFlowOffset: [0, 0, 0, 0],
    });
});

test('convertProgramFlowToBlocks does not change program flow if unit is blocks', () => {
    const programFlow = [0, 1, 2, 3];
    const result = convertProgramFlowToBlocks(programFlow, 'blocks', 16);
    expect(result).toEqual({
        PFlowConverted: [0, 1, 2, 3],
        PFlowOffset: [],
    });
});

// Mock DOM and test simulateCache function
document.getElementById = jest.fn((id) => {
    const elements = {
        memoryAccessTime: { value: '100' },
        blockSize: { value: '16' },
        mmSize: { value: '1024' },
        cacheSize: { value: '64' },
        programFlow: { value: '0,16,32,48' },
        hits: { textContent: '' },
        misses: { textContent: '' },
        missPenalty: { textContent: '' },
        averageMemoryAccessTime: { textContent: '' },
        totalMemoryAccessTime: { textContent: '' },
        cacheSnapshot: { textContent: '' },
    };
    return elements[id];
});

document.querySelector = jest.fn((selector) => {
    const elements = {
        'input[name="mmSizeUnit"]:checked': { value: 'words' },
        'input[name="cacheSizeUnit"]:checked': { value: 'blocks' },
        'input[name="programFlowUnit"]:checked': { value: 'words' },
    };
    return elements[selector];
});

test('simulateCache performs computations correctly', () => {
    simulateCache();

    expect(document.getElementById('hits').textContent).toBe('Hits: ...');
    expect(document.getElementById('misses').textContent).toBe('Misses: ...');
    expect(document.getElementById('missPenalty').textContent).toBe('Miss Penalty: ...');
    expect(document.getElementById('averageMemoryAccessTime').textContent).toBe('Average Memory Access Time: ...');
    expect(document.getElementById('totalMemoryAccessTime').textContent).toBe('Total Memory Access Time: ...');
    expect(document.getElementById('cacheSnapshot').textContent).toBe('Cache Snapshot: ...');
});
