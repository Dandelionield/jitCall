import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { User } from '@entities/user.entity';

export interface IUserQuery<U extends User, K extends keyof U> extends IQuery<U, K>{

	findOneByUID(key: U[K]): Observable<U | undefined>;

	findOneWithContacts(key: U[K]): Observable<U | undefined>;

}