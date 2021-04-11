import { StringValidator } from "./StringValidator";
import { isEmpty } from "./utilities";
export const passwordRegexp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export class PasswordValidator implements StringValidator {

  //check field for value and correct format
    isAcceptable(password: string) {
        return !isEmpty(password) && passwordRegexp.test(password);
    }

    //checks if string is in email format
    isPassword = (password: string) =>{
        if(password.match(passwordRegexp)) 
            return true;
        else 
            return false;
        }

    //returns an array of errors with the input password
    getErrors(password: string){
        let errors = []
        if (password.length < 8) {
            errors.push("Your password must be at least 8 characters"); 
        }
        if (password.search(/[a-z]/i) < 0) {
            errors.push("Your password must contain at least one letter.");
        }
        if (password.search(/[0-9]/) < 0) {
            errors.push("Your password must contain at least one digit."); 
        }
        if(password.search(/[!@#$%^&*]/)){
            errors.push("Your password must contain at least one special character."); 
        }
        return errors;
    }
}