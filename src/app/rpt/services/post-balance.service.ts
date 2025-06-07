import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PostBalanceModel } from "../rpt.model";

@Injectable({
  providedIn: "root",
})
export class PostBalanceService {
  private apiUrl = enviroment.apiUrl + "/posts-balances/";

  constructor(private http: HttpClient) {}

  findAllBy(year: string): Observable<PostBalanceModel[]> {
    return this.http.get<PostBalanceModel[]>(`${this.apiUrl}${year}`);
  }
}
