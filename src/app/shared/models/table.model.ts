import { ElementRef, TemplateRef } from '@angular/core';
/* import { TextMaskConfig } from 'angular2-text-mask';
import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
  BsDatepickerConfig,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker'; */

export interface TableConfig {
  Caption: string;
  Header: TableHeader;
  Columns: Array<TableColumn>;
  ColumnButton: Boolean;
  AddButton: Boolean;
  AddButtonConfig: buttonConfig;
  ResetButton: Boolean;
  ResetButtonConfig: buttonConfig;
  ExportButton: Boolean;
  ExportButtonConfig: buttonConfig;
  Pagination: Boolean;
  PaginationType: 'Static' | 'Dynamic';
  SortingType: 'Static' | 'Dynamic';
  SearchType: 'Static' | 'Dynamic';
  Searchable: Boolean;
  PageSizeChanger: Boolean;
  PageSizesList: Array<Number>;
  rowSelectable: Boolean;
  selectedRowClassName: string;
  noDataLabel: string;
}

export interface TableHeader {
  showColumnToggle?: Boolean;
  showSearch?: Boolean;
  showAdd?: Boolean;
  addTooltipText?: string;
  showReset?: Boolean;
  resetTooltipText?: string;
  showDownload?: Boolean;
  downloadTooltipText?: string;
  showUpload?: Boolean;
  uploadTooltipText?: string;
  showClose?: Boolean;
  closeTooltipText?: string;
}

export interface TableColumn {
  name: string;
  dataType: 'date' | 'date_range' | 'price_range' | 'date_time' | 'decimal' | 'number' | 'text' | 'custom' | 'image';
  property: string;
  imgClass: string;
  visible: Boolean;
  canNotHide: Boolean;
  searchable: Boolean;
  searchValue: string;
  sortable: Boolean;
  sortOrder: 'asc' | 'desc' | '';
  columnWidth: string | 'auto';
  SearchFormTemplate?: TemplateRef<any> | ElementRef<any>;
  clickableCell?: Boolean;
  isHtml?: Boolean;
  actionTemplate?: TemplateRef<any>;
  advanceFilter?: {
    dataType: 'text' | 'number' | 'date' | 'date_range' | 'date_time' | 'dropdown' | 'and_or_dropdown' | 'price_range';
    // For Text filter
    placeholder?: string;
    searchQuery?: string;
    /* See Doc Here : https://valor-software.com/ngx-bootstrap/#/components/datepicker?tab=api */
    // dpConfig: BsDatepickerConfig;
    // dprConfig: BsDaterangepickerConfig;
    /* See Doc Here : https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#readme */
    // textMask?: TextMaskConfig;
    // For Dropdown filter only
    dropdownItems?: Array<any>;
    dropdownItems_bindLabel?: any;
    dropdownItems_bindValue?: any;
    // For Price Range filter only
    minInputPlaceholder?: string;
    maxInputPlaceholder?: string;
  };
}

interface buttonConfig {
  Icon?: string;
  Text?: string;
}
