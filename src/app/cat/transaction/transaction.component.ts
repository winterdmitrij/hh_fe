import { Component, OnInit } from "@angular/core";
import { TransactionModel } from "../cat.model";
import { TransactionService } from "./transaction.service";
import { response } from "express";
import { error, log } from "console";
import { HttpErrorResponse } from "@angular/common/http";
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
    this.load();
  }

  load() {
    this.pstSrv
      .findAllTransactions()
      .subscribe((data) => (this.transactions = data));
  }
}
