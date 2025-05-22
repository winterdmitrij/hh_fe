import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TransactionModel } from "../cat.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(`${this.apiUrl}/transactions`);
  }

  findOne(id: string): Observable<TransactionModel> {
    return this.http.get<TransactionModel>(`${this.apiUrl}/transactions/${id}`);
  }
}
