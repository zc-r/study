import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { AccordionModule } from 'ng-devui/accordion';

import { TranslateModule } from '@ngx-translate/core';

export const NzComponentModules = [
  NzLayoutModule,
  NzUploadModule,
  NzModalModule,
  NzIconModule,
  NzButtonModule,
  NzSwitchModule,
  NzInputModule,
  NzGridModule,
  NzCardModule,
  NzSpaceModule,
  NzBreadCrumbModule,
  NzBadgeModule,
  NzCollapseModule,
  NzDividerModule,
  NzDropDownModule,
];

export const DComponentModules = [
  AccordionModule
];

export const NGComponentModules = [
  FormsModule,
  CommonModule,
  TranslateModule
]
