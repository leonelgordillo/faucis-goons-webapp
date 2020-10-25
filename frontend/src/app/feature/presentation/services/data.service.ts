import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { publishReplay, refCount } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private countySource = new Subject();
  currentCounty = this.countySource.asObservable();
  _txMobilityData: Observable<any> = null;
  _usMobilityData: Observable<any> = null;

  constructor(private httpClient: HttpClient) { }

  changeCounty(county: string) {
    this.countySource.next(county)
  }

  getTxDataJson() {
    if (!this._txMobilityData) {

      let uri = `${environment.api}/data/tx-mobility`
      this._txMobilityData = this.httpClient.get(uri)
        .pipe(
          publishReplay(1),
          refCount());
    }
    return this._txMobilityData
  }

  getUsDataJson() {
    if (!this._usMobilityData) {

      let uri = `${environment.api}/data/us-mobility`
      this._usMobilityData = this.httpClient.get(uri)
        .pipe(
          publishReplay(1),
          refCount());
    }
    return this._usMobilityData
  }
}
