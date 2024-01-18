import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UsersController", () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: "asdf@asdf.com",
          password: "asdf",
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: "asdf" } as User]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: "asdf@asdf.com",
          password: "asdf",
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({ id, ...attrs } as User);
      },
    };

    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return a list of users with given email", async () => {
    const user = await controller.findAllUsers("asdf@asdf.com");
    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual("asdf@asdf.com");
  });

  it("should return a single user with a given id", async () => {
    const user = await controller.findUser("1");
    expect(user).toBeDefined();
  });

  it("throws an error if the user with given id is not found", async () => {
    fakeUsersService.findOne = (id: number) => null;
    expect(controller.findUser("1")).rejects.toThrow(NotFoundException);
  });

  it("should return a user and set userId to session object", async () => {
    const session = { userId: null };
    const user = await controller.login(
      { email: "asdf@asdf.com", password: "asdf" },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
