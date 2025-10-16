import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';

export interface User{
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})

export  class AuthService {
     private apiUrl ="http://localhost:8080/api/login";
    
    constructor(private http: HttpClient){
    }

    login(u: User): Observable<any>{
        return this.http.post(this.apiUrl, u); 
    }
}