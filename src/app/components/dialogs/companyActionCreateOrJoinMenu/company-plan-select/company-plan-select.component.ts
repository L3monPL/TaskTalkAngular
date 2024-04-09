import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-company-plan-select',
  standalone: true,
  imports: [],
  templateUrl: './company-plan-select.component.html',
  styleUrl: './company-plan-select.component.scss'
})
export class CompanyPlanSelectComponent {

  @Output() selectEmitter = new EventEmitter<string>();

  select(name: string){
    this.selectEmitter.emit(name)
  }
}
