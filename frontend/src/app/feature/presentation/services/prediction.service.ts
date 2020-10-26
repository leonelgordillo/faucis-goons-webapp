import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private httpClient: HttpClient) { }

  getDataEndDate(): Observable<any> {

    let uri = `${environment.api}/prediction/data-end-date`

    return this.httpClient.get<Object>(encodeURI(uri))
  }

  getCountyMobilityPrediction(county: string, startDate: Date, endDate: Date): Observable<any> {

    let startDateString = new Date(startDate).toISOString();
    let endDateString = new Date(endDate).toISOString();

    let uri = `${environment.api}/prediction/${county}/${startDateString}/${endDateString}`

    return this.httpClient.get<Object>(encodeURI(uri))
  }
}
