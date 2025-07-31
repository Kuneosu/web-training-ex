# Promise와 setTimeout으로 비동기 API 시뮬레이션 만들기

## 목차
1. [비동기 API 시뮬레이션이란?](#1-비동기-api-시뮬레이션이란)
2. [Promise와 setTimeout 기초](#2-promise와-settimeout-기초)
3. [기본 구현 방법](#3-기본-구현-방법)
4. [실전 구현 패턴](#4-실전-구현-패턴)
5. [프로젝트 실제 구현 분석](#5-프로젝트-실제-구현-분석)
6. [고급 활용법](#6-고급-활용법)
7. [자주 묻는 질문들](#7-자주-묻는-질문들)

---

## 1. 비동기 API 시뮬레이션이란?

### 🤔 한 문장으로 설명하면?

**"Promise와 setTimeout을 조합해서 실제 네트워크 통신처럼 시간이 걸리는 가짜 API를 만드는 것"**

### 🎯 왜 필요한가요?

```javascript
// ❌ 동기적인 가짜 데이터 (현실적이지 않음)
function getMockData() {
  return { users: [...] };  // 즉시 반환
}

// ✅ 비동기 시뮬레이션 (실제 API처럼 동작)
function getMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ users: [...] });  // 1초 후 반환
    }, 1000);
  });
}
```

### 📊 실제 API vs 시뮬레이션 비교

| 특징 | 실제 API | Promise 시뮬레이션 |
|------|----------|-------------------|
| **네트워크 지연** | 10-2000ms | setTimeout으로 조절 가능 |
| **성공/실패** | 서버 상태에 따라 | 조건부로 제어 가능 |
| **비동기 처리** | async/await 사용 | async/await 사용 (동일!) |
| **로딩 상태** | 필요 | 필요 (동일!) |
| **에러 처리** | try-catch | try-catch (동일!) |

---

## 2. Promise와 setTimeout 기초

### 🏗️ Promise 기본 구조

```javascript
// Promise의 3가지 상태
const promise = new Promise((resolve, reject) => {
  // 1. Pending (대기): 초기 상태
  
  // 2. Fulfilled (이행): 성공
  resolve('성공 데이터');
  
  // 3. Rejected (거부): 실패
  reject('에러 메시지');
});
```

### ⏰ setTimeout 기본 사용법

```javascript
// 기본 구조
setTimeout(() => {
  console.log('1초 후 실행');
}, 1000);

// 취소하기
const timerId = setTimeout(() => {
  console.log('이것은 실행되지 않음');
}, 1000);

clearTimeout(timerId);  // 타이머 취소
```

### 🔄 Promise + setTimeout 조합

```javascript
// 지연된 Promise 생성 패턴
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// 사용 예시
async function example() {
  console.log('시작');
  await delay(1000);  // 1초 대기
  console.log('1초 후');
}
```

---

## 3. 기본 구현 방법

### 🔧 간단한 Mock API 함수

```javascript
// 1. 성공만 반환하는 Mock API
function fetchMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        data: [
          { id: 1, name: '아이템 1' },
          { id: 2, name: '아이템 2' }
        ]
      });
    }, 1500);  // 1.5초 지연
  });
}

// 2. 성공/실패를 조건부로 처리
function fetchMockData(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('서버 오류가 발생했습니다'));
      } else {
        resolve({
          status: 'success',
          data: [/* ... */]
        });
      }
    }, 1000);
  });
}
```

### 🎯 실제 사용 예시

```javascript
// async/await 사용
async function loadData() {
  try {
    console.log('데이터 로딩 시작...');
    const result = await fetchMockData();
    console.log('데이터 로딩 완료:', result);
  } catch (error) {
    console.error('에러 발생:', error.message);
  }
}

// Promise then/catch 사용
function loadDataWithPromise() {
  console.log('데이터 로딩 시작...');
  
  fetchMockData()
    .then(result => {
      console.log('데이터 로딩 완료:', result);
    })
    .catch(error => {
      console.error('에러 발생:', error.message);
    });
}
```

### 📦 React에서 사용하기

```jsx
function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMockData();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>로딩 중...</p>}
      {error && <p>에러: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={fetchData}>데이터 불러오기</button>
    </div>
  );
}
```

---

## 4. 실전 구현 패턴

### 🏢 실무에서 자주 쓰는 패턴들

#### 1. 랜덤 지연 시간
```javascript
function fetchWithRandomDelay() {
  // 500ms ~ 2000ms 사이의 랜덤 지연
  const delay = Math.random() * 1500 + 500;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: '성공', delay: Math.round(delay) });
    }, delay);
  });
}
```

#### 2. 확률적 실패 시뮬레이션
```javascript
function fetchWithRandomError(errorRate = 0.3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 30% 확률로 에러 발생
      if (Math.random() < errorRate) {
        reject(new Error('네트워크 오류'));
      } else {
        resolve({ data: '성공' });
      }
    }, 1000);
  });
}
```

#### 3. 재시도 로직 구현
```javascript
async function fetchWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fetchWithRandomError(0.5);
      return result;  // 성공하면 반환
    } catch (error) {
      console.log(`시도 ${i + 1} 실패`);
      
      if (i === maxRetries - 1) {
        throw error;  // 마지막 시도도 실패하면 에러 던지기
      }
      
      // 재시도 전 대기 (지수 백오프)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

#### 4. 취소 가능한 요청
```javascript
function fetchWithCancel() {
  let timeoutId;
  let rejectFn;
  
  const promise = new Promise((resolve, reject) => {
    rejectFn = reject;
    
    timeoutId = setTimeout(() => {
      resolve({ data: '성공' });
    }, 2000);
  });
  
  // 취소 함수 추가
  promise.cancel = () => {
    clearTimeout(timeoutId);
    rejectFn(new Error('요청이 취소되었습니다'));
  };
  
  return promise;
}

// 사용 예시
const request = fetchWithCancel();

// 1초 후 취소
setTimeout(() => {
  request.cancel();
}, 1000);
```

---

## 5. 프로젝트 실제 구현 분석

### 📍 mockAPI.ts 분석

```typescript
// 타입 정의
export interface MockApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

// Mock API 함수
export const mockFetch = (
  scenario: 'success' | 'error' = 'success'
): Promise<MockApiResponse> => {
  return new Promise((resolve, reject) => {
    // 1.5초 네트워크 지연 시뮬레이션
    setTimeout(() => {
      if (scenario === 'success') {
        resolve({
          status: 'success',
          message: '데이터를 성공적으로 불러왔습니다',
          data: {
            users: [
              { id: 1, name: '홍길동', role: '관리자' },
              { id: 2, name: '김철수', role: '사용자' }
            ],
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        });
      } else {
        reject(new Error('서버 오류가 발생했습니다 (500)'));
      }
    }, 1500);
  });
};
```

### 🎨 MockApiPage에서의 활용

```typescript
const handleRequest = async (scenario: 'success' | 'error') => {
  // 1. 상태 초기화
  setLoading(true);
  setData(null);
  setError(null);

  try {
    // 2. Mock API 호출 (1.5초 대기)
    const response = await mockFetch(scenario);
    
    // 3. 성공 시 데이터 저장
    setData(response);
  } catch (err) {
    // 4. 실패 시 에러 저장
    setError(err instanceof Error ? err.message : '알 수 없는 오류');
  } finally {
    // 5. 로딩 완료
    setLoading(false);
  }
};
```

### 💡 구현의 핵심 포인트

1. **TypeScript 타입 안전성**: 응답 타입을 명확히 정의
2. **시나리오 기반 테스트**: success/error 두 가지 케이스
3. **실제같은 지연**: 1.5초로 현실적인 네트워크 지연
4. **에러 처리**: Promise reject로 실제 에러처럼 처리

---

## 6. 고급 활용법

### 🚀 더 현실적인 Mock API 만들기

#### 1. HTTP 상태 코드 시뮬레이션
```javascript
class MockAPI {
  static async get(url, options = {}) {
    const delay = options.delay || 1000;
    const status = options.status || 200;
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 상태 코드별 처리
        if (status >= 200 && status < 300) {
          resolve({
            ok: true,
            status,
            json: async () => this.generateData(url)
          });
        } else if (status >= 400) {
          reject({
            ok: false,
            status,
            statusText: this.getStatusText(status)
          });
        }
      }, delay);
    });
  }
  
  static getStatusText(status) {
    const statusTexts = {
      400: 'Bad Request',
      401: 'Unauthorized',
      404: 'Not Found',
      500: 'Internal Server Error'
    };
    return statusTexts[status] || 'Unknown Error';
  }
  
  static generateData(url) {
    // URL에 따른 다른 데이터 반환
    if (url.includes('/users')) {
      return { users: [/* ... */] };
    } else if (url.includes('/posts')) {
      return { posts: [/* ... */] };
    }
    return { data: 'default' };
  }
}
```

#### 2. 로컬 스토리지 연동
```javascript
class PersistentMockAPI {
  static async saveData(key, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(data));
        resolve({ success: true, message: '저장 완료' });
      }, 500);
    });
  }
  
  static async loadData(key) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        if (data) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error('데이터를 찾을 수 없습니다'));
        }
      }, 300);
    });
  }
}
```

#### 3. 프로그레스 콜백 지원
```javascript
function fetchWithProgress(onProgress) {
  return new Promise((resolve) => {
    const totalSteps = 5;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      onProgress((currentStep / totalSteps) * 100);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        resolve({ data: '완료' });
      }
    }, 500);
  });
}

// 사용 예시
fetchWithProgress((progress) => {
  console.log(`진행률: ${progress}%`);
}).then(result => {
  console.log('완료:', result);
});
```

---

## 7. 자주 묻는 질문들

### ❓ Q1: Promise와 async/await 중 뭘 써야 하나요?
**A:** 둘 다 같은 기능이지만, async/await가 더 읽기 쉽습니다:
```javascript
// Promise
fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await (권장)
try {
  const data = await fetchData();
  console.log(data);
} catch (err) {
  console.error(err);
}
```

### ❓ Q2: 여러 요청을 동시에 처리하려면?
**A:** Promise.all을 사용하세요:
```javascript
async function fetchMultiple() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return { users, posts, comments };
}
```

### ❓ Q3: 실제 API로 전환할 때 코드 수정이 필요한가요?
**A:** 인터페이스를 동일하게 만들면 수정이 최소화됩니다:
```javascript
// Mock API
const fetchUsers = () => mockFetch('/users');

// 실제 API (거의 동일!)
const fetchUsers = () => fetch('/api/users').then(res => res.json());
```

### ❓ Q4: 메모리 누수 위험은 없나요?
**A:** 컴포넌트 언마운트 시 정리하면 안전합니다:
```javascript
useEffect(() => {
  let cancelled = false;
  
  fetchData().then(data => {
    if (!cancelled) {
      setData(data);
    }
  });
  
  return () => {
    cancelled = true;  // 정리
  };
}, []);
```

### ❓ Q5: 에러 종류를 구분하려면?
**A:** 커스텀 에러 클래스를 만드세요:
```javascript
class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// 사용
reject(new NetworkError('Not Found', 404));
```

---

## 🎯 핵심 요약

### Promise + setTimeout의 3가지 핵심 패턴

1. **기본 지연 패턴**
```javascript
new Promise(resolve => setTimeout(resolve, 1000));
```

2. **조건부 성공/실패**
```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    condition ? resolve(data) : reject(error);
  }, delay);
});
```

3. **React 상태 관리 통합**
```javascript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

### 실무 활용 포인트
- **네트워크 지연 시뮬레이션**: 실제 UX 테스트
- **에러 시나리오 테스트**: 예외 처리 검증
- **로딩 상태 구현**: 사용자 피드백 제공
- **개발 생산성**: 백엔드 의존성 제거

**Promise와 setTimeout을 활용하면 실제 API와 동일한 비동기 동작을 쉽게 구현할 수 있습니다!** 🚀