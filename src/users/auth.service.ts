import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const existedUser = await this.usersService.find(email);
    if (existedUser.length)
      throw new BadRequestException("User with this email already exists!");
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + "." + hash.toString("hex");
    const newUser = await this.usersService.create(email, hashedPassword);
    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException("User with this email not found!");
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) throw new BadRequestException("Wrong password!");
    return user;
  }
}
