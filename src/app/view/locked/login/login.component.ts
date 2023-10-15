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

  async attemptLogin(): Promise<void> {
    const passwordHash: string = await this.cryptoService.hashString(this.clearPassword);
    const doubblePasswordHash: string = await this.cryptoService.hashString(passwordHash);
    if (this.doubblePwHash !== doubblePasswordHash) {
      this.error = true;
      this.errorMessage = "The password is not right!";
      return
    }
    this.error = false;
    this.runtimeStorage.decryptSpace(passwordHash);
  }
}
