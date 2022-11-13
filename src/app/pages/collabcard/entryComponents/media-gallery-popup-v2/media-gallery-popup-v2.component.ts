import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { IUser } from '../../../../shared/models/user.model';

// this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

@Component({
    selector: 'app-media-gallery-popup-v2',
    templateUrl: './media-gallery-popup-v2.component.html',
    styleUrls: ['./media-gallery-popup-v2.component.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class MediaGalleryPopupV2Component implements OnInit, AfterViewInit, OnDestroy {
    user: IUser;

    constructor(private chatroomService: ChatroomService, private localStorageService: LocalStorageService) {}

    @Input() data: { media: any; index: number; answer: string; message: any };
    @ViewChildren('videoElement') videoEl: QueryList<ElementRef>;
    @Output() popupClosed: EventEmitter<any> = new EventEmitter();
    private swipeCoord?: [number, number];
    private swipeTime?: number;
    showSingleMedia: boolean = false;
    mediaIndex: number;

    customOptionsWeb: OwlOptions;

    showThumnailImage(url: string): string {
        return `<img style = "height : 60px; width : 60px ; object-fit: fill;" src= ${url} alt="Image">`;
    }

    ngOnInit(): void {
        this.customOptionsWeb = {
            loop: false,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            center: true,
            navSpeed: 500,
            autoplay: false,
            navText: [
                `<img class="left-arrow-carousel" src ="https://web.likeminds.community/assets/images/png/sliderLeftButton.png"/>`,
                `<img class="right-arrow-carousel" src ="https://web.likeminds.community/assets/images/png/sliderRightButton.png"/>`,
            ],
            responsive: {
                0: {
                    items: 1,
                },
                400: {
                    items: 1,
                },
                740: {
                    items: 1,
                },
                940: {
                    items: 1,
                },
            },
            nav: true,
            dots: true,
            dotsData: true,
        };

        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

        this.customOptionsWeb.startPosition = this.data.index;
        if (this.data.media.length > 1) {
            this.customOptionsWeb.dotsData = true;
            this.customOptionsWeb.dots = true;
        } else {
            this.customOptionsWeb.dotsData = false;
            this.customOptionsWeb.dots = false;
        }
        this.chatroomService.closeMediaPopup$$.subscribe();
    }

    ngAfterViewInit(): void {
        let leftNavigation = document.getElementsByClassName('left-arrow-carousel')[0] as HTMLElement;
        let rightNavigation = document.getElementsByClassName('right-arrow-carousel')[0] as HTMLElement;

        document.onkeydown = checkKey;

        function checkKey(e) {
            e = e || window.event;

            if (e.keyCode == '37') {
                leftNavigation.click();
            } else if (e.keyCode == '39') {
                rightNavigation.click();
            }
        }
    }

    hideMediaPopup(): void {
        if (this.data.media.length > 1 && this.showSingleMedia) {
            this.showSingleMedia = false;
        } else {
            this.chatroomService.closeMediaPopup$$.next(false);
        }
    }

    stopMedia(event): void {
        if (this.videoEl) {
            const videoArray = this.videoEl.toArray();
            if (videoArray[event.startPosition]) {
                videoArray[event.startPosition].nativeElement.pause();
            }
        }
    }

    numberOfMedia(): string {
        if (this.showSingleMedia) {
            return `${this.mediaIndex + 1} of`;
        } else {
            return '';
        }
    }

    decreaseIndex(index: number): void {
        if (this.mediaIndex > 0) {
            this.mediaIndex -= 1;
        }
    }

    increaseIndex(): void {
        if (this.mediaIndex < this.data.media.length - 1) {
            this.mediaIndex += 1;
        }
    }

    openSingleMedia(index: number): number {
        this.mediaIndex = index;
        this.showSingleMedia = true;
        return index;
    }

    formatDate(): string {
        let uploadDate = this.data?.message.date;
        let date = new Date(Date.now());
        let currentDate = `${date.getDate()}` + ` ${date.toDateString().split(' ')[1]}` + ` ${date.getFullYear()}`;
        if (currentDate === uploadDate) {
            return 'Today';
        } else {
            return uploadDate;
        }
    }

    swipe(e: TouchEvent, when: string): void {
        const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (
                duration < 1000 && //
                Math.abs(direction[0]) > 30 && // Long enough
                Math.abs(direction[0]) > Math.abs(direction[1] * 3)
            ) {
                // Horizontal enough
                const swipe = direction[0] < 0 ? 'next' : 'previous';

                if (swipe === 'next') {
                    this.increaseIndex();
                } else if (swipe === 'previous') {
                    this.decreaseIndex(this.mediaIndex);
                }
            }
        }
    }

    ngOnDestroy() {
        this.chatroomService.openGifMedia$$.next(false);
    }
}
