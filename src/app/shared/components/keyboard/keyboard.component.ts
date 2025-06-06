import { Component, OnInit } from '@angular/core';
import { KeyboardService } from '@shared/services/keyboard/keyboard.service';
import { Observable } from 'rxjs';

@Component({

	selector: 'app-keyboard',
	templateUrl: './keyboard.component.html',
	styleUrls: ['./keyboard.component.scss'],
	standalone: false

}) export class KeyboardComponent implements OnInit {

	public keyboardHeight$: Observable<number> = this.keyboardService.keyboardHeight$;

	public constructor(private keyboardService: KeyboardService) { }

	public ngOnInit() {}

}