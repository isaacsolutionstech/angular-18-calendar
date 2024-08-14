import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './api.service';

@NgModule({
  declarations: [],
  providers: [ApiService],
  imports: [CommonModule, HttpClientModule],
})
export class ApiModule {}
