import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TransactionDetailModel } from "../home.model";

@Injectable({
  providedIn: "root",
})
export class TransactionDetailService {
  private apiUrl = "/api"; //enviroment.apiUrl + "/transactions-details";

  constructor(private http: HttpClient) {}

  findAllBy(
    prd: string,
    acc_id: number,
    ta_dsg: string,
  ): Observable<TransactionDetailModel[]> {
    const params = new HttpParams()
      .set("prd", prd)
      .set("acc_id", acc_id.toString())
      .set("ta_dsg", ta_dsg);

    return this.http.get<TransactionDetailModel[]>(this.apiUrl, { params });
  }
}
