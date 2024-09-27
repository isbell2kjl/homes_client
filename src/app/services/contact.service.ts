import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  //  contactBaseURL: string = "https://localhost:7279/api/contact";
  contactBaseURL: string = "https://myproperties.ddns.net/api/contact"

  constructor(private http: HttpClient) { }

  sendContact(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${this.contactBaseURL}`, { name, email, phone, message });
  }

}
