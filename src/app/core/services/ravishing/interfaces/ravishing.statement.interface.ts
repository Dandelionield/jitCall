import { Observable } from 'rxjs';
import { Ravishing } from '@models/ravishing.model';
import { Playload } from '@models/playload.model';
import { Error } from '@models/error.model';

export interface IRavishingStatement<R extends Ravishing, L extends Playload, E extends Error>{

	send(L: Playload): Observable<R | E>;

}