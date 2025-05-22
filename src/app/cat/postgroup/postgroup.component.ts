import { Component, OnInit } from "@angular/core";
import { PostgroupService } from "./postgroup.service";
import { TransactionModel } from "../cat.model";
import { ActivatedRoute } from "@angular/router";
import { TransactionService } from "../transaction/transaction.service";

@Component({
  selector: "app-postgroup",
  templateUrl: "./postgroup.component.html",
  styleUrl: "./postgroup.component.css",
})
export class PostgroupComponent implements OnInit {
  //ToDo: vllt brauche ich das nicht
  title: string = "";

  transactions?: TransactionModel[];
  curTransaction?: TransactionModel;
  curTraId: string = "1";

  constructor(
    private traSrv: TransactionService,
    //    private pstGrpSrv: PostgroupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");

      if (id !== null) {
        this.curTraId = id;
        this.loadOneTransaction(this.curTraId);
        //ToDo: vllt brauche ich das nicht
        this.title = "Transaktion: ";
      } else {
        this.loadAllTransactions();
        this.loadOneTransaction(this.curTraId);
        //ToDo: vllt brauche ich das nicht
        this.title = "Katalog 'Postgruppen'";
      }
    });
  }

  loadAllTransactions() {
    this.traSrv.findAll().subscribe((data) => (this.transactions = data));
  }

  loadOneTransaction(id: string) {
    this.traSrv.findOne(this.curTraId).subscribe((data) => {
      this.curTransaction = data;
    });
  }

  onTransactionChange(event: Event) {
    const selId = (event.target as HTMLSelectElement).value;
    this.curTraId = selId;
    this.loadOneTransaction(selId);
  }
}
