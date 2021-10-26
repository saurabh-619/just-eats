import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { User } from './entities/User.entity';
import { UserService } from './users.service';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/create-account.dto';
import { LoginOutputDto, LoginInputDto } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './../auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileDto, UserProfileOutput } from './dtos/user-profile.dto';
import {
  EditProfileInputDto,
  EditProfileOutput,
} from './dtos/edit-profile.dto';
import {
  VerifyEmailInputDto,
  VerifyEmailOutput,
} from './dtos/verify-email.dto';
import { Role } from 'src/auth/role.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  helloUser() {
    return 'hello User';
  }

  @Mutation(() => CreateAccountOutputDto)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInputDto,
  ): Promise<CreateAccountOutputDto> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutputDto)
  login(@Args('input') loginInput: LoginInputDto): Promise<LoginOutputDto> {
    return this.userService.login(loginInput);
  }

  @Query(() => User)
  @Role(['Any'])
  me(@AuthUser() loggedInUser: User) {
    return loggedInUser;
  }

  @Query(() => UserProfileOutput)
  @Role(['Any'])
  async userProfile(
    @Args() userProfileDto: UserProfileDto,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.userService.findById(userProfileDto.userId);

      if (!user) throw new Error();

      return {
        ok: Boolean(user),
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: "User couldn't found",
      };
    }
  }

  @Mutation(() => EditProfileOutput)
  @Role(['Any'])
  editProfile(
    @AuthUser() { id }: User,
    @Args('input') editProfileInput: EditProfileInputDto,
  ) {
    return this.userService.editProfile(id, editProfileInput);
  }

  @Mutation(() => VerifyEmailOutput)
  verifyEmail(
    @Args('input') verifyEmailInputDto: VerifyEmailInputDto,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailInputDto);
  }
}
