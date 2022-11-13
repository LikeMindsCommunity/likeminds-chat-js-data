import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
    slides = [
        {
            img: 'assets/images/svg/intro_slide_1.svg',
            title: 'Welcome to LikeMinds',
            desc: 'Engage in conversations and build meaningful relationships in premium communities.',
        },
        {
            img: 'assets/images/png/login_page_image-2.png',
            title: 'Chat rooms',
            desc: 'Group chats around a particular topic, event or and opinion poll.',
        },
        {
            img: 'assets/images/png/tutorial-3.png',
            title: 'Community Feed',
            desc: 'Feed contains all the chat rooms of the community. Follow the relevant ones to track and participate in real time.',
        },
    ];

    constructor() {}

    ngOnInit(): void {}
}
