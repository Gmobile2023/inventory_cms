import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
    name: 'luxonFormat',
})
export class LuxonFormatPipe implements PipeTransform {
    transform(value: any, format: string): string {
        if (!value) {
            return '';
        }
        // Nếu value là chuỗi, chuyển đổi sang DateTime
        const dateTime = typeof value === 'string' ? DateTime.fromISO(value) : value;

        if (!dateTime.isValid) {
            console.error('Invalid date value:', value);
            return '';
        }

        return dateTime.toFormat(format); // Áp dụng định dạng
    }
}
