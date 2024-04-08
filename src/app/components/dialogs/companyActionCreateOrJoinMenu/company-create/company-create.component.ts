import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-company-create',
  standalone: true,
  imports: [],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.scss'
})
export class CompanyCreateComponent {


  @Output() planSelect = new EventEmitter<string>();

  selectPlan(name: string){
    this.planSelect.emit(name)
  }
}
