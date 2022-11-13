import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dm-tab-icon',
  templateUrl: './dm-tab-icon.component.html',
  styleUrls: ['./dm-tab-icon.component.scss']
})
export class DmTabIconComponent implements OnInit {

  @Input() inactive;

  constructor() { }

  ngOnInit(): void {
  }

}
