#!/usr/bin/env node

// 最初に環境変数を読み込む（他のimportより前に実行）
import { config } from 'dotenv';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fetchPosts, fetchCategories } from './microcms';
import { Post, Category, PrebuiltData } from './types';

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
    .slice(0, 5);

  // 関連記事が5件未満の場合、他の記事で埋める
  if (relatedPosts.length < 5) {
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
 * メインの実行関数
 */
async function main() {
  try {
    console.log('🚀 Starting prebuild data generation...');
    
    // 並行してデータを取得
    const [posts, categoriesResponse] = await Promise.all([
      fetchAllPosts(),
      fetchCategories()
    ]);

    console.log('🔄 Processing data...');

    // 関連記事を全記事分計算
    const relatedPosts: Record<string, Post[]> = {};
    posts.forEach(post => {
      relatedPosts[post.id] = calculateRelatedPosts(posts, post.id);
    });

    // カテゴリごとの記事数を計算
    const categoriesWithCount = calculateCategoriesWithCount(posts, categoriesResponse.contents);

    // プリビルドデータを作成
    const prebuiltData: PrebuiltData = {
      posts,
      categories: categoriesResponse.contents,
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