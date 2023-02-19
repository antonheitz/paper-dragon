import { Component, Input } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  @Input('doubblePwHash') doubblePwHash: string = "";

  clearPassword: string = "";
  error: boolean = false;
  errorMessage: string = "";

  constructor(private cryptoService: CryptoService, private runtimeStorage: RuntimeStorageService) { }

  attemptLogin(): void {
    this.cryptoService.hashString(this.clearPassword).then((passwordHash: string) => {
      this.cryptoService.hashString(passwordHash).then((doubblePasswordHash: string) => {
        if (this.doubblePwHash === doubblePasswordHash) {
          this.error = false;
          this.runtimeStorage.decryptSpace(passwordHash)
        } else {
          this.error = true;
          this.errorMessage = "The password is not right!";
        }
      }).catch((err: Error) => {
        this.error = true;
        this.errorMessage = String(err);
      })
    }).catch((err: Error) => {
      this.error = true;
      this.errorMessage = String(err);
    })
  }
}
