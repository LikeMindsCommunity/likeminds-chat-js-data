import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DEFAULT_PROFILE_PHOTO_LINK } from '../../constants/api.constant';

@Component({
    selector: 'app-multi-part-image',
    templateUrl: './multi-part-image.component.html',
    styleUrls: ['./multi-part-image.component.scss'],
})
export class MultiPartImageComponent implements OnInit {
    public circleColor: string;
    private colors = [
        '#B71C1C', //red
        '#880E4F', //pink
        '#4A148C', //Purple
        '#311B92', //Deep Purple
        '#1A237E', //Indigo
        '#0D47A1', //Blue
        '#01579B', //Light Blue
        '#006064', //Cyan
        '#004D40', //Teal
        '#1B5E20', //Green
        '#33691E', //Light Green
        '#827717', //Lime
        '#F57F17', //Yellow
        '#FF6F00', //Amber
        '#E65100', //Orange
        '#BF360C', //Deep Orange
        '#3E2723', //Brown
    ];

    @Input() data: any[];
    @Input() size: string;
    imgInit1;
    imgInitShow1: boolean = true;

    imgInit2;
    imgInitShow2: boolean = true;

    imgInit3;
    imgInitShow3: boolean = true;

    constructor() {}

    ngOnInit(): void {
        if (!this.data || this.data.length === 0) {
            this.data = [
                {
                    image_url: 'https://web.likeminds.community/assets/images/svg/profile-img-bg-gray.svg',
                    name: 'default-image',
                },
            ];
        }
    }

    setDefaultPic1(evt, name): void {
        evt.target.src = DEFAULT_PROFILE_PHOTO_LINK;
        this.imgInit1 = this.userInit(name);
        this.imgInitShow1 = false;
    }

    setDefaultPic2(evt, name): void {
        evt.target.src = DEFAULT_PROFILE_PHOTO_LINK;
        this.imgInitShow2 = false;
        this.imgInit2 = this.userInit(name);
    }

    setDefaultPic3(evt, name): void {
        evt.target.src = DEFAULT_PROFILE_PHOTO_LINK;
        this.imgInitShow3 = false;
        this.imgInit3 = this.userInit(name);
    }

    userInit(name) {
        this.circleColor = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
        let initials = '';
        let namesList = name.split(' ');
        for (let name of namesList) {
            if (name[0] !== ' ' && name[0]) {
                initials += name[0]?.toUpperCase();
                if (initials.length === 2) break;
            }
        }
        return initials;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.circleColor = '';
        if (this.data.length == 1) this.imgInitShow1 = true;
    }
}
