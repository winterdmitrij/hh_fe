import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PeriodModel } from "../doc.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class PeriodService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<PeriodModel[]> {
    return this.http.get<PeriodModel[]>(`${this.apiUrl}/periods`);
  }

  findOneById(prd: string): Observable<PeriodModel> {
    return this.http.get<PeriodModel>(`${this.apiUrl}/periods/${prd}`);
  }

  update(prd: string, period: PeriodModel): Observable<PeriodModel> {
    return this.http.patch<PeriodModel>(
      `${this.apiUrl}/periods/${prd}`,
      period
    );
  }
}
