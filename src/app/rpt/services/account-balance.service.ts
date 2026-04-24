import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AccountBalanceModel } from "../rpt.model";

@Injectable({
  providedIn: "root",
})
export class AccountBalanceService {
  private apiUrl = "/api"; //enviroment.apiUrl + "/accounts-balances/";

  constructor(private http: HttpClient) {}

  findAllBy(year: string): Observable<AccountBalanceModel[]> {
    return this.http.get<AccountBalanceModel[]>(`${this.apiUrl}${year}`);
  }
}
