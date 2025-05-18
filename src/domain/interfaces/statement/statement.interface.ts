import { Entity } from '@models/entity.model';

export interface IStatement<T extends Entity<unknown>>{

	insert(entity: T): Promise<T['id'] | undefined>;

	update(key: T['id'], entity: Partial<T>): Promise<boolean>;

	delete(key: T['id']): Promise<boolean>;

}