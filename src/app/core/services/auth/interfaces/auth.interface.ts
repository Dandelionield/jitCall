import { Credential } from '@models/credential.model';
import { User } from '@core/services/user/entities/user.entity'; 

export interface IAuth<T extends Credential, U extends User>{

	login(cred: T): Promise<string | undefined>;

	logup(cred: T, user: U): Promise<string | undefined>;

	logout(): Promise<void>;

}