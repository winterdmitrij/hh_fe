import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DocumentModel, PositionModel } from "../doc.model";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findDocBy(id: string): Observable<DocumentModel> {
    return this.http.get<DocumentModel>(`${this.apiUrl}/documents/${id}`);
  }

  //  findAll(): Observable<PositionModel[]> {
  //    return
  //  }
}
