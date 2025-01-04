import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Users } from './users.schema';
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
  GetUserCertDto,
} from './users.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async getById(id: string): Promise<GetUserDto> {
    try {
      const objectId = new Types.ObjectId(id);
      const data = await this.userModel
        .findById(objectId, { password: 0 })
        .sort({ updatedAt: -1 })
        .exec();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getByUsername(username: string): Promise<GetUserDto> {
    try {
      const data = await this.userModel.findOne({ username }).exec();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async GetCredential(username: string): Promise<GetUserCertDto> {
    try {
      const data = await this.userModel.findOne({ username }).exec();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<GetUserDto[]> {
    try {
      const data = await this.userModel
        .find(null, { password: 0 })
        .sort({ updatedAt: -1 })
        .exec();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createData(body: CreateUserDto): Promise<any> {
    try {
      const data = await new this.userModel({ ...body }).save();
      return { userId: data._id };
    } catch (error) {
      throw error;
    }
  }

  async updateData(body: UpdateUserDto): Promise<any> {
    try {
      const objectId = new Types.ObjectId(body.userId);
      await this.userModel.updateOne({ _id: objectId }, { ...body });
      return { userId: body.userId };
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id: string): Promise<any> {
    try {
      const objectId = new Types.ObjectId(id);
      await this.userModel.deleteOne({ _id: objectId }).exec();
      return { userId: id };
    } catch (error) {
      throw error;
    }
  }
}
