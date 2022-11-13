import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IntroExample } from 'src/app/shared/models/user.model';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { getIntroExamples } from 'src/app/shared/store/selectors/community.selector';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
    selector: 'app-hint',
    templateUrl: './hint.component.html',
    styleUrls: ['./hint.component.scss'],
})
export class HintComponent implements OnInit {
    @Output() close: EventEmitter<any> = new EventEmitter();

    selectedIndex = 0;
    selectedIntro: IntroExample;
    introExamples: IntroExample[] = [];
    subscription: Subscription;
    @ViewChild('prevButton') prevButton: ElementRef;
    @ViewChild('nextButton') nextButton: ElementRef;

    customOptionsWeb: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        navSpeed: 700,
        autoplay: false,
        autoplaySpeed: 2000,
        navText: [
            `<img src="https://web.likeminds.community/assets/images/svg/left-arrow-white.svg"/>`,
            `<img src="https://web.likeminds.community/assets/images/svg/right-arrow-white.svg"/>`,
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
    };

    constructor(private store: Store<State>) {}

    ngOnInit() {
        this.subscription = this.store.pipe(select(getIntroExamples)).subscribe((intros) => {
            if (!intros) return;
            this.introExamples = intros;
            this.selectedIntro = this.introExamples[this.selectedIndex];
        });
    }

    next() {
        this.nextButton.nativeElement.click();
    }

    previous() {
        if (this.selectedIndex === 0) this.selectedIndex = this.introExamples.length;
        this.selectedIndex -= 1;
        this.selectedIntro = this.introExamples[this.selectedIndex];
    }

    onSwipe(event) {
        const swipe = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
        if (swipe === 'right') this.prevButton.nativeElement.click();
        else if (swipe === 'left') this.nextButton.nativeElement.click();
    }

    changeSelectedIndex(action) {
        let len = this.introExamples.length;
        if (action === 'next') {
            if (this.selectedIndex < len - 1) {
                this.selectedIndex = this.selectedIndex + 1;
            } else if (this.selectedIndex === len - 1) {
                this.selectedIndex = 0;
            }
        }

        if (action === 'previous') {
            if (this.selectedIndex > 0) {
                this.selectedIndex = this.selectedIndex - 1;
            } else if (this.selectedIndex === 0) {
                this.selectedIndex = len - 1;
            }
        }
    }

    closeModal() {
        this.close.emit();
    }
}
