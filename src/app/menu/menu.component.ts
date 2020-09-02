import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  aba: string = "";
  @ViewChild('alertBox', { static: true }) alertBox: AlertBoxComponent;

  constructor() {
  }

  ngOnInit() {
    this.alertBox.showAlertBox();
  }
  
}