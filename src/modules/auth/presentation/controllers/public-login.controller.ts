import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { LoginUseCase } from '../../application/use-cases/login.use-case'
import { Token } from '../../domain/value-objects/token.vo'
import { LoginRequest } from '../dtos/login.request.dto'
import { LoginResponseDto } from '../dtos/login.responsity.dto'
import { toTokenDto } from '../mappers/login.mapper'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'

@Controller('login')
export class PublicLoginController {
  private readonly _loginUseCase: LoginUseCase

  constructor(loginUseCase: LoginUseCase) {
    this._loginUseCase = loginUseCase
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginRequest,
  ): Promise<ResponseDto<LoginResponseDto>> {
    const token: Token = await this._loginUseCase.execute({
      email: body.email,
      password: body.password,
    })

    return new ResponseDto<LoginResponseDto>({
      message: 'Login successfully',
      data: toTokenDto(token),
    })
  }
}
