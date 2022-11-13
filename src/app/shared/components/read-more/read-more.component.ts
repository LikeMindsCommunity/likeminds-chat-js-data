import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
    selector: 'read-more',
    templateUrl: './read-more.component.html',
    styleUrls: ['./read-more.component.scss']
})

export class ReadMoreComponent implements OnChanges {
    @Input() data: string;
    @Input() classes: string;
    @Input() characterCount: number = 25;
    showMore = false;
    dataLength: number;
    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && changes.data.currentValue) this.dataLength = String(this.data).split(' ').length;
    }

    toggleShowMore() {
        this.showMore = !this.showMore;
    }
}