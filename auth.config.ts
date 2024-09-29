import type { NextAuthConfig } from 'next-auth';

// 인증설정객체
export const authConfig = {
  pages: {
    // 로그아웃시 사용자가 리디렉션될 경로, /면 홈페이지로 이동
    signIn: '/login',
  },
  callbacks: {
    // 사용자 인증 확인 콜백함수
    authorized: function ({ auth, request: { nextUrl } }) {
      // auth?.user가 undefined, null일 경우 불린값으로 바꾸기위해 !!
      // 로그인 상태
      const isLoggedIn = !!auth?.user;
      // 대시보드 경로에 있는지 확인
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      // 경로가 대시보드일때
      if (isOnDashboard) {
        // 접근허용
        if (isLoggedIn) return true;
        // 로그인상태 아니면 login으로 리디렉션
        return false;
      } else if (isLoggedIn) {
        // 대시보드경로가 이닐 경우 로그인상태면 대시보드로 리디렉션
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      // 기본값으로 접근허용
      return true;
    },
  },
  providers: [], // auth.ts에서 자격증명 공급자 추가하기위해 빈배열
} satisfies NextAuthConfig;
