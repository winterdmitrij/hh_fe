import { Component, OnInit } from "@angular/core";
import { TransactionModel } from "../cat.model";
import { TransactionService } from "./transaction.service";
import { response } from "express";
import { error } from "console";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrl: "./transaction.component.css",
})
export class TransactionComponent implements OnInit {
  transactions: TransactionModel[] = [];

  constructor(private traSrv: TransactionService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.traSrv.findAll().subscribe((data) => (this.transactions = data));
  }
}
