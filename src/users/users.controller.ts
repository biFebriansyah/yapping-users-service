import { Controller, Param } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './users.service';
import { HashPass } from '../utils/bcrypt';
import { status } from '@grpc/grpc-js';
import { horoscopeGenerate, zodiacGenerate } from '../utils/zodiacHoroscope';
import { avatarDumy } from '../utils/dumy';
import {
  GetUserDto,
  CreateUserDto,
  GetParams,
  UpdateUserDto,
  GetUserCertDto,
} from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindByUsername')
  async FindByUsername(params: GetParams): Promise<GetUserDto> {
    try {
      const respone = await this.userService.getByUsername(params.username);
      if (!respone) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Username Not Found',
        });
      }

      return respone;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }

  @GrpcMethod('UserService', 'FatchCert')
  async FatchCert(params: GetParams): Promise<GetUserCertDto> {
    try {
      const respone = await this.userService.GetCredential(params.username);
      if (!respone) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Username Not Found',
        });
      }

      return respone;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }

  @GrpcMethod('UserService', 'FindById')
  async FindById(params: GetParams): Promise<GetUserDto> {
    try {
      const respone = await this.userService.getById(params.userId);
      if (!respone) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'UserId Not Found',
        });
      }

      return respone;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }

  @GrpcMethod('UserService', 'FetchAll')
  async FetchAll(): Promise<{ users: GetUserDto[] }> {
    try {
      const respone = await this.userService.getAll();
      return { users: respone };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }

  @GrpcMethod('UserService', 'CreateData')
  async CreateData(body: CreateUserDto): Promise<any> {
    try {
      const randNum = Math.floor(Math.random() * avatarDumy.length);
      const password = await HashPass(body.password);
      const respone = await this.userService.createData({
        ...body,
        password,
        picture: avatarDumy[randNum],
      });
      return respone;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }

  @GrpcMethod('UserService', 'UpdateData')
  async UpdateData(body: UpdateUserDto): Promise<any> {
    try {
      const horoscope = await horoscopeGenerate(body.birthday);
      const zodiac = await zodiacGenerate(body.birthday);
      const respone = await this.userService.updateData({
        ...body,
        horoscope,
        zodiac,
      });
      return respone;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }

  @GrpcMethod('UserService', 'DeleteData')
  async DeleteData(params: GetParams): Promise<any> {
    try {
      const respone = await this.userService.deleteOne(params.userId);
      return respone;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
}
