// @ts-ignore
import { Component, OnInit } from '@angular/core';
import {ParkingSlotService} from "../../../service/parking-slot.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {DetailParkingSlotComponent} from "../detail-parking-slot/detail-parking-slot.component";

// @ts-ignore
@Component({
  selector: 'app-list-parking-slot',
  templateUrl: './list-parking-slot.component.html',
  styleUrls: ['./list-parking-slot.component.css']
})
export class ListParkingSlotComponent implements OnInit {
  p: number;
  public list = [];
  public keywordSearch: string;
  public checkList = 'true';
  public reverse = true;
  public key;
  public test = 'first';
  constructor(private parkingSlotService: ParkingSlotService,
              public dialog: MatDialog,
              private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.parkingSlotService.getAllParkingLotService().subscribe(data => {
      this.list = data;
      console.log(this.list);
    });
  }

  changePage(p: number) {
    if (p !== 1) {
      this.test = 'second';
    } else {
      this.test = 'first';
    }
  }

  keyDownFunction(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      console.log(event.keyCode);
    }
  }

  openViewDialog(id: number): void {
    this.parkingSlotService.getById(id).subscribe(dataFromServer =>{
      const dialogRef = this.dialog.open(DetailParkingSlotComponent, {
        width: '850px',
        disableClose: true,
        data: {data1: dataFromServer}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.ngOnInit();
      });
    });
  }
}
