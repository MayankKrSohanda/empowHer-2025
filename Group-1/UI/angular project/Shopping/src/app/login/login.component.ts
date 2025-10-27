import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { AuthService } from '../services/auth.service';
import { NavbarService } from '../services/navbar.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit, OnDestroy{

  loginForm: FormGroup;
  alertMessage:string|null=null;
  alertType:'success'|'danger'='success';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private navbarService:NavbarService) {
    this.loginForm=this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]]
    });


  }
  ngOnInit(): void {
    this.navbarService.hide();
  }
  ngOnDestroy(): void {
    this.navbarService.show();
  }

  handleLogin(){
    if(this.loginForm.valid){
      const{email,password} = this.loginForm.value;
      this.authService.login({email,password}).subscribe({
        next: (response: any)=>{
          const userRole=response.role;
          if(userRole==='admin'){
            this.alertType='success';
            this.alertMessage="Login successfull";
            setTimeout(()=>this.alertMessage=null,3000);
            this.router.navigateByUrl("/admin");
          }else if(userRole==='customer'){
            this.alertType='success';
            this.alertMessage="Login successfull";
            setTimeout(()=>this.alertMessage=null,3000);
            this.router.navigateByUrl("/home");
          }
          
        },
        error: (error:any)=>{
          this.alertType='danger';
          this.alertMessage="Invalid email or password";
          setTimeout(()=>this.alertMessage=null,3000);
        }
      })
  }else{
    this.alertType='danger';
          this.alertMessage="please fill out the form correctly";
          setTimeout(()=>this.alertMessage=null,3000);
  }

}
}


