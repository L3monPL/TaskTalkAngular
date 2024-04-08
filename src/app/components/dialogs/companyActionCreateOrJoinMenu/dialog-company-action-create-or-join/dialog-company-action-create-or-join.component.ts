import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { CompanyCreateComponent } from '../company-create/company-create.component';

@Component({
  selector: 'app-dialog-company-action-create-or-join',
  standalone: true,
  imports: [
    CompanyCreateComponent
  ],
  templateUrl: './dialog-company-action-create-or-join.component.html',
  styleUrl: './dialog-company-action-create-or-join.component.scss'
})
export class DialogCompanyActionCreateOrJoinComponent implements AfterViewInit{

  // ---------- MODAL CORE ---------- //

  constructor(
    public dialogRef: DialogRef<DialogCompanyActionCreateOrJoinComponent>,
    @Inject(DIALOG_DATA) public data: any
  ) { }

  isOpenModal = false

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isOpenModal = true
    })
  }

  @ViewChild('card') private card!: ElementRef

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    
    if (!this.card.nativeElement.contains(event.target) && this.isOpenModal) {
      this.closeDialog()
    }
  }

  closeDialog(){
    console.log('close')
    this.dialogRef.close()
  }

  // ---------- END MODAL CORE ---------- //

  openCompanyComponent?: string|null = null

  selectComponent($event:any, name?: string){
    event?.stopPropagation()
    this.openCompanyComponent = name
  }

  selectPlanFromComponent(name: string){
    console.log(name)
  }

}
