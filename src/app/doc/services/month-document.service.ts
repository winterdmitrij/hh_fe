import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { MonthDocumentModel } from "../doc.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MonthDocumentService {
  private apiUrl = "/api"; //enviroment.apiUrl + "/month-documents/";

  constructor(private http: HttpClient) {}

  findAllBy(prd: string): Observable<MonthDocumentModel[]> {
    return this.http.get<MonthDocumentModel[]>(`${this.apiUrl}${prd}`);
  }
}
