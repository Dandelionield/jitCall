import { Observable} from 'rxjs';
import { IQuery } from '@interfaces/query/query.interface';
import { User } from '@core/services/user/entity/user.entity';
import { Contact } from '@core/services/contact/entity/contact.entity';

export interface IUserQuery<U extends User = User> extends IQuery<U>{

	findOneByContact<C extends Contact = Contact>(contact: C['contact']): Promise<U | undefined>;

	//findOneWithContacts(key: U[K]): Observable<U | undefined>;

}