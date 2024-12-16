import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Check if session or user data exists in the session
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Not authenticated');
    }
    
    return true;  // Allow the request to proceed
  }
}