import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor 
{
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor)
{
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }


}

















// export class SerializeInterceptor implements NestInterceptor{
//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//         return next.handle().pipe(
//             map((data: any) => {
//                 return plainToClass(UserDto, data, {
//                     excludeExtraneousValues: true
//                 })
//             })
//         )
//     }


// }