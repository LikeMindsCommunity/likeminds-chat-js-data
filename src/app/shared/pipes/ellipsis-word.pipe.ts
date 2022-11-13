import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'ellipsisWord'
})

export class EllipsisWordPipe implements PipeTransform {
    transform(value: string, characterCount: number) {
        if (!value) return;
        if (value.length <= characterCount) return value;
        else return value.slice(0, characterCount) + '...';
    }
}