import { IQuery } from '@interfaces/query/query.interface';
import { Observable} from 'rxjs';
import { User } from '@core/services/user/entity/user.entity';
import { Chat } from '@core/services/chat/entity/chat.entity';

export interface IChatQuery<C extends Chat = Chat> extends IQuery<C>{

	findAllByUser<U extends User = User>(user_key: U['id']): Observable<Array<C>>;

}