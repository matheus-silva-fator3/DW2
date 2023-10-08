import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { User, Prisma, Status, UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    return await this.prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: password,
        status: Status.ACTIVE,
        role,
      },
    });
  }

  async updateUser(
    id: number,
    name: string | undefined,
    hashedPassword: string | undefined,
  ) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        hashedPassword,
      },
    });
  }

  async deleteUser(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: Status.INACTIVE,
      },
    });
  }

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
      where: { status: Status.ACTIVE, role: { not: UserRole.ADMIN }, ...where },
      orderBy,
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers({
      where: {
        email,
      },
    });

    return users.length === 1 ? users[0] : null;
  }
}
