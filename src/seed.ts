import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

// Entities
import { Company } from './entities/company.entity';
import { User, UserRole } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductStock } from './entities/product-stock.entity';
import {
  StockHistory,
  StockHistoryType,
} from './entities/stock-history.entity';

// 환경변수 설정
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'db',
  entities: [Company, User, Product, ProductStock, StockHistory],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  timezone: 'Z',
});

async function seed() {
  try {
    console.log('🌱 시드 데이터 생성 시작...');

    await AppDataSource.initialize();
    console.log('✅ 데이터베이스 연결 성공');

    // 기존 데이터 정리
    console.log('🧹 기존 데이터 정리 중...');
    await AppDataSource.getRepository(StockHistory).delete({});
    await AppDataSource.getRepository(ProductStock).delete({});
    await AppDataSource.getRepository(Product).delete({});
    await AppDataSource.getRepository(User).delete({});
    await AppDataSource.getRepository(Company).delete({});

    // 1. 회사 생성
    console.log('🏢 회사 생성 중...');
    const company = await createCompany();

    // 2. 사용자들 생성
    console.log('👥 사용자들 생성 중...');
    const users = await createUsers(company);

    // 3. 제품들 생성
    console.log('📦 제품들 생성 중...');
    const products = await createProducts(company);

    // 4. 재고 생성
    console.log('📊 재고 생성 중...');
    const stocks = await createProductStocks(products, company);

    // 5. 입고 히스토리 생성
    console.log('📋 입고 히스토리 생성 중...');
    await createStockHistories(stocks, users);

    console.log('🎉 시드 데이터 생성 완료!');
    console.log('\n📋 생성 결과:');
    console.log(`- 회사: ${company.name}`);
    console.log(`- 사용자: ${users.length}명`);
    console.log(`- 제품: ${products.length}개`);
    console.log('\n🔑 테스트 계정 (비밀번호: qwer1234):');
    users.forEach((user) => {
      console.log(`- ${user.email} (${user.name})`);
    });
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit();
  }
}

async function createCompany(): Promise<Company> {
  const companyRepository = AppDataSource.getRepository(Company);

  const company = companyRepository.create({
    name: '디노드',
  });

  return await companyRepository.save(company);
}

async function createUsers(company: Company): Promise<User[]> {
  const userRepository = AppDataSource.getRepository(User);

  const usersData = [
    { name: '김철수', email: 'kim@denode.co.kr' },
    { name: '이영희', email: 'lee@denode.co.kr' },
    { name: '박민수', email: 'park@denode.co.kr' },
    { name: '최지원', email: 'choi@denode.co.kr' },
    { name: '정하늘', email: 'jung@denode.co.kr' },
  ];

  const users: Partial<User>[] = [];
  const hashedPassword = await bcrypt.hash('qwer1234', 10);

  for (const userData of usersData) {
    users.push({
      name: userData.name,
      email: userData.email,
      hashedPassword,
      role: UserRole.USER,
      companyId: company.id,
    });
  }

  const userEntities = users.map((userData) => userRepository.create(userData));
  return await userRepository.save(userEntities);
}

async function createProducts(company: Company): Promise<Product[]> {
  const productRepository = AppDataSource.getRepository(Product);

  const productsData = [
    { name: '타이레놀', description: '해열진통제 (아세트아미노펜 500mg)' },
    { name: '애드빌', description: '소염진통제 (이부프로펜 200mg)' },
    { name: '게보린', description: '두통완화제 (아스피린 복합제)' },
    { name: '훼스탈', description: '소화제 (판크레아틴 복합제)' },
    { name: '베아제', description: '소화효소제 (베타아밀라아제)' },
    { name: '판콜에이', description: '감기약 (종합감기치료제)' },
  ];

  const products: Partial<Product>[] = [];

  for (const productData of productsData) {
    products.push({
      name: productData.name,
      description: productData.description,
      companyId: company.id,
      isActive: true,
    });
  }

  const productEntities = products.map((productData) =>
    productRepository.create(productData),
  );
  return await productRepository.save(productEntities);
}

async function createProductStocks(
  products: Product[],
  company: Company,
): Promise<ProductStock[]> {
  const productStockRepository = AppDataSource.getRepository(ProductStock);

  const stocks: Partial<ProductStock>[] = [];

  for (const product of products) {
    stocks.push({
      productId: product.id,
      companyId: company.id,
      quantity: faker.number.int({ min: 50, max: 200 }),
      expirationAt: null,
    });

    stocks.push({
      productId: product.id,
      companyId: company.id,
      quantity: faker.number.int({ min: 30, max: 150 }),
      expirationAt: new Date('2025-12-31'),
    });

    stocks.push({
      productId: product.id,
      companyId: company.id,
      quantity: faker.number.int({ min: 30, max: 150 }),
      expirationAt: new Date('2025-12-29'),
    });

    stocks.push({
      productId: product.id,
      companyId: company.id,
      quantity: faker.number.int({ min: 30, max: 150 }),
      expirationAt: new Date('2025-12-28'),
    });
  }

  const stockEntities = stocks.map((stockData) =>
    productStockRepository.create(stockData),
  );
  return await productStockRepository.save(stockEntities);
}

async function createStockHistories(
  stocks: ProductStock[],
  users: User[],
): Promise<void> {
  const stockHistoryRepository = AppDataSource.getRepository(StockHistory);

  const histories: Partial<StockHistory>[] = [];

  for (const stock of stocks) {
    const randomUser = faker.helpers.arrayElement(users);

    histories.push({
      productStockId: stock.id,
      userId: randomUser.id,
      type: StockHistoryType.IN,
      quantity: stock.quantity,
      reason: '시드 데이터 초기 입고',
      totalInbound: stock.quantity,
      totalOutbound: 0,
    });
  }

  const historyEntities = histories.map((historyData) =>
    stockHistoryRepository.create(historyData),
  );
  await stockHistoryRepository.save(historyEntities);
}

// 시드 실행
seed();
