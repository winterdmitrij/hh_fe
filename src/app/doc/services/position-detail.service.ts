import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";
import { PositionDetailModel } from "../doc.model";

@Injectable({
  providedIn: "root",
})
export class PositionDetailService {
  private apiUrl = "/api";

  constructor(private http: HttpClient) {}

  findOnePositionDetail(id: string): Observable<PositionDetailModel | null> {
    return this.http
      .get<PositionDetailModel>(`${this.apiUrl}/position-details/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createNewPositionDetail(
    positionDetail: PositionDetailModel,
  ): Observable<PositionDetailModel> {
    return this.http.post<PositionDetailModel>(
      `${this.apiUrl}/position-details`,
      positionDetail,
    );
  }

  updatePositionDetail(
    id: string,
    partial: Partial<PositionDetailModel>,
  ): Observable<PositionDetailModel> {
    return this.http.patch<PositionDetailModel>(
      `${this.apiUrl}/position-details/${id}`,
      partial,
    );
  }
}
