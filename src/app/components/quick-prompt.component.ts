import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'quick-prompt-component',
  templateUrl: './quick-prompt.component.html',
})
export class QuickPromptComponent {

  public title: string = 'Redirecting to Instagram';
  public question: string = 'This application is about to redirect to isntagram for API authentication. Do you wish to do this now?';
  public options = new Array(
    {
      value: 1,
      display: 'Yes'
    },
    {
      value: 0,
      display: 'No'
    }
  );

  constructor(public dialogRef: MdDialogRef<QuickPromptComponent>) { }
}
