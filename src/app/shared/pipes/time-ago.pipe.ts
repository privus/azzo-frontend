import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    return dayjs(value).fromNow(); // exemplo: "há 2 horas"
  }
}
