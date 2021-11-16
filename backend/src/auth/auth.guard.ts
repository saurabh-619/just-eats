import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // canActivates returns true if request should be continued
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      // No metadata -> public route
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();

    console.log({ gqlContext });
    const token = gqlContext['token'];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.findById(decoded['id']);
          if (!user) {
            return false;
          }

          gqlContext['user'] = user;

          if (roles.includes('Any')) {
            // Any user can use
            return true;
          }
          return roles.includes(user.role);
        } else {
          return false;
        }
      } catch (e) {
        console.log({ e: e.message });
      }
    } else {
      return false;
    }
  }
}
