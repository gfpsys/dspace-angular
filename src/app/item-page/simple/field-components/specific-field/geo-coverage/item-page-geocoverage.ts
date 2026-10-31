import { Component, Input } from '@angular/core';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { MetadataUriValuesComponent } from '../../../../field-components/metadata-uri-values/metadata-uri-values.component';
import { GenericItemPageFieldComponent } from '../../../field-components/specific-field/generic/generic-item-page-field.component';
import { ItemPageUriFieldComponent } from '../../../field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-geocoverage',
  styleUrls: ['./item-page-geocoverage.component.scss'],
  templateUrl: './item-page-geocoverage.component.html',
  imports: [
    MetadataUriValuesComponent,
    GenericItemPageFieldComponent,
    ItemPageUriFieldComponent,
    TranslateModule,
  ],
})
/**
 * This component can be used to represent any uri on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageGeoCoverageComponent extends ItemPageFieldComponent {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

}