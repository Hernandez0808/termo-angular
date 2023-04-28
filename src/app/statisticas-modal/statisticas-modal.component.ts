import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-statisticas-modal',
  templateUrl: './statisticas-modal.component.html',
  styleUrls: ['./statisticas-modal.component.css']
})
export class StatisticasModalComponent implements OnInit {

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
  }

	open(content:any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

}
