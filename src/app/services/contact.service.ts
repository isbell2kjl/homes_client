import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  //  contactBaseURL: string = "https://localhost:7279/api";
  contactBaseURL: string = "https://myproperties.ddns.net/api"

  constructor(private http: HttpClient) { }

  sendContact(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${this.contactBaseURL}/contact`, { name, email, phone, message });
  }

  sendWebMaster(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${this.contactBaseURL}/webmaster`, { name, email, phone, message });
  }

}
