import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(totalSeconds: any, args?: any): any {
    const dnn = Math.floor(totalSeconds / 86400);
    let hnn = 0,
      mnn = 0,
      snn = 0,
      result = '';
    totalSeconds -= dnn * 86400;
    hnn = Math.floor(totalSeconds / 3600);
    totalSeconds -= hnn * 3600;
    mnn = Math.floor(totalSeconds / 60);
    totalSeconds -= mnn * 60;
    snn = totalSeconds;

    if (hnn > 0) {
      result = `${hnn} 小時 `;
    }
    if (mnn > 0) {
      result += `${mnn} 分鐘`;
    }

    return result;
  }
}
