import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
    ChangeDetectorRef,
    ViewRef,
} from '@angular/core';
import { MentionConfig } from 'angular-mentions';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { DEFAULT_PROFILE_PHOTO_LINK } from 'src/app/shared/constants/api.constant';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
const BASE64_MARKER = ';base64,';

const MAX_FILE_SIZE_IN_MBS = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;
const MAX_FILE_COUNT = 10;

@Component({
    selector: 'app-media-upload-preview',
    templateUrl: './media-upload-preview.component.html',
    styleUrls: ['./media-upload-preview.component.scss'],
})
export class MediaUploadPreviewComponent implements OnInit {
    @ViewChild('chatInput') chatInput: ElementRef;
    @Input() files = [];
    @Input() selectedFile;
    @Input() items: { id: number; name: string; image_url: string; state: number }[] = [];
    @Output() closeUpload = new EventEmitter();
    @Output() sendFiles = new EventEmitter();
    defaultProfileLink = DEFAULT_PROFILE_PHOTO_LINK;
    memberTagged = false;
    audioUrl;

    audio: HTMLAudioElement;
    source;
    audio2: HTMLAudioElement;
    source2;

    audioPlaying: boolean = false;
    screenType: string;
    position = 0;
    volumePosition = 100;
    showPauseButton: boolean = false;
    timer;
    showVolume: boolean = true;
    rangeInput: HTMLInputElement;
    audioDuration;
    hideCrossDeleteBtn: boolean = true;
    index: number = null;
    fileSize;
    mentionListOpen: boolean = false;
    isAudioFile: boolean = false;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
        this.closeDialog();
    }

    @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler(event: KeyboardEvent): void {
        this.sendImages();
    }

    mentionConfig: MentionConfig = {
        dropUp: true,
        maxItems: 5,
        labelKey: 'name',
        mentionSelect: (item: any) => {
            this.memberTagged = true;
            setTimeout(() => this.addItem(item), 100);
            return '';
        },
        mentionFilter: (searchString: string, items: any[]) => {
            const searchStringLowerCase = searchString.toLowerCase();
            return items.filter((e) => e[this.mentionConfig.labelKey].toLowerCase().includes(searchStringLowerCase));
        },
    };

    constructor(
        private chatService: ChatroomService,
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
        private utilsService: UtilsService,
        private snackbar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';        
        this.chatService.showOverlayAudioUpload$$.next(true);
    }

    ngAfterViewInit(): void {
        if (this.selectedFile?.file?.type?.split('/')[0] == 'audio') {
            this.isAudioFile = true;
            this.generateAudioBlobUrl();

            if (this.cdr && !(this.cdr as ViewRef).destroyed) {
                this.cdr.detectChanges();
            }
        }
    }

    deleteFileFromPreview(i?, file?) {
        if (!file) {
            let index = this.files.indexOf(this.selectedFile);
            this.files.splice(i, 1);

            if (index == i) {
                this.generateAudioBlobUrl();
                this.audio.pause();
                if (index >= 1) {
                    this.selectedFile = this.files[index - 1];
                } else if (index == 0) {
                    this.selectedFile = this.files[0];
                }
            }
            return;
        } else if (file) {
            this.audio.pause();
            this.audio2.pause();
            let index = this.files.indexOf(this.selectedFile);
            this.files.splice(index, 1);

            if (index >= 1) {
                this.selectedFile = this.files[index - 1];
            } else if (index == 0) {
                this.selectedFile = this.files[0];
            }
            this.generateAudioBlobUrl();
            return;
        }
    }

    hideCrossDeleteFunc(index, hovered) {
        if (hovered) {
            this.hideCrossDeleteBtn = false;
            this.index = index;
        } else {
            this.hideCrossDeleteBtn = true;
            this.index = null;
        }
    }

    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        return Math.round(bytes / Math.pow(1000, i)) + ' ' + sizes[i];
    }

    generateAudioBlobUrl() {
        this.showPauseButton = false;
        let binary = this.convertDataURIToBinary(this.selectedFile.blob);
        this.audioUrl = new Blob([binary], { type: this.selectedFile.file.type });
        this.audioUrl = URL.createObjectURL(this.audioUrl);
        this.audioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.audioUrl);

        this.audio = <HTMLAudioElement>document.getElementById('audio');
        this.source = <HTMLSourceElement>document.getElementById('audioSource')
        this.source.src = this.audioUrl;
        this.audio.load();

        // FOR MOBILE 
        this.audio2 = <HTMLAudioElement>document.getElementById('audio2');
        this.source2 = <HTMLSourceElement>document.getElementById('audioSource2');
        this.source2.src = this.audioUrl;
        this.audio2.load();

        // Calculate the bytes of the audio file
        this.fileSize = this.utilsService.bytesToSize(this.selectedFile.file.size);
        //

        this.audio.onloadedmetadata = () => {
            var date = new Date(null);
            date.setSeconds(this.audio.duration);

            this.audioDuration = this.utilsService.secondsTo_HH_MM_SS_converter(this.audio.duration);

            if (this.cdr && !(this.cdr as ViewRef).destroyed) {
                this.cdr.detectChanges();
            }
        };

        this.audio.addEventListener('play', () => {
            this.showPauseButton = true;
            this.timer = setInterval(() => {
                let position = this.audio.currentTime * (100 / this.audio.duration);
                if(!isNaN(position)){
                  this.position = this.audio.currentTime * (100 / this.audio.duration);
                }  
                if (this.cdr && !(this.cdr as ViewRef).destroyed) {
                    this.cdr.detectChanges();
                }
            }, 500);
        });

        this.audio.addEventListener('pause', () => {
            this.showPauseButton = false;
        });

        /// FOR MOBILE 

        this.audio2.addEventListener('play', () => {
            this.showPauseButton = true;
        });

        this.audio2.addEventListener('pause', () => {
            this.showPauseButton = false;
        });

        ///

        this.rangeInput = <HTMLInputElement>document.getElementById('range-input');

        this.rangeInput.addEventListener('input', () => {
            this.audio.pause();
            this.audio.currentTime = this.rangeInput.valueAsNumber * (this.audio.duration / 100);
            // progressbar.style.width = `${this.rangeInput.valueAsNumber*136/100 +4}px`;
        });

        this.rangeInput.addEventListener('mouseup', () => {
            this.audio.play();
        });

        this.audio.addEventListener('ended', () => {
            this.position = 0;
            this.audio.currentTime = 0;
        });
    }

    clickVolume() {
        if (this.showVolume) {
            this.showVolume = false;
            this.audio.volume = 0;
        } else {
            this.showVolume = true;
            this.audio.volume = 1;
        }
    }

    getSerchResult(event): void {
        const searchResult: boolean = this.items.some(
            (memeber) => memeber.name.toLocaleLowerCase().indexOf(String(event).toLocaleLowerCase()) !== -1
        );
        if (this.mentionListOpen && !searchResult) {
            this._mentionListOpen(false);
        }
        if (searchResult) {
            this._mentionListOpen(true);
        }
    }

    _mentionListOpen(isOpen: boolean) {
        this.mentionListOpen = isOpen;
    }

    convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    closeDialog(): void {
        // this.closeUpload.emit();
        this.chatService.showOverlayAudioUpload$$.next(false);
        this.chatService.mediaToBeUploaded$$.next([]);
    }

    changeSelectedImage(file): void {
        if(file == this.selectedFile){
            return;
          }
        this.selectedFile = file;
        this.generateAudioBlobUrl();
    }

    showMessage(message: string): void {
        const config = new MatSnackBarConfig();
        config.panelClass = ['snackbar'];
        config.duration = 3000;
        this.snackbar.open(message, undefined, config);
    }

    uploadImage(event): void {

        if(this.files.length + event.target.files.length > 10){
            let message = "Can't send more than 10 attachments."
            this.showMessage(message);
            return;
        }
        const fileArray: any[] = Array.from(event.target.files);
        if (fileArray.find((file) => file.size > MAX_FILE_SIZE_BYTES)) {
            this.showMessage(`Maximum allowed file size is ${MAX_FILE_SIZE_IN_MBS} Mbs.`);
            return;
        }
        
        this.utilsService.fetchAllAudioFilesDuration(event.target.files).then((fileObjects) => {
            fileObjects.forEach((fileObject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.files.push({
                        file: fileObject.file,
                        blob: reader.result,
                        fileName: fileObject.file.name,
                        type: 'audio',
                        meta: {
                            duration: parseInt(`${fileObject.duration}`.toString()),
                            size: fileObject.file.size,
                        },
                    });
                    this.chatService.mediaToBeUploaded$$.next(this.files);
                    // this.chatService.mediaToBeUploaded$$.next(this.fileToBeUpload);
                    // this.store.dispatch(StopLoading());
                };
                reader.readAsDataURL(fileObject.file);
            })
        }).catch(err=>{
        })
    }

    addItem(event): void {
        let sel, range;
        const html = `&nbsp;<span contenteditable="false" class="tagged-span">${event.name}</span>&nbsp;`;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                const el = document.createElement('div');
                el.innerHTML = html;
                let frag = document.createDocumentFragment(),
                    node,
                    lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    }

    parseMsg(innerHtml): string {
        let textMsgString = '';
        if (innerHtml) {
            innerHtml.childNodes.forEach((node) => {
                if (node.tagName && node.tagName.toLowerCase() === 'span') {
                    const selectedMember = this.items.find((item) => item.name === node.textContent);
                    textMsgString += `<<${selectedMember.name}|route://member/${selectedMember.id}>>`;
                } else {
                    textMsgString += node.textContent;
                }
            });
        }
        return textMsgString.replace('&nbsp;', ' ').trim();
    }

    sendAudios() {
        this.chatService.showOverlayAudioUpload$$.next(false);
    }

    sendImages(): void {
        // this.sendFiles.emit({
        //     files: this.files,
        //     text: this.parseMsg(this.chatInput.nativeElement),
        // });
        this.chatService.showOverlayAudioUpload$$.next(false);
    }

    checkTextLength(): boolean {
        return this.chatInput ? this.chatInput.nativeElement.innerText.trim().length === 0 : false;
    }

    disableUndoAndRedo(evt): boolean {
        if ((evt.ctrlKey || evt.metaKey || evt.shiftKey) && evt.key === 'z') {
            evt.preventDefault();
            return false;
        }
        if ((evt.ctrlKey || evt.metaKey || evt.shiftKey) && evt.key === 'y') {
            evt.preventDefault();
            return false;
        }
        if (evt.key === 'Enter' && !evt.shiftKey && !evt.metaKey && !evt.altKey && !evt.ctrlKey) {
            if (this.memberTagged) {
                this.memberTagged = false;
            } else {
                this.sendImages();
            }
            evt.preventDefault();
            return false;
        }
        return true;
    }

    pasteItem(evt): void {
        evt.preventDefault();

        if (evt.clipboardData) {
            const content = evt.clipboardData.getData('Text');
            if (window.getSelection) {
                const selObj = window.getSelection();
                const selRange = selObj.getRangeAt(0);
                selRange.deleteContents();
                selRange.insertNode(document.createTextNode(content));
                selObj.removeAllRanges();
                const textareaRange = document.createRange();
                textareaRange.selectNodeContents(this.chatInput.nativeElement);
                textareaRange.collapse(false);
                selObj.addRange(textareaRange);
                setTimeout((_) => (this.chatInput.nativeElement.scrollTop = this.chatInput.nativeElement.scrollHeight), 0);
            }
        } else if (evt.originalEvent.clipboardData) {
            const content = (evt.originalEvent || evt).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, content);
        }
    }

    onImgError(event) {
        if (event) event.target.src = this.defaultProfileLink;
    }
}
