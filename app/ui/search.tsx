'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  //useSearchParams 에는 get메서드만 있음
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    // 검색 매개변수 사용하는 인스턴스 생성해야 set,delete사용가능
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // 입력이 빈칸이면 delete로 query 파라메터 삭제
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // url 업데이트: toString()으로 파라메터명과 값을 모두 가져옴
    replace(`${pathname}?${params.toString()}`);
  }, 500);

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
        // value를 사용하지 않고 url의 쿼리스트링 값을 사용하므로
        // 초기값만 value로 사용
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
