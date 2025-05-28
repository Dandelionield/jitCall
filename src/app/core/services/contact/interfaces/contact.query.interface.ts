import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { User } from '@core/services/user/entity/user.entity';

export interface IContactQuery<C extends Contact = Contact> extends IQuery<C>{

	findByName(name: C['name']): Observable<Array<C>>;

	findOneByContactWithSuperKey<U extends User = User>(superKey: U['id'], contact: C['contact']): Promise<C | undefined>;

}