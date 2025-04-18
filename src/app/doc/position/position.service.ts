import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PositionModel } from "../doc.model";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  create(position: PositionModel): Observable<PositionModel> {
    return this.http.post<PositionModel>(`${this.apiUrl}/positions`, position);
  }

  update(position: PositionModel): Observable<PositionModel> {
    return this.http.patch<PositionModel>(
      `${this.apiUrl}/positions/${position.id}`,
      position
    );
  }

  delete(position: PositionModel): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/positions/${position.id}`);
  }
}
