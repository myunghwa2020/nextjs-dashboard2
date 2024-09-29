import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 인증설정 전달하여 미들웨어 인증설정 적용
export default NextAuth(authConfig).auth;

// 미들웨어 적용 경로 지정(api, _next/static, _next/image, .png제외)
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
