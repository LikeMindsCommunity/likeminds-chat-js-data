import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

import { MIXPANEL } from './enums/mixpanel.enum';
import { PREVIEW_TYPE } from './enums/message-type.enum';
import { CHATROOM_TYPE_MAP } from './constants/app-constant';
import { COLLABCARD_PATH, COMMUNITY_DETAIL_PATH, MEMBER_DIRECTORY_PATH, ROOT_PATH } from './constants/routes.constant';
import { CookieService } from 'ngx-cookie-service';

export function trimSpace(str: string): string {
    return str && String(str).trim();
}

export function trimSpecialChar(str: string): string {
    return String(str).replace(/[^0-9]/g, '');
}

export function getDevice() {
    return window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
}

export function createCommunityUrl({ communityId, aj }): string {
    let url = `/${COMMUNITY_DETAIL_PATH}/${communityId}`;
    if (aj) {
        url = `${url}?aj=${aj}`;
    }
    return url;
}

export function noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
}

export function emailPattern(): RegExp {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}

export function urlPattern(): RegExp {
    return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,50}\b([-a-zA-Z0-9@:%_\+.~#?&=/]*)/ig;
}

export function isInternalLink(link: String) {
    let match = false;
    for (let l of ['collabmates.app.link', 'likeminds.app.link', 'beta.likeminds.community', 'likeminds.community', 'www.likeminds.community']) {
        if (link.toLowerCase().includes(l)) {
            match = true;
            break;
        }
    }
    return match;
}

export function validURL(str) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(str);
}

export function profileUrlPattern(): RegExp {
    return /^(http:\/\/|https:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/;
}

export function maskNumber(num: string | number): string {
    if (!num) {
        return;
    }
    const str = String(num).match(/(\d{3})(\d{3})(\d{4})/);
    return `*** *** ${str[3]}`;
}

export function facebookLinkValidators(control: FormControl) {
    const FACEBOOK_STRING = 'facebook';
    const FB_STRING = 'fb';
    if (!control.value) {
        return null;
    }
    if (control.value.toLowerCase().indexOf(FACEBOOK_STRING) < 0 && control.value.toLowerCase().indexOf(FB_STRING) < 0) {
        return { pattern: true };
    }
    if (control.value.toLowerCase().indexOf(FACEBOOK_STRING) > -1 || control.value.toLowerCase().indexOf(FB_STRING) > -1) {
        return null;
    }
}

export function profileUrlValidator(control: FormControl) {
    const patternProfile: RegExp = /www\.|http:\/\/|https:\/\//;
    const patternUrl: RegExp = urlPattern();
    if (!control.value) {
        return null;
    }
    if (!patternProfile.test(control.value)) {
        return { invalid: true };
    }
    if (!patternUrl.test(control.value)) {
        return { pattern: true };
    }
    if (patternProfile.test(control.value) && patternUrl.test(control.value)) {
        return null;
    }
}

export function linkedinLinkValidators(control: FormControl) {
    const LINKEDIN_STRING = 'linkedin';
    if (!control.value) {
        return null;
    }
    if (control.value.toLowerCase().indexOf(LINKEDIN_STRING) < 0) {
        return { pattern: true };
    }
    if (control.value.toLowerCase().indexOf(LINKEDIN_STRING) > -1) {
        return null;
    }
}

export function usernameValidator(control: FormControl) {
    const patternProfile: RegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    if (!control.value) {
        return null;
    }
    if (!patternProfile.test(control.value)) {
        return { pattern: true };
    }
    if (patternProfile.test(control.value)) {
        return null;
    }
}

export function maskEmail(email: string): string {
    const skipFirstChars = 3;
    const firstThreeChar = email.slice(0, skipFirstChars);

    const domainIndexStart = email.lastIndexOf('@');
    let maskedEmail = email.slice(skipFirstChars, domainIndexStart);
    maskedEmail = maskedEmail.replace(/./g, '*');
    const domain = email.slice(domainIndexStart, email.length);

    return firstThreeChar.concat(maskedEmail).concat(domain);
}

function getMsakedEmail2(email) {
    const skipFirstChars = 3;
    const firstThreeChar = email.slice(0, skipFirstChars);

    const domainIndexStart = email.lastIndexOf('@');
    let maskedEmail = email.slice(skipFirstChars, domainIndexStart - 1);
    maskedEmail = maskedEmail.replace(/./g, '*');
    const domainPlusPreviousChar = email.slice(domainIndexStart - 1, email.length);

    return firstThreeChar.concat(maskedEmail).concat(domainPlusPreviousChar);
}

export function queryParams(url: string): any {
    const obj: any = {};
    const paramsArray: string[] = url && String(url).split('?')[0].split('/');
    const querryArray: string[] = url && String(url).split('?')[1] && String(url).split('?')[1].split('&');
    const communityId = paramsArray[paramsArray.length - 1];
    const queryObj =
        querryArray &&
        querryArray.length &&
        querryArray.reduce((items, item) => {
            const param = String(item).split('=');
            items = { ...items, [param[0]]: param[1] };
            return items;
        }, {});
    if (parseInt(communityId)) {
        obj.communityId = parseInt(communityId);
    }
    return { ...obj, ...queryObj };
}

export function queryString(isNew, queryParams: any) {
    if (!queryParams) {
        return;
    } else {
        let str = '';
        for (const param in queryParams) {
            str = `${str}${isNew && !str.includes('?') ? '?' : '&'}${param}=${queryParams[param]}`;
        }
        return str;
    }
}

export function createWebUrlForHomeFeed(
    routeString,
    previewType,
    sourceChatroomId = 0,
    sourceCommunityId = 0,
    source_analytics?,
    intro_source_analytics?
): any {
    if (!routeString || !previewType) {
        return;
    }

    const parsedUrl = new URL(routeString);
    switch (previewType) {
        case PREVIEW_TYPE.CHATROOM:
            const collabcardId = parsedUrl.searchParams.get('collabcard_id');

            const payload = {
                path: [sourceCommunityId, COLLABCARD_PATH, collabcardId],
                queryParams: {
                    aj: parsedUrl.searchParams.get('aj') || null,
                    source_id: parsedUrl.searchParams.get('source_id') || null,
                    source: 'internal_link',
                    source_community_id: sourceChatroomId,
                    source_chatroom_id: sourceCommunityId,
                },
            };
            if (source_analytics) payload.queryParams['source_analytics'] = source_analytics;
            if (intro_source_analytics) payload.queryParams['intro_source_analytics'] = intro_source_analytics;

            return collabcardId ? payload : null;

        case PREVIEW_TYPE.COMMUNITY:
            const communityId = parsedUrl.searchParams.get('community_id');
            return communityId
                ? {
                    path: [COMMUNITY_DETAIL_PATH, communityId],
                    queryParams: {
                        aj: parsedUrl.searchParams.get('aj') || null,
                        source_id: parsedUrl.searchParams.get('shared_by') || parsedUrl.searchParams.get('source_id') || null,
                        source: 'internal_link',
                        source_community_id: sourceChatroomId,
                        source_chatroom_id: sourceCommunityId,
                    },
                }
                : null;
        case PREVIEW_TYPE.DIRECTORY:
            const directoryCommunityId = parsedUrl.searchParams.get('community_id');
            return directoryCommunityId
                ? {
                    path: [MEMBER_DIRECTORY_PATH, directoryCommunityId],
                    queryParams: {
                        aj: parsedUrl.searchParams.get('aj') || null,
                        source_id: parsedUrl.searchParams.get('shared_by') || parsedUrl.searchParams.get('source_id') || null,
                        source: 'internal_link',
                        source_community_id: sourceChatroomId,
                        source_chatroom_id: sourceCommunityId,
                    },
                }
                : null;
        default:
            return;
    }
}

export function createWebUrl(
    routeString,
    previewType,
    sourceChatroomId = 0,
    sourceCommunityId = 0,
    source_analytics?,
    intro_source_analytics?
): any {
    if (!routeString || !previewType) {
        return;
    }

    const parsedUrl = new URL(routeString);
    switch (previewType) {
        case PREVIEW_TYPE.CHATROOM:
            const collabcardId = parsedUrl.searchParams.get('collabcard_id');

            const payload = {
                path: [sourceCommunityId, COLLABCARD_PATH, collabcardId],
                queryParams: {
                    aj: parsedUrl.searchParams.get('aj') || null,
                    source_id: parsedUrl.searchParams.get('source_id') || null,
                    source: 'internal_link',
                    source_community_id: sourceChatroomId,
                    source_chatroom_id: sourceCommunityId,
                },
            };

            if (source_analytics) payload.queryParams['source_analytics'] = source_analytics;
            if (intro_source_analytics) payload.queryParams['intro_source_analytics'] = intro_source_analytics;

            return collabcardId ? payload : null;

        case PREVIEW_TYPE.COMMUNITY:
            const communityId = parsedUrl.searchParams.get('community_id');
            return communityId
                ? {
                    path: [COMMUNITY_DETAIL_PATH, communityId],
                    queryParams: {
                        aj: parsedUrl.searchParams.get('aj') || null,
                        source_id: parsedUrl.searchParams.get('shared_by') || parsedUrl.searchParams.get('source_id') || null,
                        source: 'internal_link',
                        source_community_id: sourceChatroomId,
                        source_chatroom_id: sourceCommunityId,
                    },
                }
                : null;
        case PREVIEW_TYPE.DIRECTORY:
            const directoryCommunityId = parsedUrl.searchParams.get('community_id');
            return directoryCommunityId
                ? {
                    path: [MEMBER_DIRECTORY_PATH, directoryCommunityId],
                    queryParams: {
                        aj: parsedUrl.searchParams.get('aj') || null,
                        source_id: parsedUrl.searchParams.get('shared_by') || parsedUrl.searchParams.get('source_id') || null,
                        source: 'internal_link',
                        source_community_id: sourceChatroomId,
                        source_chatroom_id: sourceCommunityId,
                    },
                }
                : null;
        default:
            return;
    }
}

export function createMixPanelPayload(preview): any {
    let eventName = MIXPANEL.INTERNAL_CHATROOM_LINK_CLICKED;
    let payload = {};
    switch (preview.preview_type) {
        case PREVIEW_TYPE.CHATROOM:
            eventName = MIXPANEL.INTERNAL_CHATROOM_LINK_CLICKED;
            payload = {
                chatroom_type: CHATROOM_TYPE_MAP[preview.chatroom.type],
            };
            break;
        case PREVIEW_TYPE.COMMUNITY:
            eventName = MIXPANEL.INTERNAL_COMMUNITY_LINK_CLICKED;
            let communityButtonType = '';
            if (preview.action === 'VIEW COMMUNITY') {
                communityButtonType = 'view_community';
            } else if (preview.action === 'JOIN COMMUNITY') {
                communityButtonType = 'join_community';
            }
            payload = {
                button_type: communityButtonType,
            };
            break;
        case PREVIEW_TYPE.DIRECTORY:
            eventName = MIXPANEL.INTERNAL_DIRECTORY_LINK_CLICKED;
            let directoryButtonType = '';
            if (preview.action === 'VIEW DIRECTORY') {
                directoryButtonType = 'view_directory';
            } else if (preview.action === 'JOIN COMMUNITY') {
                directoryButtonType = 'join_community';
            }
            payload = {
                button_type: directoryButtonType,
            };
            break;
    }

    return {
        eventName,
        payload,
    };
}

export function copyTextToClipboard(text): Observable<boolean> {
    if (!navigator.clipboard) {
        return fallbackCopyTextToClipboard(text);
    }
    return fromPromise(
        navigator.clipboard.writeText(text).then(
            (_) => {
                return true;
            },
            (_) => {
                return false;
            }
        )
    );
}

function fallbackCopyTextToClipboard(text): Observable<boolean> {
    let successful = false;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        successful = document.execCommand('copy');
    } catch (err) {
        successful = false;
    }

    document.body.removeChild(textArea);
    return of(successful);
}

export function readFileContent(file): any {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

export function checkIfEmailIsCorrect(email){
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.trim().match(validRegex)) {
      return true
    }
    else{
      return false
    }
  }
