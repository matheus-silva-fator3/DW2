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
import { ItemController } from './item/Item.controller';
import { CategoryController } from './category/category.controller';
import { ItemService } from './item/item.service';
import { CategoryService } from './category/category.service';

@Module({
  imports: [],
  controllers: [
    UserController,
    AdminController,
    ItemController,
    CategoryController,
  ],
  providers: [
    UserService,
    PrismaService,
    AdminService,
    ItemService,
    CategoryService,
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
