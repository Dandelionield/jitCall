import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ContactRowComponent } from './components/contact/contact-row/contact-row.component';
import { ContactTabComponent } from './components/contact/contact-tab/contact-tab.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CallComponent } from './components/call/call.component';

import { LoadingService } from './services/loading/loading.service';
import { CallService } from './services/call/call.service';
import { SwalService } from './services/swal/swal.service';

@NgModule({

	declarations: [

		ContactRowComponent,
		ContactTabComponent,
		HeaderComponent,
		LoadingComponent,
		CallComponent

	], imports: [

		CommonModule,
		FormsModule,
		IonicModule.forRoot(),
		ReactiveFormsModule,
		RouterModule

	], exports: [

		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		RouterModule,
		ContactRowComponent,
		ContactTabComponent,
		HeaderComponent,
		LoadingComponent,
		CallComponent

	], providers: [

		LoadingService,
		SwalService,
		CallService

	]

}) export class SharedModule {}