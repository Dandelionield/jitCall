import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { User } from '@core/services/user/entities/user.entity';
import { Contact } from '@core/services/contact/entities/contact.entity';

export interface IUserQuery<U extends User, C extends Contact> extends IQuery<U>{

	findOneByContact(contact: C): Observable<U | undefined>;

	//findOneWithContacts(key: U[K]): Observable<U | undefined>;

}