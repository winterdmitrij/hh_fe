import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PeriodModel } from "../doc.model";
import { enviroment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class PeriodService {
  private apiUrl = enviroment.apiUrl + "/periods";

  constructor(private http: HttpClient) {}

  findAll(): Observable<PeriodModel[]> {
    return this.http.get<PeriodModel[]>(this.apiUrl);
  }

  /**
   * Gibt die aktuelle Periode zurück,
   * die normalerweise active aber nicht geschloßen ist
   * (=== größte active Periode, um Fehler zu vermeiden)
   */
  findCurPrd(): Observable<PeriodModel> {
    return this.findAll().pipe(
      map(
        (periods) =>
          periods
            .filter((p) => p.act)
            .sort((a, b) => b.prd.localeCompare(a.prd))[0]
      )
    );
  }

  findAllYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/years`);
  }

  // ToDo: findOne!
  findOneById(prd: string): Observable<PeriodModel> {
    return this.http.get<PeriodModel>(`${this.apiUrl}/${prd}`);
  }

  // ToDo: update(period)!
  update(prd: string, period: PeriodModel): Observable<PeriodModel> {
    return this.http.patch<PeriodModel>(`${this.apiUrl}/${prd}`, period);
  }
}
