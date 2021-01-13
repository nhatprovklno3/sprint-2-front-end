import {Component, OnInit} from '@angular/core';

import {map, tap} from 'rxjs/operators';
import {HistoryPaymentService} from '../../../service/nqkhanh/history-payment.service';
import {CustomerService} from '../../../service/nqkhanh/customer.service';
import {Observable} from 'rxjs';
import {QuanService} from '../../../quan.service';

@Component({
  selector: 'app-history-payment',
  templateUrl: './history-payment.component.html',
  styleUrls: ['./history-payment.component.css']
})
export class HistoryPaymentComponent implements OnInit {
  public customerId;
  public historyPayments: Observable<any>;
  public totalElements: number;
  public pageSize: number;
  public currentPage = 0;
  public idAccount;

  constructor(public customerService: CustomerService, public historyPaymentService: HistoryPaymentService,
              public quanService: QuanService) {
    this.idAccount = this.quanService.currentUserValue.id;
  }

  ngOnInit(): void {
    this.getPage(1);
  }

  getPage(page: number) {
    this.customerService.getCustomerByAccountId( this.idAccount).subscribe(dataCustomer => {
      console.log(dataCustomer.id);
      this.customerId = dataCustomer.id;
      this.historyPayments = this.historyPaymentService.getAllInvoiceByCustomerId(this.customerId, page).pipe(
        tap(res => {
          this.totalElements = res.totalElements;
          this.pageSize = res.size;
          this.currentPage = page;
        }),
        map(res => res.content)
      );
    });
  }
}
