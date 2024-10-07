import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  baseURL: string = 'https://myproperties.ddns.net/api';

  constructor(private http: HttpClient) { }

  sendContact(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${this.baseURL}/contact`, { name, email, phone, message });
  }

  sendWebMaster(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${this.baseURL}/webmaster`, { name, email, phone, message });
  }

}
