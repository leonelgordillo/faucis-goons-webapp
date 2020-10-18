import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private countySource = new Subject();
  currentCounty = this.countySource.asObservable();

  changeCounty(county: string) {
    this.countySource.next(county)
  }
}
