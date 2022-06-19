import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // 以下根据自己业务进行调整
        // 错误码
        // 此处给默认的状态码默认加了2位，自定义的状态码不必在意，只是想跟http状态码有个区分
        const statusCode = exception.getStatus();
        const message = exception.message;
        const url = request.originalUrl;
        const timestamp = new Date().toISOString();

        // 整理返回全部的错误信息
        const errorResponse = {
            message, // 错误提示
            data: null,
            statusCode, // 自定义code
            timestamp,
            url, // 错误的url地址
        };
        Logger.error(JSON.stringify(errorResponse), 'ErrorInterception');
        // http状态码响应，没有就是500
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        // 设置返回的状态码、请求头、发送错误信息
        response.status(status);
        response.header('Content-Type', 'application/json; charset=utf-8');
        response.send(errorResponse);
    }
}
