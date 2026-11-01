import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { FileSectionComponent } from './file-section.component';

@Component({
  selector: 'ds-item-page-file-section',
  templateUrl: '../../../../shared/theme-support/themed.component.html',
})
export class ThemedFileSectionComponent extends ThemedComponent<FileSectionComponent> {

    @Input() item: Item;

    @Input() fileLabel: string;

    protected inAndOutputNames: (keyof FileSectionComponent & keyof this)[] = ['item', 'fileLabel'];

    protected getComponentName(): string {
      return 'FileSectionComponent';
    }

    protected importThemedComponent(themeName: string): Promise<any> {
      return import(`./file-section.component`);
    }

    protected importUnthemedComponent(): Promise<any> {
      return import(`./file-section.component`);
    }

}
