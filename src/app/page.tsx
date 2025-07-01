import { redirect } from 'next/navigation';

export default function Home() {
  // トップページは1ページ目にリダイレクト
  redirect('/page/1');
}