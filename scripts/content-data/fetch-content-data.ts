#!/usr/bin/env node

// 最初に環境変数を読み込む（他のimportより前に実行）
import { config } from 'dotenv';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fetchPosts, fetchCategories, fetchStaticPages } from './microcms';
import { Post, Category, StaticPage, PrebuiltData } from './types';

// .env.localが存在するかチェックして読み込み
const envLocalPath = join(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log('🔧 Loaded .env.local');
}

// .envも読み込み
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  config({ path: envPath });
  console.log('🔧 Loaded .env');
}

// 環境変数が正しく読み込まれたか確認
if (!process.env.MICROCMS_API_KEY || !process.env.MICROCMS_DOMAIN) {
  console.error('❌ Error: MICROCMS_API_KEY and MICROCMS_DOMAIN environment variables are required');
  console.error('   Please check your .env.local or .env file contains:');
  console.error('   MICROCMS_API_KEY=your_api_key');
  console.error('   MICROCMS_DOMAIN=your_domain');
  process.exit(1);
}

/**
 * 関連記事を計算する
 */
function calculateRelatedPosts(posts: Post[], currentPostId: string): Post[] {
  const currentPost = posts.find(post => post.id === currentPostId);
  if (!currentPost || !currentPost.categories?.length) {
    return [];
  }

  const categoryIds = currentPost.categories.map(cat => cat.id);
  const relatedPosts = posts
    .filter(post =>
      post.id !== currentPostId &&
      post.categories?.some(cat => categoryIds.includes(cat.id))
    )
    .slice(0, 6);

  // 関連記事が6件未満の場合、他の記事で埋める
  if (relatedPosts.length < 6) {
    const additionalPosts = posts
      .filter(post => 
        post.id !== currentPostId && 
        !relatedPosts.some(rp => rp.id === post.id)
      )
      .slice(0, 5 - relatedPosts.length);
    
    relatedPosts.push(...additionalPosts);
  }

  return relatedPosts;
}

/**
 * カテゴリごとの記事数を計算する
 */
function calculateCategoriesWithCount(posts: Post[], categories: Category[]): Array<Category & { postCount: number }> {
  const categoryCountMap = new Map<string, number>();
  
  posts.forEach(post => {
    post.categories?.forEach(category => {
      const currentCount = categoryCountMap.get(category.id) || 0;
      categoryCountMap.set(category.id, currentCount + 1);
    });
  });

  return categories
    .map(category => ({
      ...category,
      postCount: categoryCountMap.get(category.id) || 0
    }))
    .sort((a, b) => b.postCount - a.postCount);
}

/**
 * 全記事を取得する
 */
async function fetchAllPosts(): Promise<Post[]> {
  const allPosts: Post[] = [];
  let offset = 0;
  const limit = 20;
  let hasMore = true;

  console.log('📡 Fetching all posts from microCMS...');

  while (hasMore) {
    const { contents } = await fetchPosts({
      offset,
      limit,
      orders: '-publishedAt'
    });

    allPosts.push(...contents);
    hasMore = contents.length === limit;
    offset += limit;
    
    console.log(`   Fetched ${allPosts.length} posts so far...`);
  }

  console.log(`✅ Fetched ${allPosts.length} total posts`);
  return allPosts;
}

/**
 * 全静的ページを取得する
 */
async function fetchAllStaticPages(): Promise<StaticPage[]> {
  console.log('📡 Fetching all static pages from microCMS...');
  
  const { contents } = await fetchStaticPages();
  
  console.log(`✅ Fetched ${contents.length} static pages`);
  return contents;
}

/**
 * メインの実行関数
 */
async function main() {
  try {
    console.log('🚀 Starting prebuild data generation...');
    
    // 並行してデータを取得
    const [posts, categoriesResponse, staticPages] = await Promise.all([
      fetchAllPosts(),
      fetchCategories(),
      fetchAllStaticPages()
    ]);

    console.log('🔄 Processing data...');

    // 記事データを正規化（componets -> components）
    const normalizedPosts = posts.map(post => ({
      ...post,
      components: (post as any).componets || post.components || null,
      componets: undefined
    }));

    // 関連記事を全記事分計算
    const relatedPosts: Record<string, Post[]> = {};
    normalizedPosts.forEach(post => {
      relatedPosts[post.id] = calculateRelatedPosts(normalizedPosts, post.id);
    });

    // カテゴリごとの記事数を計算
    const categoriesWithCount = calculateCategoriesWithCount(normalizedPosts, categoriesResponse.contents);

    // 静的ページのデータを正規化（component -> components）
    const normalizedStaticPages = staticPages.map(page => ({
      ...page,
      components: (page as any).component || page.components || null,
      component: undefined
    }));

    // プリビルドデータを作成
    const prebuiltData: PrebuiltData = {
      posts: normalizedPosts,
      categories: categoriesResponse.contents,
      staticPages: normalizedStaticPages,
      relatedPosts,
      categoriesWithCount,
      generatedAt: new Date().toISOString()
    };

    // データディレクトリを作成
    const dataDir = join(process.cwd(), 'prebuild-data');
    mkdirSync(dataDir, { recursive: true });

    // JSONファイルとして保存
    const dataPath = join(dataDir, 'prebuilt.json');
    writeFileSync(dataPath, JSON.stringify(prebuiltData, null, 2));

    console.log(`✅ Prebuild data generated successfully!`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Categories: ${categoriesResponse.contents.length}`);
    console.log(`   Static pages: ${staticPages.length}`);
    console.log(`   Related posts calculated: ${Object.keys(relatedPosts).length}`);
    console.log(`   Output: ${dataPath}`);
    
  } catch (error) {
    console.error('❌ Error generating prebuild data:', error);
    process.exit(1);
  }
}

// 直接実行された場合のみ実行
if (require.main === module) {
  main();
}

export { main as generatePrebuiltData };