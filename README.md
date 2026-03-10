# 会話の伏線メモ (MVP)

人との会話で出てきた断片情報を、1〜2タップ感覚で残して次回の会話に活かすための Expo + React Native アプリです。

## 特徴

- クイックメモ追加を主役にした導線
- 人物ごとのメモ管理
- タグで話題を軽く整理
- リマインドのアプリ内表示
- `expo-notifications` を使ったローカル通知（権限許可時）
- AsyncStorageによるローカル永続化
- 初回起動時のダミーデータ投入

## 技術スタック

- Expo
- React Native
- TypeScript
- expo-router
- AsyncStorage
- expo-notifications
- date-fns

## 起動方法

```bash
npm install
npm run start
```

iOS/Androidで起動する場合:

```bash
npm run ios
npm run android
```

型チェック:

```bash
npm run typecheck
```

Node 24系では Expo CLI の依存チェックでエラーが出る場合があります。  
その場合は以下で起動できます。

```bash
EXPO_NO_DOCTOR=1 npm run start
```

## 画面構成

- ホーム: 最近メモした人 / 近いリマインド / クイック追加 / 話題候補
- 人物一覧: 検索 / カード一覧 / 新規追加
- 人物詳細: メモ一覧 / タグ / 次回話題候補 / リマインド導線
- クイックメモモーダル: 人物選択または新規作成 / メモ / タグ / リマインド日
- リマインド一覧: 近い順表示 / 完了切り替え

## アーキテクチャ

- `src/storage/repository.ts`
  - AsyncStorageアクセスと初回シード処理を集約
- `src/features/*/hooks.ts`
  - 画面から使うCRUDロジックと状態管理
- `src/components/*`
  - UI再利用コンポーネント
- `src/theme/*`
  - 色・余白・タイポグラフィ定義
- `app/*`
  - expo-router 画面ルーティング

## データ型

- `Person`: 名前と更新時刻を中心に管理
- `Memo`: 本文・タグ・任意リマインド日を保持
- `Reminder`: 人物/メモに紐づく通知候補を保持

## 今後の拡張しやすさ

- 通知ロジックは `src/lib/notifications.ts` に分離
- ストレージ操作は repository経由に統一
- 後からクラウド同期を入れる場合は repository層差し替えで対応しやすい構成

## ディレクトリ

```text
.
├─ app
│  ├─ _layout.tsx
│  ├─ index.tsx
│  ├─ people
│  │  ├─ index.tsx
│  │  ├─ [id].tsx
│  │  └─ new.tsx
│  ├─ modals
│  │  └─ quick-memo.tsx
│  └─ reminders
│     └─ index.tsx
├─ src
│  ├─ components
│  │  ├─ common
│  │  ├─ people
│  │  ├─ memo
│  │  └─ reminder
│  ├─ features
│  │  ├─ people
│  │  ├─ memos
│  │  └─ reminders
│  ├─ storage
│  ├─ theme
│  ├─ types
│  ├─ constants
│  ├─ utils
│  └─ lib
├─ assets
├─ app.json
├─ babel.config.js
├─ expo-env.d.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```
