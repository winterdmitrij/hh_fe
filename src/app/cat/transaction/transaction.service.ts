import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TransactionModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  findAll(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(`${this.apiUrl}/transactions`);
  }
}
