import { http, HttpResponse, delay } from 'msw';

// Mock 데이터
const mockUsers = [
  { id: 1, name: '김철수', email: 'kim@example.com', role: 'admin' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: 'user' },
  { id: 3, name: '박민수', email: 'park@example.com', role: 'user' },
];

// MSW 핸들러 정의
export const handlers = [
  // GET /api/users - 사용자 목록 조회
  http.get('/api/users', async () => {
    // 네트워크 지연 시뮬레이션
    await delay(1000);
    
    return HttpResponse.json({
      success: true,
      data: mockUsers,
      message: '사용자 목록을 성공적으로 조회했습니다.',
      timestamp: new Date().toISOString(),
    });
  }),

  // GET /api/users/:id - 특정 사용자 조회
  http.get('/api/users/:id', async ({ params }) => {
    await delay(800);
    
    const userId = Number(params.id);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          error: '사용자를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: user,
      message: '사용자 정보를 성공적으로 조회했습니다.',
      timestamp: new Date().toISOString(),
    });
  }),

  // POST /api/users - 새 사용자 생성
  http.post('/api/users', async ({ request }) => {
    await delay(1200);
    
    const body = await request.json() as { name: string; email: string; role: string };
    
    // 간단한 유효성 검사
    if (!body.name || !body.email) {
      return HttpResponse.json(
        {
          success: false,
          error: '이름과 이메일은 필수 항목입니다.',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    
    const newUser = {
      id: mockUsers.length + 1,
      ...body,
    };
    
    mockUsers.push(newUser);
    
    return HttpResponse.json(
      {
        success: true,
        data: newUser,
        message: '사용자가 성공적으로 생성되었습니다.',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // DELETE /api/users/:id - 사용자 삭제
  http.delete('/api/users/:id', async ({ params }) => {
    await delay(1000);
    
    const userId = Number(params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: '삭제할 사용자를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    
    mockUsers.splice(userIndex, 1);
    
    return HttpResponse.json({
      success: true,
      message: '사용자가 성공적으로 삭제되었습니다.',
      timestamp: new Date().toISOString(),
    });
  }),

  // 에러 시뮬레이션을 위한 특별한 엔드포인트
  http.get('/api/error', async () => {
    await delay(500);
    
    return HttpResponse.json(
      {
        success: false,
        error: '서버 내부 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }),
];