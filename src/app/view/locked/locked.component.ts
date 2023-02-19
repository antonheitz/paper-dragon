import { Component, Input } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';

@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.sass']
})
export class LockedComponent {

  @Input("initialized") initialized: boolean = false;

  clearPassword: string = "";
  error: boolean = false;
  errorMessage: string = "";

  constructor(private runtimeStorage: RuntimeStorageService, private cryptoService: CryptoService) { }

  attemptLogin(): void {
    this.cryptoService.hashString(this.clearPassword).then((passwordHash: string) => {
      this.cryptoService.hashString(passwordHash).then((doubblePasswordHash: string) => {
        console.log(this.doubblePwHash)
        console.log(passwordHash)
        console.log(doubblePasswordHash)
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

  get doubblePwHash(): string {
    return this.runtimeStorage.spaces[this.runtimeStorage._getSpaceId()].spaceConf.pwDoubleHash;
  }
}
