import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PeriodModel } from "../doc.model";

@Injectable({
  providedIn: "root",
})
export class PeriodService {
  private apiUrl = "http://localhost:3000";

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
