import { StringValidator } from "./StringValidator";
import { isEmpty } from "./validators";
export const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
export class EmailValidator implements StringValidator {
  isAcceptable(email: string) {
    return !isEmpty(email) && emailRegexp.test(email);
  }
}