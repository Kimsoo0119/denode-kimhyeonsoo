import { TokenPayload } from '@api/auth/interfaces/interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthorizedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayload => {
    const { user } = ctx.switchToHttp().getRequest();

    return user;
  },
);
