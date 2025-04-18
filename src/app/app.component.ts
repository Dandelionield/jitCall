import { Component } from '@angular/core';
import { CapacitorService } from '@core/services/capacitor/capacitor.service';

@Component({

	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	standalone: false

}) export class AppComponent {

	public constructor(private capacitorService: CapacitorService) {

		this.capacitorService.init();

	}

}
