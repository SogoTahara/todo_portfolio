# ToDo + 天気要素アプリ 

インターン経験を基に作成した ToDo アプリです。
Supabase を使ったタスク管理機能、ログイン機能に加えて、OpenWeather API を利用した「天気表示」を実装しています。
また、ログイン履歴の記録・タスク統計の集計が可能です。
React / TypeScript を中心に、状態管理・ルーティング・API連携・認証を一通り経験することを目的に開発しました。

## セットアップ手順
1. リポジトリを clone
 bash
git clone https://github.com/SogoTahara/todo_react.git
cd todo_react

2. インストール
npm install

3. 環境変数の設定
VITE_SUPABASE_URL=あなたのSupabaseのURL
VITE_SUPABASE_ANON_KEY=あなたのSupabaseのAnon Key
VITE_OPENWEATHER_API_KEY=あなたのOpenWeather API Key


4. サーバーを起動
node index.js
↓
npm run dev
http://localhost:5173 にアクセス



## リンク(Vercelでデプロイした動作確認ページ)
https://todo-react-git-main-sougos-projects-21194172.vercel.app?_vercel_share=1SJlTwKEj6fidNNj16YfoSbUF13xPEqN

## 見た目
![スクリーンショット](./images/image.png)
![スクリーンショット](./images/image2.png)

## 機能
- ToDo の追加・編集・削除
- フィルタリング（全て / 完了 / 未完了）
- タスクの検索
- ページ追加,削除
- OpenWeather API で天気を取得
- ログイン履歴の記録
- タスクの統計表示

## 認証機能
- Supabase Auth を利用したログイン / 新規登録
- ログインなしでもアプリ利用可能
- ログイン時はユーザーごとにデータを分離

## 使用技術
- TypeScript
- React(useEffect + useReducer + React Router)
- Vite
- Bootstrap 5
- Axios
- Supabase
- OpenWeather API
- Node.js express
- vitest + React Testing Library
- Cypress

## 工夫した点 / 学び
- TypeScript で型定義を行い、安全な状態管理
- Supabaseを使ったデータ保存 
- Supabase Authを使った認証機能の実装
- API Key を `.env` ファイルで管理
- UI/UX 改善のため検索やフィルタリングを導入
- Cypress,Vitestでの自動テスト

## 今後やりたいこと
- 更なるテストコード
- UI改善やデザイン向上
- 実務経験

## 作者
大学2年 / エンジニア志望  

