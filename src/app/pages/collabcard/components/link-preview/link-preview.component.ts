import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.scss']
})
export class LinkPreviewComponent implements OnInit {
  @Input('linkPreview') linkPreview: any;

  constructor() { }

  ngOnInit(): void {
  }

  redirect(url: string) {
    window.open(`${!url.toLowerCase().startsWith('http') ? 'https://' : ''}${url}`, '_blank');
  }

}
