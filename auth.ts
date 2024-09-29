import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// 이메일받아 사용자 반환
async function getUser(email: string): Promise<User | undefined> {
  try {
    // 이메일로 사용자 조회
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    // 조회된 사용자중 첫번째 사용자 반환
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// NextAuth설정후 auth, signIn, signOut 내보내기
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Credentials 자격증명공급자 설정
    Credentials({
      // 비동기로 authorize함수 정의
      authorize: async function (credentials) {
        // zod로 이메일, 비밀번호 검증 스키마 정의(이메일은 문자, 비밀번호는 6자이상)
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials); // 자격증명 검증

        // 자격증명 검증 성공
        if (parsedCredentials.success) {
          // 이메일, 비밀번호 추출
          const { email, password } = parsedCredentials.data;
          // 이메일로 사용자 조회
          const user = await getUser(email);

          // 사용자없으면 null
          if (!user) return null;

          // 입력된 비밀번호와 db에서 가져온 user 비밀번호 비교
          // bcrypt: 해시된 db비밀번호와 입력된 패스워드 비교
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
});
