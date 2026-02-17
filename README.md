## ToDo + 天気要素アプリ 

インターン経験を基に作成した ToDo アプリです。
Supabase を使ったタスク管理機能、ログイン機能に加えて、OpenWeather API を利用した「天気表示」を実装しています。
ログイン履歴の記録・タスク統計の集計が可能です。
Cypressを用い、タスク操作やログインの流れなどを自動テスト。
React / TypeScript を中心に、状態管理・ルーティング・API連携・認証を一通り経験することを目的に開発しました。

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


## 自動テスト (Cypress) の設計方針
品質管理の観点から、以下のテスト設計に基づいてE2Eテストを実装しました。

・境界値分析: タスク追加時の文字数制限（0文字、1文字、30文字、31文字以上）のバリデーション確認。

・状態遷移テスト: タスクの「未完了 → 完了 → 削除」といった流れが正常に遷移するかを確認。

・異常系テスト: 未ログイン状態での操作ブロックや、不正な入力に対するアラート表示の検証。

・環境依存箇所の検証: 外部API（OpenWeather）との連携など、環境変化で破損しやすい箇所の表示確認。

## 不具合の自己分析と修正経験
テスト過程で発生した以下の問題を、コード解析とデバッグにより解消しました。

・UIの干渉: サイドバーが入力要素を覆いクリックを阻害する問題を、Cypressの待機処理と要素指定の最適化で解決


## 工夫した点 / 学び
- Supabase,Expressを使ってフルスタックな構成に
- API Key を `.env` ファイルで管理
- UI/UX 改善のため検索やフィルタリング、未ログイン時に操作しようとした際のア　ラート誘導など
- 文字数制限は境界付近で不具合が発生しやすいため、境界値を重点的に検証
- ログインは認証状態の不具合がリスクにつながるため、優先的にテスト
- 外部API連携は、APIキーの設定漏れや、環境移行などによる環境依存の不具合が多 かったため、テストするべき箇所だと判断

## 今後やりたいこと
- 更なるテスト理解
- UI改善やデザイン向上
- 実務経験
- 資格の勉強

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

## セットアップ手順
1. リポジトリを clone
 bash
git clone https://github.com/SogoTahara/todo_portfolio.git
cd todo_portfolio

2. インストール
npm install

3. 環境変数の設定
VITE_SUPABASE_URL=あなたのSupabaseのURL
VITE_SUPABASE_ANON_KEY=あなたのSupabaseのAnon Key
VITE_OPENWEATHER_API_KEY=あなたのOpenWeather API Key

4. 起動
・サーバー起動
　node index.js

・フロントエンド起動
　npm run dev
　http://localhost:5173 にアクセス

## リンク(Vercelでデプロイした動作確認ページ)
https://todo-react-git-main-sougos-projects-21194172.vercel.app?_vercel_share=1SJlTwKEj6fidNNj16YfoSbUF13xPEqN

## 作者
大学2年 / エンジニア志望  

