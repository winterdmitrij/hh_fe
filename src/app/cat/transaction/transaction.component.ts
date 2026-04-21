import { Component, OnInit } from "@angular/core";
import { TransactionModel } from "../cat.model";
import { PostService } from "../services/post.service";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrl: "./transaction.component.css",
})
export class TransactionComponent implements OnInit {
  title = "Transaktionen";

  transactions: TransactionModel[] = [];

  constructor(private pstSrv: PostService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.pstSrv
      .findAllTransactions()
      .subscribe((data) => (this.transactions = data));
  }
}
