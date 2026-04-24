import { Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { InformationModel } from "../cat.model";

@Injectable({
  providedIn: "root",
})
export class InformationService {
  private apiUrl = "/api"; //enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<InformationModel[]> {
    return this.http.get<InformationModel[]>(`${this.apiUrl}/informations`);
  }

  findOne(typ: string): Observable<InformationModel> {
    return this.http.get<InformationModel>(
      `${this.apiUrl}/informations/${typ}`,
    );
  }
}
