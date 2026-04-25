import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PositionModel } from "../doc.model";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  private apiUrl = "/api"; //enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  createPosition(position: PositionModel): Observable<PositionModel> {
    return this.http.post<PositionModel>(`${this.apiUrl}/positions`, position);
  }
  /*
  updatePosition(position: PositionModel): Observable<PositionModel> {
    return this.http.patch<PositionModel>(
      `${this.apiUrl}/positions/${position.id}`,
      position,
    );
  }
*/
  updatePosition(
    id: string,
    partial: Partial<PositionModel>,
  ): Observable<PositionModel> {
    return this.http.patch<PositionModel>(
      `${this.apiUrl}/positions/${id}`,
      partial,
    );
  }

  deletePosition(position: PositionModel): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/positions/${position.id}`);
  }
}
