import { MemoryPipe } from './memory.pipe';

describe('MemoryPipe', () => {
  it('create an instance', () => {
    const pipe = new MemoryPipe();
    expect(pipe).toBeTruthy();
  });
});
