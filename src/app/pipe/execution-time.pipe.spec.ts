import { ExecutionTimePipe } from './execution-time.pipe';

describe('ExecutionTimePipe', () => {
  it('create an instance', () => {
    const pipe = new ExecutionTimePipe();
    expect(pipe).toBeTruthy();
  });
});
