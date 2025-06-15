import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User as UserEntity, Company } from '@entities/index';
import { SignupDto } from '../dtos/requests/signup.dto';
import { LoginDto } from '../dtos/requests/login.dto';
import { AuthExceptions, CompanyExceptions } from '@core/exceptions/domains';
import { User } from '@api/user/domains/user';
import { AuthUserData } from '../interfaces/interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async signup(signupDto: SignupDto) {
    const newUser = User.create(signupDto);

    const [selectedUser, selectedCompany] = await Promise.all([
      this.userRepository.findOne({ where: { email: newUser.email } }),
      this.companyRepository.findOneBy({ id: newUser.companyId }),
    ]);

    if (selectedUser) {
      throw new AuthExceptions.EmailAlreadyExists();
    }
    if (!selectedCompany) {
      throw new CompanyExceptions.NotFound();
    }

    await this.userRepository.save(newUser.toDbInput);
  }

  async login({ email, password }: LoginDto): Promise<AuthUserData> {
    const selectedUser = await this.userRepository.findOneBy({ email });
    if (!selectedUser) {
      throw new AuthExceptions.InvalidCredentials();
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      selectedUser.hashedPassword,
    );
    if (!isPasswordValid) {
      throw new AuthExceptions.InvalidCredentials();
    }

    return {
      userId: selectedUser.id,
      companyId: selectedUser.companyId,
      email: selectedUser.email,
      role: selectedUser.role,
    };
  }
}
