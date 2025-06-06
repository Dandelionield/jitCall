import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({

	providedIn: 'root'

}) export class KeyboardService {

	private keyboardHeight: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public keyboardHeight$: Observable<number> = this.keyboardHeight.asObservable();

	public constructor() {

		if (Capacitor.getPlatform() !== 'web'){

			this.initializeKeyboardListeners();

		}

	}

	private initializeKeyboardListeners(): void {

		Keyboard.addListener('keyboardWillShow', (info) => {

			this.keyboardHeight.next(info.keyboardHeight);

		});

		Keyboard.addListener('keyboardWillHide', () => {

			this.keyboardHeight.next(0);

		});

	}

	public async hideKeyboard(): Promise<void> {

		if (Capacitor.getPlatform() !== 'web'){

			Keyboard.hide();

		}

	}

	public showKeyboard() {

		

	}

	public getKeyboardHeight(): number {

		return this.keyboardHeight.value;

	}

}