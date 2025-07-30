// Mock API with 2s delay and 50% error probability

export interface DataItem {
  id: number;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  views: number;
  status: 'active' | 'inactive';
}

// Mock 데이터
const mockData: DataItem[] = [
  {
    id: 1,
    title: '프론트엔드 개발 가이드',
    description: 'React와 TypeScript를 활용한 현대적인 프론트엔드 개발 방법론을 소개합니다.',
    category: '개발',
    createdAt: '2024-01-15',
    views: 1250,
    status: 'active'
  },
  {
    id: 2,
    title: 'UI/UX 디자인 트렌드',
    description: '2024년 주목받는 사용자 인터페이스 디자인 트렌드와 적용 방법을 다룹니다.',
    category: '디자인',
    createdAt: '2024-01-20',
    views: 985,
    status: 'active'
  },
  {
    id: 3,
    title: '성능 최적화 기법',
    description: '웹 애플리케이션의 로딩 속도와 런타임 성능을 향상시키는 다양한 기법들을 설명합니다.',
    category: '최적화',
    createdAt: '2024-01-25',
    views: 2100,
    status: 'active'
  },
  {
    id: 4,
    title: '접근성 개발 가이드',
    description: '모든 사용자가 접근 가능한 웹사이트 개발을 위한 WCAG 가이드라인과 실제 구현 방법을 제공합니다.',
    category: '접근성',
    createdAt: '2024-02-01',
    views: 756,
    status: 'active'
  },
  {
    id: 5,
    title: '테스팅 전략과 도구',
    description: '단위 테스트부터 E2E 테스트까지, 효과적인 테스팅 전략과 도구 활용법을 알아봅니다.',
    category: '테스팅',
    createdAt: '2024-02-05',
    views: 1420,
    status: 'active'
  },
  {
    id: 6,
    title: 'API 설계 베스트 프랙티스',
    description: 'RESTful API 설계 원칙과 GraphQL 활용법, 그리고 API 문서화 방법을 다룹니다.',
    category: '백엔드',
    createdAt: '2024-02-10',
    views: 1680,
    status: 'active'
  },
  {
    id: 7,
    title: '데이터베이스 최적화',
    description: '쿼리 성능 튜닝과 인덱스 설계, 그리고 대용량 데이터 처리 전략을 설명합니다.',
    category: '데이터베이스',
    createdAt: '2024-02-15',
    views: 892,
    status: 'inactive'
  },
  {
    id: 8,
    title: '보안 개발 가이드',
    description: '웹 애플리케이션 보안 취약점과 대응 방법, 그리고 보안 코딩 가이드라인을 제공합니다.',
    category: '보안',
    createdAt: '2024-02-20',
    views: 1340,
    status: 'active'
  }
];

// 2초 지연을 가진 fetchData 함수 (에러 없음)
export const fetchData = async (): Promise<DataItem[]> => {
  return new Promise((resolve) => {
    // 2초 지연
    setTimeout(() => {
      resolve(mockData);
    }, 2000);
  });
};

// 에러를 시뮬레이션하는 별도 함수 (100% 확률로 에러 발생)
export const fetchDataWithError = async (): Promise<DataItem[]> => {
  return new Promise((resolve, reject) => {
    // 1.5초 지연
    setTimeout(() => {
      // 100% 확률로 에러 발생
      reject(new Error('에러 모드가 활성화되어 요청이 실패했습니다. 에러 모드를 끄고 다시 시도해주세요.'));
    }, 1500);
  });
};

// 특정 카테고리별 데이터 조회 함수 (추가 기능)
export const fetchDataByCategory = async (category?: string): Promise<DataItem[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) { // 카테고리 조회는 30% 에러율
        reject(new Error(`'${category}' 카테고리 데이터를 불러오는데 실패했습니다.`));
      } else {
        const filteredData = category 
          ? mockData.filter(item => item.category === category)
          : mockData;
        resolve(filteredData);
      }
    }, 1500);
  });
};

// 데이터 생성 시뮬레이션 함수
export const createDataItem = async (item: Omit<DataItem, 'id'>): Promise<DataItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) { // 20% 에러율
        reject(new Error('데이터 생성에 실패했습니다.'));
      } else {
        const newItem: DataItem = {
          ...item,
          id: Math.max(...mockData.map(d => d.id)) + 1
        };
        resolve(newItem);
      }
    }, 1000);
  });
};

// ===== Mock API Page용 추가 함수들 =====

export interface MockApiResponse {
  id: number;
  message: string;
  timestamp: string;
  data?: any;
  status: 'success' | 'error';
}

// 성공 응답 데이터
const successResponses: MockApiResponse[] = [
  {
    id: 1,
    message: "데이터 조회가 성공적으로 완료되었습니다.",
    timestamp: new Date().toISOString(),
    data: {
      users: [
        { id: 1, name: "김개발", role: "Frontend Developer" },
        { id: 2, name: "이디자인", role: "UI/UX Designer" },
        { id: 3, name: "박백엔드", role: "Backend Developer" }
      ],
      totalCount: 3,
      page: 1
    },
    status: 'success'
  },
  {
    id: 2,
    message: "파일 업로드가 완료되었습니다.",
    timestamp: new Date().toISOString(),
    data: {
      fileName: "document.pdf",
      fileSize: "2.3MB",
      uploadedAt: new Date().toISOString()
    },
    status: 'success'
  }
];

// 에러 응답 데이터
const errorResponses = [
  {
    code: 400,
    message: "잘못된 요청입니다. 요청 파라미터를 확인해주세요.",
    details: "Invalid request parameters"
  },
  {
    code: 401,
    message: "인증에 실패했습니다. 로그인이 필요합니다.",
    details: "Authentication failed"
  },
  {
    code: 404,
    message: "요청하신 리소스를 찾을 수 없습니다.",
    details: "Resource not found"
  },
  {
    code: 500,
    message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    details: "Internal server error"
  },
  {
    code: 503,
    message: "서비스를 일시적으로 사용할 수 없습니다.",
    details: "Service unavailable"
  }
];

/**
 * Mock fetch function for MockApiPage
 * @param scenario - 'success' or 'error' to determine response type
 * @returns Promise that resolves with success data or rejects with error
 */
export const mockFetch = (scenario: 'success' | 'error'): Promise<MockApiResponse> => {
  return new Promise((resolve, reject) => {
    // 1.5초 네트워크 지연 시뮬레이션
    setTimeout(() => {
      if (scenario === 'success') {
        // 랜덤한 성공 응답 반환
        const randomSuccess = successResponses[Math.floor(Math.random() * successResponses.length)];
        const response: MockApiResponse = {
          ...randomSuccess,
          timestamp: new Date().toISOString(), // 현재 시간으로 업데이트
        };
        resolve(response);
      } else {
        // 랜덤한 에러 응답 반환
        const randomError = errorResponses[Math.floor(Math.random() * errorResponses.length)];
        reject(new Error(`[${randomError.code}] ${randomError.message}`));
      }
    }, 1500);
  });
};