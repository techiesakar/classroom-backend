import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Observable } from "rxjs"
import { map } from "rxjs/operators"

interface RoomConstructor {
    new(...args: any[]): {}
}
export function Serialize(dto: RoomConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor<T> implements NestInterceptor {
    constructor(private dto: RoomConstructor) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        );
    }
}