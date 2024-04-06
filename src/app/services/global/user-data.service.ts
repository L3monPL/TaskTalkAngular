import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  public user?: any = {
    id: 30,
    username: '2L3mon',
    email: 'test',
    phone: null
  }

  constructor() { }

  setUser(user: any){
    this.user = user
  }

  getUser(){
    return this.user
  }
  getId(): number{
    return this.user!.id
  }
  getUserName():string|undefined{
    return this.user?.username
  }

  getEmail():string|undefined{
    return this.user?.email
  }
  getPhone():string|undefined{
    return this.user?.phone
  }

  
  // isAdmin():boolean|undefined{
  //   return this.user?.role == 'ADMIN';
  //   propably from token return isAdmin
  // }

}
