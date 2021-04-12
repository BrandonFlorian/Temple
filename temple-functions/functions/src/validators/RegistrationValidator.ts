
import { EmailValidator } from "./EmailValidator";
import { PasswordValidator } from "./PasswordValidator";
import { isEmpty } from "./utilities";
export class RegistrationValidator {

        errors : {
        email: string[], 
        password: string[], 
        confirmPassword: string[], 
        userHandle: string[]} = {email :[], password:[], confirmPassword:[], userHandle:[]};

  //check field for value and correct format
  isAcceptable() {
    if(this.errors.userHandle.length === 0 && this.errors.email.length === 0 && this.errors.password.length === 0 && this.errors.confirmPassword.length === 0){
      return true;
    }
    return false;
  }

  //return the current errors object
  getErrors(){
    return this.errors;
  }

  //validates a set of user data against the input rules
  validateRegistrationDetails(userData: {email: string, password: string, confirmPassword: string, userHandle: string}){
    if(isEmpty(userData.userHandle)){
      this.errors.email.push("handle must not be empty");
    }

    let emailValidator: EmailValidator = new EmailValidator();
    if(!emailValidator.isAcceptable(userData.email)){
        this.errors.email.push(emailValidator.getErrors(userData.email));
    }
    //test password
    let passwordValidator: PasswordValidator = new PasswordValidator();
    if(!passwordValidator.isAcceptable(userData.password)){
        passwordValidator.getErrors(userData.password).forEach(element => {
            this.errors.password.push(element);
        });
    }
    //test confirm password
    if(!passwordValidator.confirmPassword(userData.password, userData.confirmPassword)){
        this.errors.confirmPassword.push("Password and confirm password do not match");
    }
  }
}