import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, delay, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService{
  api_url:string="http://127.0.0.1:5000/";
  validEmail:number;
  token:string = null;
  errorAlert:boolean = false;

  constructor(private httpClient:HttpClient, private router:Router) { }

  onRegPost(value){
    return this.httpClient.post(`${this.api_url}register`, value, httpOptions)
  }

  onCheckEmailTaken(email:string):Observable<any>{
    console.log('INTO Check Email Taken')
    return this.httpClient.post(`${this.api_url}emailvalidation`, email, httpOptions)
      .pipe(debounceTime(2000))
      .pipe(delay(2000))
      .pipe(map(res=>res))
  }

  checkUserLogin(value){
    console.log('INTO Check User Credentials');
    return this.httpClient.post(`${this.api_url}login`, value, httpOptions).subscribe(
      (result)=>{
        if(result['Found'] && result['access_token'] !== null){
          console.log(result);
          this.router.navigate(['/admin']); 
          this.token = result['access_token'];
        }
      },
      (error)=>{
        this.errorAlert = true;
        setTimeout(() => {
          this.errorAlert = false;
        }, 5000);
        console.log(error)
      }
  )
      
  }

  onForgetPassword(value){
    console.log('Into Forget Password');
    return this.httpClient.post(`${this.api_url}forgetpassword`, value, httpOptions)
  }

  onLogoutService(){
    this.router.navigate(['/loggedout']);
    this.token = null;
    
  }

  isAuthenticatedService(){
    return this.token != null;
  }

}
