import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/services/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JWTService,
    private readonly prismaService: PrismaService,
  ) {}

  async intercept(
    req: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const {
      headers: { authorization },
    } = req.getArgs()[0];

    if (!authorization) {
      throw new UnauthorizedException('Token was not provided');
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Malformed token');
    }

    const [, token] = authorization.split(' ');
    const result = this.jwtService.verify<TokenType.AccessToken>(
      token,
      TokenType.AccessToken,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        AND: [{ id: Number(result.sub) }, { status: Status.ACTIVE }],
      },
    });

    if (user === null) {
      throw new UnauthorizedException('Token has expired');
    }

    this.setUserIdInRequestObject(req, Number(result.sub));
    return next.handle();
  }

  setUserIdInRequestObject(req: ExecutionContext, id: number) {
    req.getArgs()[0]['userId'] = id;
  }
}
