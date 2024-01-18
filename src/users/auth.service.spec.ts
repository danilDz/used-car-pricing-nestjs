import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it("can create an instance of AuthService", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with salted an hashed password", async () => {
    const user = await service.signup("asdf@gmail.com", "asdf");
    expect(user.password).not.toEqual("asdf");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user signs up with email that is in use", async () => {
    await service.signup("asdf@asdf.com", "asdf");
    await expect(service.signup("asdf@asdf.com", "asdf")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("throws an error if signin is called with an unused email", async () => {
    await expect(service.signin("adas@adas.com", "asdf")).rejects.toThrow(
      NotFoundException,
    );
  });

  it("throws an error if the password is invalid", async () => {
    await service.signup("asdf@asdf.com", "asd");
    await expect(service.signin("asdf@asdf.com", "asdf")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("returns a user if correct password is provided", async () => {
    await service.signup("asdf@asdf.com", "asdf");
    const user = await service.signin("asdf@asdf.com", "asdf");
    expect(user).toBeDefined();
  });
});
