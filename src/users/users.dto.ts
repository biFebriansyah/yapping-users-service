type CreateUserDto = {
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly picture?: string;
};

type GetUserCertDto = {
  readonly _id: any;
  readonly email: string;
  readonly username: string;
  readonly password: string;
};

type UpdateUserDto = {
  readonly _id: string;
  readonly name: string;
  readonly gender?: string;
  readonly birthday: string;
  readonly picture?: string;
  readonly horoscope?: string;
  readonly zodiac?: string;
  readonly height?: number;
  readonly weight?: number;
  readonly email?: string;
};

type GetUserDto = {
  readonly _id: any;
  readonly name: string;
  readonly gender: string;
  readonly picture: string;
  readonly birthday: Date;
  readonly horoscope: string;
  readonly zodiac: string;
  readonly height: number;
  readonly weight: number;
  readonly email: string;
  readonly username: string;
};

type GetParams = {
  userId?: string;
  username?: string;
};

export { CreateUserDto, GetUserDto, GetParams, UpdateUserDto, GetUserCertDto };
