import { Playload } from './playload.model';
import { Error } from './error.model';

export interface Ravishing extends Playload{

	_id: string,
	user: string,
	sendedId: string,
	createdAt: Date,
	updatedAt: Date

}

export interface RavishingToken{

	data: {

		access_token: string

	}

}

export function isRavishingToken(t: RavishingToken | Error): t is RavishingToken{

	return t && 'data' in t;

}

export function isRavishing(t: Ravishing | Error): t is Ravishing{

	return t && '_id' in t;

}