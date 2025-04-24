import { Observable } from 'rxjs';
import { Ravishing } from '@models/ravishing.api.response';

export interface IRavishingQuery<R extends Ravishing>{

	findToken(): Observable<R>;

}