import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './services/prisma.service';
import { UserController } from './user/user.controller';
import { BcryptService } from './services/hash/implementations/bcrypt.service';
import { HashService } from './services/hash/hash.service';
import { JWTService } from './services/jwt/jwt.service';
import { JsonWebTokenService } from './services/jwt/implementations/jsonwebtoken.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [],
  controllers: [UserController, AdminController],
  providers: [
    UserService,
    PrismaService,
    AdminService,
    {
      provide: HashService,
      useClass: BcryptService,
    },
    {
      provide: JWTService,
      useClass: JsonWebTokenService,
    },
  ],
})
export class AppModule {}
