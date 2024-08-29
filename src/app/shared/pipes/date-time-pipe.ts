import { DatePipe } from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateTime',
    standalone: true,
    pure: true
})
export class DateTimePipe extends DatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const now = new Date();
            const valueDate = new Date(value);
            
            const seconds = Math.floor((+now - +valueDate) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'Just now';
            
            if(now.getDay() - valueDate.getDay() > 0) {
                return super.transform(valueDate.toLocaleDateString(), "MMM d, y");
            }

            return super.transform(valueDate.getTime(), "h:mm a");
        }
        return value;
    }

}