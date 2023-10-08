import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { User, Prisma, Status, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: { status: Status.ACTIVE, role: UserRole.ADMIN, ...where },
      orderBy,
    });
  }

  async countUsers(params: { where?: Prisma.UserWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.user.count({
      where: { status: Status.ACTIVE, role: UserRole.ADMIN, ...where },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers({
      where: {
        email,
        role: UserRole.ADMIN,
      },
    });

    return users.length === 1 ? users[0] : null;
  }
}
