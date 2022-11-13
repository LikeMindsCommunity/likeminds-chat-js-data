import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {

  @Input() public photoUrl: string;
  @Input() public name: string;
  @Input() public size: string;

  public showInitials: boolean = false;
  public initials: string;
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
  ]

  constructor() { }

  ngOnInit(): void {
  }

  handleImageError() {
    this.showInitials = true;
    this.createInitials();

    const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
    this.circleColor = this.colors[randomIndex];
  }

  private createInitials(): void {
    let initials = "";

    let namesList = this.name?.split(' ');
    if (namesList)
      for (let name of namesList) {
        if (name[0] !== ' ') {
          initials += name[0].toUpperCase();

          if (initials.length === 2) break;
        }
      }

    this.initials = initials;
  }

}
