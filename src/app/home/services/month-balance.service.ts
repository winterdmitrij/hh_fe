import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MonthBalanceModel } from "../home.model";

@Injectable({
  providedIn: "root",
})
export class MonthBalanceService {
  private apiUrl = "/api"; //enviroment.apiUrl + "/month-balances/";

  constructor(private http: HttpClient) {}

  findAllBy(prd: string): Observable<MonthBalanceModel[]> {
    return this.http.get<MonthBalanceModel[]>(`${this.apiUrl}${prd}`);
  }
}
