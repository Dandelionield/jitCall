import { Observable } from 'rxjs';
import { RavishingToken } from '@models/ravishing.model';
import { Error } from '@models/error.model';
import { Credential } from '@models/credential.model';

export interface IRavishingQuery<T extends RavishingToken, C extends Credential, E extends Error>{

	findToken(cred: C): Observable<T | E>;

}