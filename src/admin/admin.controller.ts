import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { HashService } from 'src/services/hash/hash.service';
import { LoginDto, LoginOutput } from './dto/login.dto';
import { JWTService, TokenType } from 'src/services/jwt/jwt.service';
import { AdminService } from './admin.service';
import { AuthInterceptor } from 'src/interceptors/auth.interceptors';
import { UserRole } from '@prisma/client';
import { ReportsOutput } from './dto/reports.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly hashService: HashService,
    private readonly jwtService: JWTService,
  ) {}

  @ApiOperation({
    description:
      'Login para admnistradores, retornará um token que deve ser setado como Authorization header para as proximas requisições. O header precisa começar com "Bearer " e ser acompanhado do jwt.\n Não permite a criação de usuários com emails repetidos.',
  })
  @Post('login')
  async login(
    @Body()
    body: LoginDto,
  ): Promise<LoginOutput> {
    const user = await this.adminService.getUserByEmail(body.email);
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
      'Retorna um relatório de usuários do sistema, necessita autenticação.',
  })
  @UseInterceptors(AuthInterceptor)
  @Get('reports')
  async getReports(
    @Req()
    { id },
  ): Promise<ReportsOutput> {
    const user = await this.adminService.getUsers({
      where: {
        id,
      },
    });
    if (!user) throw new UnauthorizedException();

    let total = 0;

    const usersByRole = {};
    await Promise.all(
      Object.values(UserRole).map(async (role) => {
        usersByRole[role] = await this.adminService.countUsers({
          where: { role: role },
        });

        total += usersByRole[role];
      }),
    );

    return {
      users: (await this.adminService.getUsers({
        where: {
          role: undefined,
        },
        orderBy: {
          id: 'asc',
        },
      })) as any,
      usersByRole: {
        ...usersByRole,
        total,
      },
    };
  }
}
