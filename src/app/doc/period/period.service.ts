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

// ToDo: findOne!
  findOneById(prd: string): Observable<PeriodModel> {
    return this.http.get<PeriodModel>(`${this.apiUrl}/periods/${prd}`);
  }

// ToDo: update(period)!
  update(prd: string, period: PeriodModel): Observable<PeriodModel> {
    return this.http.patch<PeriodModel>(
      `${this.apiUrl}/periods/${prd}`,
      period
    );
  }
}
