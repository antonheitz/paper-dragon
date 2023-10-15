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
  hint: string = "";

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

  async registerLocal(): Promise<void> {
    if (this.clearPassword === this.clearPasswordConfirm && this.clearPassword.length > 0) {
      const hashedPassword: string = await this.cryptoService.hashString(this.clearPassword);
      const doubbleHashedPassword: string = await this.cryptoService.hashString(hashedPassword);
      const personalSpaceConf: RuntimeSpaceConf = this.runtimeStorageService.spaces[this.runtimeStorageService._getSpaceId()].spaceConf;
      personalSpaceConf.pwDoubleHash = doubbleHashedPassword;
      personalSpaceConf.pwHint = this.hint;
      this.localErrorMessage = "";
      await this.runtimeStorageService.updateDocument(personalSpaceConf);
    }
  }
}
