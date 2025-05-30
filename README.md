# diner_portal

## セットアップ
1. Codespaceを立ち上げる
2. 立ち上げがだいぶ時間かかるので待つ
3. 立ち上げが終わったら、`docker compose build`
4. 終わったら、`docker compose up -d`
5. 終わったら、localhost:3000にrailsの初期画面、localhost:4000にNextjsの初期画面が表示されることを確認する

## ログ監視

Codespace起動時に、frontendとbackendのログが自動的に別々のターミナルで監視開始されます。

### 自動開始される機能
- **Frontend Log Monitor**: Next.jsのリアルタイムログ監視
- **Backend Log Monitor**: Railsのリアルタイムログ監視

### 手動でログ監視を開始する場合
VS Codeのコマンドパレット（Ctrl+Shift+P）から以下のタスクを実行：
- `Tasks: Run Task` → `Start Frontend Log Monitor`
- `Tasks: Run Task` → `Start Backend Log Monitor`

### ログ監視を停止する場合
ターミナルでCtrl+Cを押すか、該当のターミナルタブを閉じる

木村陸人
阿野庸太郎
辻