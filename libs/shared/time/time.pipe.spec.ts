import { TimePipe } from './time.pipe';

describe('TimePipe', () => {
  it('create an instance', () => {
    const pipe = new TimePipe();
    expect(pipe).toBeTruthy();
  });

  it('應轉換秒數至小時分鐘', () => {
    const pipe = new TimePipe();
    expect(pipe.transform(8100)).toContain('2 小時 15 分鐘');
  });

  it('應轉換秒數至小時', () => {
    const pipe = new TimePipe();
    expect(pipe.transform(3600)).toContain('1 小時');
  });

  it('應轉換秒數至分鐘', () => {
    const pipe = new TimePipe();
    expect(pipe.transform(3120)).toContain('52 分鐘');
  });
});
