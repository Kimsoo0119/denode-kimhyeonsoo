# 디노드 백엔드 엔지니어 채용 과제 - 재고 관리 시스템

## 🚀 실행 방법

### 1. 환경 변수

```env
# 데이터베이스 설정
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=db

# JWT 설정
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```

### 2. Docker Compose로 실행

```bash
# 서비스 실행
docker-compose up -d
```

## 📖 API 문서

### Swagger UI 접속

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

```
http://localhost:3000/docs
```

### 주요 API 엔드포인트

#### 🔐 인증 (Auth)

- `POST /auth/signup` - 회원가입 (소속 회사는 미리 생성해야합니다.)
- `POST /auth/login` - 로그인

#### 📦 제품 관리 (Products)

- `POST /products` - 제품 등록
- `GET /products` - 제품 목록 조회 (페이지네이션)
- `GET /products/:productId/stocks` - 제품별 재고 목록 조회 (페이지네이션)
- `POST /products/:productId/inbound` - 제품 입고
- `POST /products/:productId/outbound` - 제품 출고

#### 📊 재고 히스토리 (Stocks)

- `GET /stocks/:stockId/histories` - 재고 이력 조회 (페이지네이션)

## 🔑 주요 기능

### 1. 회원가입 및 로그인 (JWT)

- bcrypt를 이용한 비밀번호 암호화
- JWT 기반 인증 시스템
- Access Token과 Refresh Token 분리

### 2. 제품 관리

- 제품 등록 및 조회
- 회사별 제품 관리
- 페이지네이션 지원

### 3. 재고 관리

- 유통기한 포함 재고 입고/출고
- 동시성 문제 해결 (트랜잭션, 락락 처리)
- FIFO(선입선출) 방식 출고
- 재고 수량 검증

### 4. 재고 히스토리

- 입고/출고 이력 추적
- 사용자별 이력 관리
- 필터링 및 페이지네이션

### 5. API 문서화 (nest-swagger-builder)

- Swagger 문서 자동 생성
- 예외 처리와 연동된 자동 에러 응답 문서화

#### nest-swagger-builder 사용 예시:

```typescript
// 커스텀 빌더 설정 (interceptor 반환값 구조)
export const CustomSwaggerBuilder = () =>
  new ApiDecoratorBuilder({
    statusKey: 'status',
    wrapperKey: 'data',
  });

// API 문서 정의
export const ApiProduct: ApiOperator<keyof ProductController> = {
  CreateProduct: (apiOperationOptions: ApiOperationOptions) =>
    CustomSwaggerBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.CREATED, 'ApiProduct_CreateProduct', Number)
      .withUnauthorizedResponse(
        toSwaggers(
          AuthException.UNAUTHORIZED,
          AuthException.INVALID_TOKEN,
        ),
      )
      .build(),
};

// 컨트롤러에서 사용
@ApiProduct.CreateProduct({ summary: '제품 등록' })
@Post()
@UseGuards(AccessTokenGuard)
async createProduct(@Body() createProductDto: CreateProductDto) {
  // ...
}
```

### 6. 데이터 검증 및 예외 처리

- class-validator를 이용한 요청 데이터 검증
- 커스텀 예외 필터
- 일관된 에러 응답 형식

## 🔒 보안 및 검증

### 동시성 제어

- TypeORM 트랜잭션을 활용한 데이터 일관성 보장
- 재고 수량 검증 및 제약 조건 설정

### 데이터베이스 제약 조건

- 재고 수량 음수 방지 (`quantity >= 0`)
- 유니크 제약 조건 (제품ID + 회사ID + 유통기한)
- 입고/출고 타입별 수량 검증
