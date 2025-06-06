import { NgModule } from '@angular/core';

import { Keyboard } from '@capacitor/keyboard';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ContactListComponent } from './components/contact/contact-list/contact-list.component';
import { ContactRowComponent } from './components/contact/contact-row/contact-row.component';
import { ContactTabComponent } from './components/contact/contact-tab/contact-tab.component';
import { ChatHeaderComponent } from './components/chat/chat-header/chat-header.component';
import { ChatListComponent } from './components/chat/chat-list/chat-list.component';
import { ChatRowComponent } from './components/chat/chat-row/chat-row.component';
import { MessageDisplayListComponent } from './components/message/message-display-list/message-display-list.component';
import { MessageContentRowComponent } from './components/message/message-content-row/message-content-row.component';
import { UserCardComponent } from './components/user/user-card/user-card.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CallComponent } from './components/call/call.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';

import { LoadingService } from './services/loading/loading.service';
import { CallService } from './services/call/call.service';
import { KeyboardService } from './services/keyboard/keyboard.service';
import { SwalService } from './services/swal/swal.service';
import { ContactTabService } from './services/contact-tab/contact-tab.service';

@NgModule({

	declarations: [

		ContactListComponent,
		ContactRowComponent,
		ContactTabComponent,
		ChatHeaderComponent,
		ChatListComponent,
		ChatRowComponent,
		MessageDisplayListComponent,
		MessageContentRowComponent,
		UserCardComponent,
		HeaderComponent,
		LoadingComponent,
		CallComponent,
		KeyboardComponent

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
		ContactListComponent,
		ContactRowComponent,
		ContactTabComponent,
		ChatHeaderComponent,
		ChatListComponent,
		ChatRowComponent,
		MessageDisplayListComponent,
		MessageContentRowComponent,
		UserCardComponent,
		HeaderComponent,
		LoadingComponent,
		CallComponent,
		KeyboardComponent

	], providers: [

		LoadingService,
		SwalService,
		CallService,
		ContactTabService,
		KeyboardService, {

			provide: Keyboard,
			useValue: Keyboard

		}

	]

}) export class SharedModule {}