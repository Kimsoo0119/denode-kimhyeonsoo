import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity, Company } from '@entities/index';
import { SignupDto } from '../dtos/requests/signup.dto';
import { AuthExceptions, CompanyExceptions } from '@core/exceptions/domains';
import { User } from '@api/user/domains/user';

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
}
