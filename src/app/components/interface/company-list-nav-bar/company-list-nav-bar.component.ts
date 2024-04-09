import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Company } from '../../../services/rest/company.service';
import { Router } from '@angular/router';
import {Dialog, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { DialogCompanyActionCreateOrJoinComponent } from '../../dialogs/companyActionCreateOrJoinMenu/dialog-company-action-create-or-join/dialog-company-action-create-or-join.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-list-nav-bar',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule
  ],
  templateUrl: './company-list-nav-bar.component.html',
  styleUrl: './company-list-nav-bar.component.scss'
})
export class CompanyListNavBarComponent {

  @Input() companyList?: Array<Company>

  constructor( 
    private router: Router,
    public dialog: Dialog
  ) { }

  selectCompany(companyId: number){
    this.router.navigate([`/app/company/${companyId}`])
  }

  navigateTo(companyId: number, url?: string){
    this.currentContextMenuCompany = null
    document.removeEventListener('click', this.onDocumentClick)
    this.router.navigate([`/app/company/${companyId}/${url}`])
  }

  companyAddOrJoin() {
    this.dialog.open(DialogCompanyActionCreateOrJoinComponent, {
      minWidth: '300px',
      // data: {
      //   animal: 'panda',
      // },
    });
  }

  currentContextMenuCompany?: Company|null
  contextMenuX?: number
  contextMenuY?: number
  isContextMenuOpen = false

  openContextMenu(event: MouseEvent, item: Company){
    event.preventDefault()
    this.currentContextMenuCompany = item
    document.addEventListener('click', this.onDocumentClick)


    // event.preventDefault()
    //   this.currentContextMenuCompany = item

    //   // const listContainer = document.querySelector('.container_timeline') as HTMLElement;
    //   // const containerRect = listContainer.getBoundingClientRect();

    //   // const x = event.clientX - containerRect.left + listContainer.scrollLeft;
    //   // const y = event.clientY - containerRect.top + listContainer.scrollTop;
    //   const x = event.clientX
    //   const y = event.clientY

    //   console.log(event.clientX)
    //   console.log(event.clientY)
    //   console.log(event)

    //   this.contextMenuX = 66;
    //   this.contextMenuY = 0;

    //     this.isContextMenuOpen = true; 
    //     document.addEventListener('click', this.onDocumentClick)
  }

  @ViewChild('contextMenu') contextMenu!: ElementRef;

  onDocumentClick = (event: MouseEvent) => {
    const contextMenu = this.contextMenu.nativeElement as HTMLElement;
    // console.log(contextMenu)
    if (contextMenu && !contextMenu.contains(event.target as Node)) {
      // this.isContextMenuOpen = false;
      this.currentContextMenuCompany = null
      document.removeEventListener('click', this.onDocumentClick)
    }

  };
}
