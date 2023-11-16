import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({
    description: 'Lista todas as categorias não deletadas.',
  })
  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getAllCategories();
  }

  @ApiOperation({
    description: 'Cria uma categoria para classificação de itens.',
  })
  @UseInterceptors(AuthInterceptor)
  @Post()
  async createCategory(
    @Body()
    body: CreateCategoryDto,
  ) {
    await this.categoryService.createCategory(body.name, body.description);
  }

  @ApiOperation({
    description: 'Atualiza uma categoria pelo seu id.',
    parameters: [
      { name: 'id', in: 'query' },
      { name: 'authorization', in: 'header' },
    ],
  })
  @Put(':id')
  @UseInterceptors(AuthInterceptor)
  async updateCategory(
    @Body()
    body: UpdateCategoryDto,
    @Param()
    { id },
  ) {
    await this.categoryService.updateCategory(
      Number(id),
      body.name,
      body.description,
    );
  }

  @ApiOperation({
    description: 'Exclui logicamente uma categoria pelo seu id.',
    parameters: [
      { name: 'id', in: 'path' },
      { name: 'authorization', in: 'header' },
    ],
  })
  @Delete(':id')
  @UseInterceptors(AuthInterceptor)
  async softDeleteCategory(@Param('id') id: string) {
    await this.categoryService.softDeleteCategory(Number(id));
  }
}
