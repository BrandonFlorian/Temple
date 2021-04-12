import { StringValidator } from "./StringValidator";
import { isEmpty } from "./utilities";
export const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export class EmailValidator implements StringValidator {

  //check field for value and correct format
  isAcceptable(email: string) {
    return !isEmpty(email) && emailRegexp.test(email);
  }

  //checks if string is in email format
  isEmail = (email: string) =>{
    if(email.match(emailRegexp)) 
      return true;
    else 
      return false;
  }
  
  //returns any problems with the input email or OK if none
  getErrors(email: string){
    if(isEmpty(email)){
      return "Email field must not be empty";
    }
    else if(!this.isEmail(email)){
      return "Invalid email address format - example@email.com";
    }
    else{
      return "OK"
    }
  }
}