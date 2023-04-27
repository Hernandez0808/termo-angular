import { Component, OnInit } from '@angular/core';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.css']
})
export class HelpModalComponent implements OnInit {

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
  }

	open(content:any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

}
