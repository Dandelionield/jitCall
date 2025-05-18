import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { Contact } from '@core/services/contact/entities/contact.entity';
import { User } from '@core/services/user/entities/user.entity';

export interface IContactQuery<C extends Contact> extends IQuery<C>{

	findByName(name: C['name']): Observable<Array<C>>;

	findOneByContactWithSuperKey<U extends User>(superKey: U['id'], contact: C['contact']): Promise<C | undefined>;

}