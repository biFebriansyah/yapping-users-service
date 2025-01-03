import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './users.service';
import { HashPass } from '../utils/bcrypt';
import { horoscopeGenerate, zodiacGenerate } from '../utils/zodiacHoroscope';
import {
  GetUserDto,
  CreateUserDto,
  GetParams,
  UpdateUserDto,
} from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindByUsername')
  async FindByUsername(params: GetParams): Promise<GetUserDto> {
    try {
      const respone = this.userService.getByUsername(params.username);
      return respone;
    } catch (error) {
      throw error;
    }
  }

  @Get('/uid')
  @GrpcMethod('UserService', 'FindById')
  async FindById(@Param() params: GetParams): Promise<GetUserDto> {
    try {
      const respone = this.userService.getById(params.userId);
      return respone;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @GrpcMethod('UserService', 'FetchAll')
  async FetchAll(): Promise<{ users: GetUserDto[] }> {
    try {
      const respone = await this.userService.getAll();
      return { users: respone };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @GrpcMethod('UserService', 'CreateData')
  async CreateData(@Body() body: CreateUserDto): Promise<any> {
    try {
      const password = await HashPass(body.password);
      const respone = this.userService.createData({ ...body, password });
      return respone;
    } catch (error) {
      throw error;
    }
  }

  @Put()
  @GrpcMethod('UserService', 'UpdateData')
  async UpdateData(@Body() body: UpdateUserDto): Promise<any> {
    try {
      const horoscope = await horoscopeGenerate(body.birthday);
      const zodiac = await zodiacGenerate(body.birthday);
      const respone = this.userService.updateData({
        ...body,
        horoscope,
        zodiac,
      });
      return respone;
    } catch (error) {
      throw error;
    }
  }
}
