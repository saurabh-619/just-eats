import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/create-account.dto';
import {
  EditProfileInputDto,
  EditProfileOutput,
} from './dtos/edit-profile.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import {
  VerifyEmailInputDto,
  VerifyEmailOutput,
} from './dtos/verify-email.dto';
import { User } from './entities/User.entity';
import { Verification } from './entities/Verification.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepo: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
    try {
      const exists = await this.userRepo.findOne({ email });
      if (exists) {
        // User already exits
        return { ok: false, error: 'User already exists with the same email.' };
      }

      // Create and save
      const user = await this.userRepo.save(
        this.userRepo.create({ email, password, role }),
      );

      // Create verification code for the user
      const verification = await this.verificationRepo.save(
        this.verificationRepo.create({ user }),
      );

      // send code to the email
      this.mailService.sendVerficationEmail(user.email, verification.code);

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
        // error: "Something went wrong. Account couldn't be created. " ,
      };
    }
  }

  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      // Find the user
      const user = await this.userRepo.findOne(
        { email },
        { select: ['password', 'id'] }, // add password field in user as required for checkPassword()
      );
      if (!user) {
        return {
          ok: false,
          error: "User couldn't found",
        };
      }
      // Check the password if its correct
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password.',
        };
      }

      // make a JWT and give it to the user
      console.log({ user });
      const token = this.jwtService.sign({ id: user.id });
      return {
        ok: true,
        token,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepo.findOne(id);
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInputDto,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.userRepo.findOne(userId);
      if (email) {
        user.email = email;
        user.verified = false;

        // Create the code
        const verification = await this.verificationRepo.save(
          this.verificationRepo.create({ user }),
        );
        // send code to the email
        this.mailService.sendVerficationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }

      await this.userRepo.save([{ id: userId, ...user }]);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
      };
    }
  }

  async verifyEmail({ code }: VerifyEmailInputDto): Promise<VerifyEmailOutput> {
    const verification = await this.verificationRepo.findOne(
      { code },
      { relations: ['user'] }, // or loadRelationIds= true to get just id
    );
    try {
      if (verification) {
        verification.user.verified = true;
        this.userRepo.save(verification.user);
        await this.verificationRepo.delete(verification.id);
        return {
          ok: true,
        };
      }
      throw new Error("User doesn't have any assigned code");
    } catch (e) {
      console.log({ e: e.message });
      return {
        ok: false,
        error: 'Something went wrong',
      };
    }
  }
}
