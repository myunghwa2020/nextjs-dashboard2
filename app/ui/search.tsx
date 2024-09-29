'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  // 검색 매개변수훅을 변수에 대입
  const searchParams = useSearchParams();
  // URL 경로 가져오기
  const pathname = usePathname();
  // 라우터 replace함수로 url 업데이트
  const { replace } = useRouter();

  // 이벤트핸들러 사용시 클라이언트 컴포넌트여야함
  function handleSearch(term: string) {
    // 검색 매개변수 사용하는 인스턴스 생성
    const params = new URLSearchParams(searchParams);

    // 입력이 빈칸이면 delete로 query 파라메터 삭제
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    console.log(params.get('query'));
    console.log(params.toString());

    // url 업데이트
    replace(`${pathname}?${params.toString()}`);

    // console.log(term);
  }

  return (
    <div className="relative flex flex-grow ">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        id="search"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
