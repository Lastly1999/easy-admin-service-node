import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const url = request.url;
        const timestamp = new Date().toISOString();
        return next.handle().pipe(
            map((data) => {
                const requestData = { statusCode: 200, message: 'ok', timestamp, url, data };
                Logger.log(JSON.stringify(requestData), 'RequestInterception');
                return requestData;
            }),
        );
    }
}
