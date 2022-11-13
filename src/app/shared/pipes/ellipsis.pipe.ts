import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'ellipsis'
})

export class EllipsisPipe implements PipeTransform {
    transform(value: string, showMore: boolean, characterCount: number) {
        if (!value) return;
        let textArray = String(value).split(' ');
        if (textArray.length <= characterCount || showMore) return value;
        else return textArray.slice(0, characterCount).join(' ');
    }
}