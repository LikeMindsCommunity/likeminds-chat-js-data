import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ResizeService } from 'src/app/core/services/resize.service';
import { SCREEN_SIZE } from 'src/app/shared/enums/screen-size.enum';

@Component({
    selector: 'app-size-detector',
    templateUrl: './size-detector.component.html'
})
export class SizeDetectorComponent implements AfterViewInit {
    prefix = 'is-';
    sizes = [
        {
            id: SCREEN_SIZE.XS, name: 'xs',
            css: `d-block d-sm-none`
        },
        {
            id: SCREEN_SIZE.SM, name: 'sm',
            css: `d-none d-sm-block d-md-none`
        },
        {
            id: SCREEN_SIZE.MD, name: 'md',
            css: `d-none d-md-block d-lg-none`
        },
        {
            id: SCREEN_SIZE.LG, name: 'lg',
            css: `d-none d-lg-block d-xl-none`
        },
        {
            id: SCREEN_SIZE.XL, name: 'xl',
            css: `d-none d-xl-block`
        },
    ];

    constructor(private elementRef: ElementRef, private resizeSvc: ResizeService) { }

    @HostListener("window:resize", [])
    private onResize() {
        this.detectScreenSize();
    }

    ngAfterViewInit() {
        this.detectScreenSize();
    }

    private detectScreenSize() {
        const screenSize = window && window.innerWidth;
        if (screenSize <= 425) {
            this.resizeSvc.onResize('XS');
            return;
        }
        if (screenSize > 425 && screenSize <= 768) {
            this.resizeSvc.onResize('SM');
            return;
        }
        if (screenSize > 768 && screenSize <= 1024) {
            this.resizeSvc.onResize('MD');
            return;
        }
        if (screenSize > 1024) {
            this.resizeSvc.onResize('LG');
            return;
        }
    }

}