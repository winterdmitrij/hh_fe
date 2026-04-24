import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";
import { enviroment } from "../../../../enviroments/enviroment";
import { PositionDetailModel } from "../../doc.model";

@Injectable({
  providedIn: "root",
})
export class PositionDetailService {
  private apiUrl = "/api"; //enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  //findOne(id: string) Observable<PositionDetailModel> {
  //  return this.http.get<PositionDetailModel>(`${this.apiUrl}/`)
  //}

  async findOrCreate(id: string): Promise<PositionDetailModel> {
    try {
      // 1. Versuche, das Detail zu laden
      return await firstValueFrom(
        this.http.get<PositionDetailModel>(
          `${this.apiUrl}/position-details/${id}`,
        ),
      );
    } catch (err: any) {
      // 2. Wenn nicht gefunden, erstelle es
      if (err.status === 404) {
        const created = await firstValueFrom(
          this.http.post<PositionDetailModel>(
            `${this.apiUrl}/position-details`,
            { pos_id: id },
          ),
        );
        return created;
      }
      throw err;
    }
  }

  update(detail: PositionDetailModel): Observable<PositionDetailModel> {
    return this.http.patch<PositionDetailModel>(
      `${this.apiUrl}/position-details/${detail.pos_id}`,
      detail,
    );
  }
}
