import { AfterViewChecked, ContentChildren, Directive, ElementRef, QueryList } from '@angular/core';

@Directive({
  selector: '[appExternalLink]'
})
export class ExternalLinkDirective implements AfterViewChecked  {

  @ContentChildren('a', {descendants: true}) links: QueryList<any>;

  constructor(private el: ElementRef) { }

    ngAfterViewChecked() {
      Array.from(this.el.nativeElement.querySelectorAll('a'))
        .forEach((el: any) => {
          el.setAttribute('target', '_blank');
        });
    }

}
