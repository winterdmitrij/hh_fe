import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PeriodModel } from "../doc.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class PeriodService {
  private apiUrl = "/api"; //enviroment.apiUrl + "/periods";

  constructor(private http: HttpClient) {}

  findAllPeriods(): Observable<PeriodModel[]> {
    return this.http.get<PeriodModel[]>(`${this.apiUrl}/periods`);
  }

  findCurrentPeriod(): Observable<PeriodModel | null> {
    return this.findAllPeriods().pipe(
      map(
        (periods) =>
          periods
            .filter((p) => p.act)
            .sort((a, b) => b.prd.localeCompare(a.prd))
            .at(0) ?? null,
      ),
    );
  }

  findAllYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/years`);
  }

  // ToDo: testen
  findCurrentYear(): Observable<number | null> {
    return this.findAllYears().pipe(map((years) => years.at(0) ?? null));
  }

  // ToDo: Probieren mit partial: Partial<PeriodModel>,
  updatePeriod(prd: string, period: PeriodModel): Observable<PeriodModel> {
    return this.http.patch<PeriodModel>(
      `${this.apiUrl}/periods/${prd}`,
      period,
    );
  }
}
