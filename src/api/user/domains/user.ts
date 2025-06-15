import { UserExceptions } from '@core/exceptions/domains';
import { hashPassword, validatePassword } from '@shared/utils';
import { validateEmail } from '@shared/utils';

export class User {
  private id: number;
  private _email: string;
  private _name: string;
  private _hashedPassword: string;
  private _companyId: number;
  private _createdAt: Date;

  private constructor() {}

  private static validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new UserExceptions.EmptyName();
    }
  }

  static create(params: {
    email: string;
    name: string;
    password: string;
    companyId: number;
  }): User {
    const { email, name, password, companyId } = params;
    const user = new User();

    validatePassword(password);
    validateEmail(email);
    User.validateName(name);

    user._email = email;
    user._name = name;
    user._hashedPassword = hashPassword(password);
    user._companyId = companyId;

    return user;
  }

  get email() {
    return this._email;
  }

  get companyId() {
    return this._companyId;
  }

  /**
   * 데이터베이스 입력 형식으로 반환합니다.
   * 현재는 간단한 매핑이지만, 추후 로직이 복잡해지면 별도의 매퍼 클래스로 분리할 수 있습니다.
   */
  get toDbInput() {
    return {
      email: this._email,
      name: this._name,
      hashedPassword: this._hashedPassword,
      companyId: this._companyId,
    };
  }
}
