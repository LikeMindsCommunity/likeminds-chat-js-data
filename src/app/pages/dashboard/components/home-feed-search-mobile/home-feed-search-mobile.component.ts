import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { debounce } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommunityService } from 'src/app/core/services/community.service';

const SEARCH_TYPE = ['header', 'title'];
const PAGE_SIZE = 300;
const API_ORDER_PAGE_DETAILS = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
};

@Component({
    selector: 'app-home-feed-search-mobile',
    templateUrl: './home-feed-search-mobile.component.html',
    styleUrls: ['./home-feed-search-mobile.component.scss'],
})
export class HomeFeedSearchMobileComponent implements OnInit, OnDestroy {
    showSearchList: boolean = false;
    clearMobileSearchInput: boolean = false;
    searchValue: string = '';
    searchResultsChatrooms: any[] = [];
    searchResultsConversations: any[] = [];
    currentCommunityData: any = null;
    apiOrderNo: number = 0;
    apiOrderPageDetails = API_ORDER_PAGE_DETAILS;
    apiOrderFetchingComplete: boolean = false;
    isLoading: boolean = false;
    @Output() closeMobileSearch: EventEmitter<any> = new EventEmitter();

    destroy$$ = new Subject();

    constructor(private communityService: CommunityService) {}

    ngOnInit(): void {
        this.handleSearch = debounce(this.handleSearch, 500);
        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (data !== null) this.currentCommunityData = data;
        });
    }

    handleSearchResultsList(value) {
        if (value && this.searchValue) this.showSearchList = true;
        else this.showSearchList = false;
    }

    clearInput() {
        this.searchValue = '';
        this.showSearchList = false;
    }

    getFollowedChatroomsSearchTypeHeader() {
        this.apiOrderPageDetails = { ...this.apiOrderPageDetails, 1: this.apiOrderPageDetails[1] + 1 };

        const queryParams = {
            search: this.searchValue,
            follow_status: true,
            page: this.apiOrderPageDetails[1],
            page_size: PAGE_SIZE,
            community_id: this.currentCommunityData?.id,
            search_type: SEARCH_TYPE[0],
        };
        this.communityService
            .getSearchListChatrooms(queryParams)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.apiOrderNo = 1;
                const chatroomHeaders = res.chatrooms.map((chatroom) => ({
                    id: chatroom.id,
                    header: chatroom.chatroom.header,
                    follow_status: true,
                    member_id: chatroom.member.id,
                    member_name: chatroom.member.profile.name.split(' ')[0],
                    is_secret: chatroom.chatroom.is_secret,
                    chatroom_type: chatroom.chatroom.type,
                    chatroom_id: chatroom.chatroom.id,
                    community_id: chatroom.community.id,
                }));
                this.searchResultsChatrooms = [...this.searchResultsChatrooms, ...chatroomHeaders];

                if (res.chatrooms?.length < PAGE_SIZE) this.getUnfollowedChatroomsSearchTypeHeader();
                // if (res.chatrooms?.length < PAGE_SIZE) true;
                else {
                    this.showSearchList = true;
                    this.isLoading = false;
                }
            });
    }

    getUnfollowedChatroomsSearchTypeHeader() {
        this.apiOrderPageDetails = { ...this.apiOrderPageDetails, 2: this.apiOrderPageDetails[2] + 1 };

        const queryParams = {
            search: this.searchValue,
            follow_status: false,
            page: this.apiOrderPageDetails[2],
            page_size: PAGE_SIZE,
            community_id: this.currentCommunityData?.id,
            search_type: SEARCH_TYPE[0],
        };
        this.communityService
            .getSearchListChatrooms(queryParams)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.apiOrderNo = 2;
                const chatroomHeaders = res.chatrooms.map((chatroom) => ({
                    id: chatroom.id,
                    header: chatroom.chatroom.header,
                    follow_status: false,
                    member_id: chatroom.member.id,
                    member_name: chatroom.member.profile.name.split(' ')[0],
                    is_secret: chatroom.chatroom.is_secret,
                    chatroom_type: chatroom.chatroom.type,
                    chatroom_id: chatroom.chatroom.id,
                    community_id: chatroom.community.id,
                }));
                this.searchResultsChatrooms = [...this.searchResultsChatrooms, ...chatroomHeaders];

                if (res.chatrooms?.length < PAGE_SIZE) this.getFollowedChatroomsSearchTypeTitle();
                else {
                    this.showSearchList = true;
                    this.isLoading = false;
                }
            });
    }

    getFollowedChatroomsSearchTypeTitle() {
        this.apiOrderPageDetails = { ...this.apiOrderPageDetails, 3: this.apiOrderPageDetails[3] + 1 };

        const queryParams = {
            search: this.searchValue,
            follow_status: true,
            page: this.apiOrderPageDetails[3],
            page_size: PAGE_SIZE,
            community_id: this.currentCommunityData?.id,
            search_type: SEARCH_TYPE[1],
        };
        this.communityService
            .getSearchListChatrooms(queryParams)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.apiOrderNo = 3;
                const conversationObjs = res.chatrooms.map((chatroom) => ({
                    id: chatroom.id,
                    header: chatroom.chatroom.header,
                    text: chatroom.chatroom.title,
                    follow_status: true,
                    member_id: chatroom.member.id,
                    member_name: chatroom.member.profile.name.split(' ')[0],
                    is_secret: chatroom.chatroom.is_secret,
                    chatroom_type: chatroom.chatroom.type,
                    chatroom_id: chatroom.chatroom.id,
                    community_id: chatroom.community.id,
                }));
                this.searchResultsConversations = [...this.searchResultsConversations, ...conversationObjs];

                if (res.chatrooms?.length < PAGE_SIZE) this.getFollowedConversations();
                else {
                    this.showSearchList = true;
                    this.isLoading = false;
                }
            });
    }

    getFollowedConversations() {
        this.apiOrderPageDetails = { ...this.apiOrderPageDetails, 4: this.apiOrderPageDetails[4] + 1 };

        const queryParams = {
            search: this.searchValue,
            follow_status: true,
            page: this.apiOrderPageDetails[4],
            page_size: PAGE_SIZE,
            community_id: this.currentCommunityData?.id,
        };
        this.communityService
            .getSearchListConversations(queryParams)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.apiOrderNo = 4;
                const conversationObjs = res.conversations.map((conversation) => ({
                    id: conversation.id,
                    conversation_id: conversation.id,
                    header: conversation.chatroom.header,
                    text: conversation.answer,
                    follow_status: true,
                    member_id: conversation.member.id,
                    member_name: conversation.member.profile.name.split(' ')[0],
                    is_secret: conversation.chatroom.is_secret,
                    chatroom_type: conversation.chatroom.type,
                    chatroom_id: conversation.chatroom.id,
                    community_id: conversation.community.id,
                }));
                this.searchResultsConversations = [...this.searchResultsConversations, ...conversationObjs];

                if (res.conversations?.length < PAGE_SIZE) this.getUnfollowedChatroomsSearchTypeTitle();
                else {
                    this.showSearchList = true;
                    this.isLoading = false;
                }
            });
    }

    getUnfollowedChatroomsSearchTypeTitle() {
        this.apiOrderPageDetails = { ...this.apiOrderPageDetails, 5: this.apiOrderPageDetails[5] + 1 };

        const queryParams = {
            search: this.searchValue,
            follow_status: false,
            page: this.apiOrderPageDetails[5],
            page_size: PAGE_SIZE,
            community_id: this.currentCommunityData?.id,
            search_type: SEARCH_TYPE[1],
        };
        this.communityService
            .getSearchListChatrooms(queryParams)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.apiOrderNo = 5;
                const conversationObjs = res.chatrooms.map((chatroom) => ({
                    id: chatroom.id,
                    header: chatroom.chatroom.header,
                    text: chatroom.chatroom.title,
                    follow_status: false,
                    member_id: chatroom.member.id,
                    member_name: chatroom.member.profile.name.split(' ')[0],
                    is_secret: chatroom.chatroom.is_secret,
                    chatroom_type: chatroom.chatroom.type,
                    chatroom_id: chatroom.chatroom.id,
                    community_id: chatroom.community.id,
                }));
                this.searchResultsConversations = [...this.searchResultsConversations, ...conversationObjs];

                if (res.chatrooms?.length < PAGE_SIZE) this.getUnfollowedConversations();
                else {
                    this.showSearchList = true;
                    this.isLoading = false;
                }
            });
    }

    getUnfollowedConversations() {
        this.apiOrderPageDetails = { ...this.apiOrderPageDetails, 6: this.apiOrderPageDetails[6] + 1 };

        const queryParams = {
            search: this.searchValue,
            follow_status: false,
            page: this.apiOrderPageDetails[6],
            page_size: PAGE_SIZE,
            community_id: this.currentCommunityData?.id,
        };
        this.communityService
            .getSearchListConversations(queryParams)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.apiOrderNo = 6;
                const conversationObjs = res.conversations.map((conversation) => ({
                    id: conversation.id,
                    conversation_id: conversation.id,
                    header: conversation.chatroom.header,
                    text: conversation.answer,
                    follow_status: false,
                    member_id: conversation.member.id,
                    member_name: conversation.member.profile.name.split(' ')[0],
                    is_secret: conversation.chatroom.is_secret,
                    chatroom_type: conversation.chatroom.type,
                    chatroom_id: conversation.chatroom.id,
                    community_id: conversation.community.id,
                }));
                this.searchResultsConversations = [...this.searchResultsConversations, ...conversationObjs];
                this.showSearchList = true;
                this.isLoading = false;

                if (res.conversations?.length < PAGE_SIZE) this.apiOrderFetchingComplete = true;
            });
    }

    resetSearchResults() {
        this.searchResultsChatrooms = [];
        this.searchResultsConversations = [];
        this.apiOrderFetchingComplete = false;
        this.apiOrderPageDetails = API_ORDER_PAGE_DETAILS;
    }

    handleSearch(e) {
        if (this.searchValue) {
            this.isLoading = true;
            this.resetSearchResults();
            this.getFollowedChatroomsSearchTypeHeader();
        } else {
            this.showSearchList = false;
            this.resetSearchResults();
        }
    }

    onScroll() {
        switch (this.apiOrderNo) {
            case 1:
                this.getFollowedChatroomsSearchTypeHeader();
                break;
            case 2:
                this.getUnfollowedChatroomsSearchTypeHeader();
                break;
            case 3:
                this.getFollowedChatroomsSearchTypeTitle();
                break;
            case 4:
                this.getFollowedConversations();
                break;
            case 5:
                this.getUnfollowedChatroomsSearchTypeTitle();
                break;
            case 6:
                if (!this.apiOrderFetchingComplete) this.getUnfollowedConversations();
                break;
            default:
                break;
        }
    }

    handleMobileSearch(e, value?) {
        const classList = e?.target?.classList?.value;
        if (!(classList?.includes('header__actions__search-icon') || classList?.includes('header-search-mobile__clear'))) {
            this.closeMobileSearch.emit();
            this.handleSearchResultsList(false);
        }
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}
