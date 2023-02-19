import { Component } from '@angular/core';
import { RuntimeSpaceConf } from 'src/app/model/runtime/runtime-space-conf';
import { CryptoService } from 'src/app/services/crypto.service';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';

type CurrentRegisterView = "local" | "remote"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  currentItem: CurrentRegisterView = "local";
  clearPassword: string = "";
  clearPasswordConfirm: string = "";
  localErrorMessage: string = "";

  constructor(private runtimeStorageService: RuntimeStorageService, private cryptoService: CryptoService) { }

  select(item: CurrentRegisterView): void {
    this.currentItem = item;
  }

  onPasswordInputChange(): void {
    if (this.clearPasswordConfirm.length > 0 && this.clearPassword !== this.clearPasswordConfirm) {
      this.localErrorMessage = "Passwords must match!"
    } else {
      this.localErrorMessage = ""
    }
  }

  registerLocal(): void {
    if (this.clearPassword === this.clearPasswordConfirm && this.clearPassword.length > 0) {
      this.cryptoService.hashString(this.clearPassword).then((hashedPassword: string) => {
        this.cryptoService.hashString(hashedPassword).then((doubbleHashedPassword: string) => {
          const personalSpaceConf: RuntimeSpaceConf = this.runtimeStorageService.spaces[this.runtimeStorageService._getSpaceId()].spaceConf;
          personalSpaceConf.pwDoubleHash = doubbleHashedPassword;
          this.localErrorMessage = "";
          this.runtimeStorageService.updateDocument(personalSpaceConf)
        }).catch((err: Error) => {
          this.localErrorMessage = String(err);
        })
      }).catch((err: Error) => {
        this.localErrorMessage = String(err);
      })
    }
  }
}
