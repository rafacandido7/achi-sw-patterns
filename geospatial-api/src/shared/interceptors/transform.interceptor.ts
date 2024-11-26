import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

export interface Response<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        if (!res) return

        if (res.stream) return res

        if (res.data)
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            ...res,
            data: res.data,
          }
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: res,
        }
      }),
    )
  }
}
