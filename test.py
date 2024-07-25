class CacheSimulator:
    def __init__(self, block_size, mm_size, cache_size, program_flow):
        self.block_size = block_size
        self.mm_size = mm_size
        self.cache_size = cache_size
        self.program_flow = program_flow
        self.cache = []
        self.hits = 0
        self.misses = 0
        self.access_order = []

    def access_memory(self, block):
        if block in self.cache:
            self.hits += 1
            self.access_order.remove(block)
            self.access_order.append(block)
        else:
            self.misses += 1
            if len(self.cache) >= self.cache_size:
                mru_block = self.access_order.pop()
                self.cache.remove(mru_block)
            self.cache.append(block)
            self.access_order.append(block)

    def simulate(self):
        for block in self.program_flow:
            self.access_memory(block)

    def calculate_times(self):
        miss_penalty = (block_size*10) + 2 
        total_accesses = self.hits + self.misses
        total_memory_access_time = (self.hits*2*1) + (self.misses*block_size*11) +(self.misses*1)  #hits*2*1 + miss*block_size*10+1 + miss*1
        average_memory_access_time = (self.hits/total_accesses) + (self.misses/total_accesses) * miss_penalty #hit rate + miss rate * miss penalty
        return total_memory_access_time, average_memory_access_time

    def snapshot_cache(self):
        return self.cache

    def output_results(self, filename=None):
        total_time, avg_time = self.calculate_times()
        results = (
            f"Cache Hits: {self.hits}\n"
            f"Cache Misses: {self.misses}\n"
            f"Total Memory Access Time: {total_time}\n"
            f"Average Memory Access Time: {avg_time}\n"
            f"Cache Snapshot: {self.snapshot_cache()}\n"
        )
        print(results)
        if filename:
            with open(filename, 'w') as f:
                f.write(results)


# Example usage
block_size = 2
mm_size = 256  # in blocks
cache_size = 4  # in blocks
program_flow = [1,7,5,0,2,1,5,6,5,2,2,0]  # example sequence of block accesses

simulator = CacheSimulator(block_size, mm_size, cache_size, program_flow)
simulator.simulate()
simulator.output_results("cache_simulation_results.txt")
