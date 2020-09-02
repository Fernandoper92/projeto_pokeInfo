import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.scss']
})
export class AlertBoxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showAlertBox() {
    const component = document.getElementById('showAlert');
    component.style.display = "block";
  }

  closeAlertBox() {
    const component = document.getElementById('showAlert');
    component.style.display = "none";
  }

}
