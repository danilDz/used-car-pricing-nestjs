import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dto/user.dto";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post("/signup")
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  ///
  /// All the routes below ONLY for practice, not for real production
  ///

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException(`User with id ${id} not found!`);
    return user;
  }

  @Get("/")
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email);
  }

  @Patch("/:id")
  updateUser(@Body() body: UpdateUserDto, @Param("id") id: string) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
