import { Observable } from 'rxjs';

export interface IQuery<T, K extends keyof T>{

	findOne(key: T[K]): Observable<T | undefined>;

	findAll(): Observable<Array<T>>;

}