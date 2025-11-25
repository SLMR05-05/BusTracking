# Test Suite - Hệ thống Quản lý Xe Buýt Đưa Đón Học Sinh

## Cấu trúc thư mục

```
tests/
├── api/              # API Integration Tests
├── unit/             # Unit Tests
├── e2e/              # End-to-End Tests
├── fixtures/         # Test data
├── utils/            # Test utilities
└── README.md
```

## Công nghệ sử dụng

- **Backend Testing**: Jest + Supertest
- **Frontend Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **API Testing**: Supertest

## Cài đặt

```bash
cd tests
npm install
```

## Chạy tests

```bash
# Chạy tất cả tests
npm test

# Chạy API tests
npm run test:api

# Chạy unit tests
npm run test:unit

# Chạy E2E tests
npm run test:e2e

# Chạy với coverage
npm run test:coverage
```

## Test Coverage

Mục tiêu coverage:
- API Routes: 80%+
- Controllers: 75%+
- Services: 80%+
- Components: 70%+

## Môi trường test

- Database: MySQL test database
- Server: http://localhost:5000
- Frontend: http://localhost:5173
