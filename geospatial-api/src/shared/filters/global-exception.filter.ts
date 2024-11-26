import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = 500 // default status

    // Check if exception has getStatus method
    if (typeof exception.getStatus === 'function') {
      status = exception.getStatus()
    }
    // Check if exception has statusCode property
    else if (exception.statusCode) {
      status = exception.statusCode
    }

    let res = { ...exception }

    // Check if exception has getStatus method
    if (typeof exception.getResponse === 'function') {
      res = exception.getResponse()
    }

    if (status === 500) {
      response.status(status).json({
        statusCode: status,
        message: 'Internal Server error...',
        ...(exception && {
          details: { ...exception, message: exception.message },
        }),
      })
    } else {
      response.status(status).json(res)
    }
  }
}
