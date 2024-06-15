import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  apiUrl = 'https://api.quotable.io/quotes'
  constructor(private http: HttpClient) {}

  getQuote(): Observable<any> {
    return this.http.get(this.apiUrl + '/random');
  }
}
