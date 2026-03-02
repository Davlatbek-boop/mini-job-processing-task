import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class UserSelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request | any = context.switchToHttp().getRequest();

    const person = req.person;

    if (person.role != 'ADMIN') {
      if (person.id != req.params.id) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
    }

    return true;
  }
}
