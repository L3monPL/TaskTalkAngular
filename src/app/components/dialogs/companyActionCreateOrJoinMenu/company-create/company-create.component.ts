import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyService } from '../../../../services/rest/company.service';
import { CompanyManagementService } from '../../../../services/global/company-management.service';

@Component({
  selector: 'app-company-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.scss'
})
export class CompanyCreateComponent {

  constructor(
    private companyService: CompanyService,
    private companyManagement: CompanyManagementService
  ) { }

  @Input() selectTypePlanCompany?: string
  @Output() selectEmitter = new EventEmitter<string>();

  select(name: string){
    this.selectEmitter.emit(name)
  }

  createCompanyForm = new FormGroup({
    name: new FormControl ('', [Validators.required]),
    shortName: new FormControl ('', [Validators.required, Validators.maxLength(4)])
  })

  subCreateCompany?: Subscription
  loadingCreateCompany = false
  customErrorCreateCompany?: string
  checkValidForm = false

  create(){
    this.checkValidForm = true

    if (!this.loadingCreateCompany && this.createCompanyForm.valid) {
      let timeoutId = setTimeout(() => {this.loadingCreateCompany = true}, 300)
      let name = this.createCompanyForm.get('name')!.value;
      let shortName = this.createCompanyForm.get('shortName')!.value;

      this.subCreateCompany = this.companyService.postCompanyCreate(name!.trim(), shortName!.trim()).subscribe({
        next: (response) => {
          if(response.body){
            clearTimeout(timeoutId)
            this.loadingCreateCompany = false
            // this.router.navigate([`/app`])
            this.select('close')
            this.companyManagement.getCompanyListEmitterByCreate(response.body)
          }
          else{
            this.customErrorCreateCompany! = 'Brak obiektu odpowiedzi';
          }
        },
        error: (errorResponse) => {
          clearTimeout(timeoutId)
          this.loadingCreateCompany = false
          this.customErrorCreateCompany = errorResponse.error
        },
        complete: () => {
          clearTimeout(timeoutId)
          this.loadingCreateCompany = false;
        }
      })
    }
  }


}
