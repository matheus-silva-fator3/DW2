import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from 'src/services/hash/hash.service';
import { LoginDto, LoginOutput } from './dto/login.dto';
import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JWTService,
  ) {}

  @ApiOperation({
    description:
      'Login para usuários comuns, retornará um token que deve ser setado como Authorization header para as proximas requisições. O header precisa começar com "Bearer " e ser acompanhado do jwt. Não permite a criação de usuários com emails repetidos.',
  })
  @Post('login')
  async login(
    @Body()
    body: LoginDto,
  ): Promise<LoginOutput> {
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) throw new UnauthorizedException('Wrong credentials');

    const passwordMatch = await this.hashService.compare(
      body.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new UnauthorizedException('Wrong credentials');

    return {
      accessToken: this.jwtService.sign<TokenType.AccessToken>(
        { sub: user.id },
        TokenType.AccessToken,
      ),
    };
  }

  @ApiOperation({
    description:
      'Altera o nome ou senha de um usuario cujo id foi passado como parametro na requisição, requer autenticação para seu uso.',

    parameters: [
      { name: 'id', in: 'query' },
      { name: 'authorization', in: 'header' },
    ],
  })
  @Put(':id')
  @UseInterceptors(AuthInterceptor)
  async updateUser(
    @Body()
    body: UpdateUserDto,
    @Param()
    { id },
  ) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('You havent provided a valid id');
    }

    if (!body.name && !body.password) {
      throw new BadRequestException('You have to pass something');
    }

    const hashedPassword = body.password
      ? await this.hashService.hash(body.password)
      : undefined;

    await this.userService.updateUser(userId, body.name, hashedPassword);
  }

  @ApiOperation({
    description:
      'Deleta um usuario cujo id foi passado como parametro na requisição, requer autenticação para seu uso.',
    parameters: [
      { name: 'id', in: 'query' },
      { name: 'authorization', in: 'header' },
    ],
  })
  @Delete(':id')
  @UseInterceptors(AuthInterceptor)
  async deleteUser(
    @Param()
    { id },
  ) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('You havent provided a valid id');
    }

    const user = await this.userService.getUsers({
      where: {
        id: userId,
      },
    });
    if (user.length === 0) {
      throw new NotFoundException(`Could not found user with id ${userId}`);
    }

    await this.userService.deleteUser(userId);
  }

  @ApiOperation({
    description: 'Cria um usuário.',
  })
  @Post('signup')
  async createUser(
    @Body()
    body: CreateUserDto,
  ): Promise<void> {
    await this.checkUserEmailAvaliability(body.email);
    const hashedPassword = await this.hashService.hash(body.password);

    await this.userService.createUser(
      body.name,
      body.email,
      hashedPassword,
      body.role,
    );
  }

  private async checkUserEmailAvaliability(email: string) {
    const user = await this.userService.getUsers({
      where: {
        email: email,
        role: undefined,
        status: undefined,
      },
    });

    if (user.length > 0) {
      throw new ConflictException('This email is already taken');
    }
  }
}
