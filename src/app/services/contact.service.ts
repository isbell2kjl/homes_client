import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../helpers/constants';


@Injectable({
  providedIn: 'root'
})
export class ContactService {


  constructor(private http: HttpClient) { }

  sendContact(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${baseURL}/contact`, { name, email, phone, message });
  }

  sendWebMaster(name: string, email: string, phone: string, message: string) {
    return this.http.post(`${baseURL}/webmaster`, { name, email, phone, message });
  }

}
