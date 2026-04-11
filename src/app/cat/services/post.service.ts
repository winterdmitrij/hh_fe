import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PostModel, TransactionModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  // Transactions
  findAllTransactions(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(`${this.apiUrl}/transactions`);
  }

  findOneTransaction(id: string): Observable<TransactionModel> {
    return this.http.get<TransactionModel>(`${this.apiUrl}/transactions/${id}`);
  }

  findFirstTransaction(): Observable<TransactionModel> {
    return this.findAllTransactions().pipe(
      map((transactions) => transactions.sort((a, b) => a.id - b.id)[0]),
    );
  }

  // Postgroups

  // Posts
  findAll(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}/posts`);
  }
}
