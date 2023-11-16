import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Category } from '.prisma/client';
import { Status } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string, description: string): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name,
        description,

        status: Status.ACTIVE,
      },
    });
  }

  async updateCategory(
    id: number,
    name: string,
    description: string,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
        status: Status.ACTIVE,
      },
      data: {
        name,
        description,
      },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        status: Status.ACTIVE,
      },
    });
  }

  async softDeleteCategory(id: number): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
        status: Status.ACTIVE,
      },
      data: {
        status: Status.INACTIVE,
      },
    });
  }
}
