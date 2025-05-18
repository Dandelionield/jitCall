import { Entity } from '@models/entity.model';
import { Observable } from 'rxjs';

export interface IQuery<T extends Entity<unknown>>{

	findOne(key: T['id']): Promise<T | undefined>;

	findAll(): Observable<Array<T>>;

}