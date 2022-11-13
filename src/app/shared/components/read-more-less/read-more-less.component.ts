import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
    selector: 'read-more-less',
    templateUrl: './read-more-less.component.html'
})

export class ReadMoreLessComponent implements OnChanges {
    @Input() data: string;
    @Input() classes: string;
    @Input() characterCount: number = 25;
    showMore = false;
    dataLength: number;
    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && changes.data.currentValue) this.dataLength = String(this.data).split(' ').length;
    }

    readMore() {
        this.showMore = !this.showMore;
    }
}