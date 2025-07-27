import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

// 依存関係をモック
vi.mock('fs');
vi.mock('path');
vi.mock('dotenv');

const mockFs = vi.mocked(fs);
const mockPath = vi.mocked(path);
const mockDotenv = vi.mocked(dotenv);
const execAsync = promisify(exec);

describe('setup-static-files', () => {
  const originalEnv = process.env;
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    
    // 環境変数をリセット
    process.env = { ...originalEnv };
    
    // コンソール出力をモック
    console.log = vi.fn();
    console.warn = vi.fn();
    
    // デフォルトのモック設定
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockDotenv.config.mockReturnValue({ parsed: {} });
    mockFs.writeFileSync.mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
  });

  describe('robots.txt生成', () => {
    it('開発環境でrobots.txtが生成される', async () => {
      process.env.BUILD_MODE = 'development';
      
      // 動的インポートでモジュールを再読み込み
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('robots.txt'),
        expect.stringContaining('User-agent: *\nDisallow: /\n')
      );
      expect(console.log).toHaveBeenCalledWith('✅ robots.txt generated for development build');
    });

    it('本番環境ではrobots.txtが生成されない', async () => {
      process.env.BUILD_MODE = 'production';
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).not.toHaveBeenCalledWith(
        expect.stringContaining('robots.txt'),
        expect.any(String)
      );
    });

    it('BUILD_MODE未設定ではrobots.txtが生成されない', async () => {
      delete process.env.BUILD_MODE;
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).not.toHaveBeenCalledWith(
        expect.stringContaining('robots.txt'),
        expect.any(String)
      );
    });
  });

  describe('ads.txt生成', () => {
    it('AdSense IDが設定されている場合にads.txtが生成される', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_ID = 'ca-pub-1234567890123456';
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n'
      );
      expect(console.log).toHaveBeenCalledWith('✅ ads.txt generated with AdSense ID');
    });

    it('ca-pub-プレフィックスが自動で除去される', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_ID = 'ca-pub-9876543210987654';
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0\n'
      );
    });

    it('プレフィックスがない場合はそのまま使用される', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_ID = '1234567890123456';
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n'
      );
    });

    it('AdSense IDが未設定の場合はads.txtが生成されない', async () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_ID;
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).not.toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        expect.any(String)
      );
      expect(console.log).toHaveBeenCalledWith('ℹ️  NEXT_PUBLIC_ADSENSE_ID not found, skipping ads.txt generation');
    });

    it('AdSense IDが空文字の場合はads.txtが生成されない', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_ID = '';
      
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockFs.writeFileSync).not.toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        expect.any(String)
      );
      expect(console.log).toHaveBeenCalledWith('ℹ️  NEXT_PUBLIC_ADSENSE_ID not found, skipping ads.txt generation');
    });
  });

  describe('複合パターン', () => {
    it('開発環境 + AdSense ID設定で両方のファイルが生成される', async () => {
      process.env.BUILD_MODE = 'development';
      process.env.NEXT_PUBLIC_ADSENSE_ID = 'ca-pub-1234567890123456';
      
      await import('../setup-static-files?t=' + Date.now());
      
      // robots.txt生成
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('robots.txt'),
        expect.stringContaining('User-agent: *\nDisallow: /\n')
      );
      
      // ads.txt生成
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n'
      );
      
      expect(console.log).toHaveBeenCalledWith('✅ robots.txt generated for development build');
      expect(console.log).toHaveBeenCalledWith('✅ ads.txt generated with AdSense ID');
    });

    it('本番環境 + AdSense ID設定でads.txtのみ生成される', async () => {
      process.env.BUILD_MODE = 'production';
      process.env.NEXT_PUBLIC_ADSENSE_ID = 'ca-pub-1234567890123456';
      
      await import('../setup-static-files?t=' + Date.now());
      
      // robots.txt生成されない
      expect(mockFs.writeFileSync).not.toHaveBeenCalledWith(
        expect.stringContaining('robots.txt'),
        expect.any(String)
      );
      
      // ads.txt生成される
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('ads.txt'),
        'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n'
      );
      
      expect(console.log).toHaveBeenCalledWith('✅ ads.txt generated with AdSense ID');
    });
  });

  describe('.env.local読み込み', () => {
    it('dotenv.configが正しいパスで呼び出される', async () => {
      await import('../setup-static-files?t=' + Date.now());
      
      expect(mockDotenv.config).toHaveBeenCalledWith({
        path: expect.stringContaining('.env.local')
      });
    });
  });

  describe('ファイルパス生成', () => {
    it('outディレクトリの正しいパスが生成される', async () => {
      await import('../setup-static-files?t=' + Date.now());
      
      // path.joinが適切な引数で呼び出されている
      expect(mockPath.join).toHaveBeenCalledWith(
        expect.any(String), // __dirname相当
        '..',
        '..',
        'out'
      );
    });
  });
});