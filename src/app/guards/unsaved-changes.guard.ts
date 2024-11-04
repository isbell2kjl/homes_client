import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanComponentDeactivate } from './unsaved-changes.interface';

@Injectable({
  providedIn: 'root',
})

export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate>  {
  canDeactivate(component: CanComponentDeactivate): boolean {
    if (component.isFormDirty()){
      return confirm('You have unsaved changes.  Are you sure you want leave?');
    }
    return true;
  }
};
