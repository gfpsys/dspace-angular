import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { MetadataUriValuesComponent } from '../../../../field-components/metadata-uri-values/metadata-uri-values.component';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { MetadataFieldWrapperComponent } from '../../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

@Component({
  selector: 'ds-item-page-uri-compound-field',
  templateUrl: './item-page-uri-compound-field.component.html',
  styleUrls: ['./item-page-uri-compound-field.component.scss'],
  imports: [
    MetadataUriValuesComponent,
    MetadataFieldWrapperComponent,
    TranslateModule,
  ],
})
/**
 * This component can be used to represent any uri on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageUriCompoundFieldComponent extends ItemPageFieldComponent {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;
  /**
   * The link text to display instead of the metadata value (uri)
   */
  @Input() link: string;
  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  mdValues() : any[] {
    return this.item?.allMetadata(this.fields) || [];
  }

}

