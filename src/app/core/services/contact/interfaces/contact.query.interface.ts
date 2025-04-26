import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';

export interface IContactQuery<C extends Contact, K extends keyof C> extends IQuery<C, K>{

	findByName(name: C['name']): Observable<Array<C>>;

	findOneByContactWithSuperKey<U extends User>(superKey: U['id'], contact: C['contact']): Promise<C | undefined>;

}