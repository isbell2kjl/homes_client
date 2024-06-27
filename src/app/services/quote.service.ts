import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  // apiUrl = 'https://api.quotable.io/quotes'
  apiUrl = 'https://beta.ourmanna.com/api/v1/get?format=json&order=daily'
  constructor(private http: HttpClient) {}

  getQuote(): Observable<any> {
    // return this.http.get(this.apiUrl + '/random');
    return this.http.get(this.apiUrl);
  }
}
