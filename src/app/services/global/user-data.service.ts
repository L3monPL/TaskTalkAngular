import { Injectable } from '@angular/core';

export interface User{
  id: number
  login: string
  email: string
  phone: string
  role: string
  lock: boolean
  enabled: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  public user?: User


  constructor() { }

  setUser(user: User){
    this.user = user
  }

  getUser(){
    return this.user
  }
  getId(): number{
    return this.user!.id
  }
  getUserName():string|undefined{
    return this.user?.login
  }

  getEmail():string|undefined{
    return this.user?.email
  }
  getPhone():string|undefined{
    return this.user?.phone
  }
  getRole():string|undefined{
    return this.user?.role
  }
  isEnabled():boolean|undefined{
    return this.user?.enabled
  }
  isLock():boolean|undefined{
    return this.user?.lock
  }

  
  // isAdmin():boolean|undefined{
  //   return this.user?.role == 'ADMIN';
  //   propably from token return isAdmin
  // }

}
