import { Injectable } from '@angular/core';

export declare let alertify;


@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
 confirm(message: string, okCallback: () => any) {
      alertify.confirm(message, (e) =>  {
        if (e) {
            okCallback();
        } else {

        }
      });
  }


  success(message: string) {
        alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }
  message(message: string) {
        alertify.message(message);
  }

}