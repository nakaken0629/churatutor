# tmuxを使った部下（サブペイン）管理方法

## 概要
リーダー（ペイン0）として、右側のペインで動作する部下のClaude Codeを管理する方法。

## ペインレイアウト
```
+------------------+------------------+
|                  |     部下1        |
|                  |    (ペイン1)      |
|     リーダー      +------------------+
|    (ペイン0)      |     部下2        |
|                  |    (ペイン2)      |
|                  +------------------+
|                  |     部下3        |
|                  |    (ペイン3)      |
+------------------+------------------+
  左半分              右半分（上から順）
```

## 部下のClaude Code起動方法

### 1人目の部下を追加
```bash
# 右側にペインを作成（左右分割）
tmux splitw -h

# ペイン1でClaude Codeを起動
tmux send-keys -t 1 "claude --dangerously-skip-permissions" ENTER
```

### 2人目以降の部下を追加
```bash
# 右側の最後のペインを垂直分割（上下分割）
# ペイン番号は適宜調整（2人目はペイン2、3人目はペイン3...）
tmux splitw -v -t 1

# 新しいペインでClaude Codeを起動
tmux send-keys -t 2 "claude --dangerously-skip-permissions" ENTER
```

### ペイン番号の確認
```bash
# 現在のペイン一覧と番号を確認
tmux list-panes
```

## 部下への指示方法
**重要**: tmuxでは指示とEnterキーを2回に分けて送信する必要があります。

```bash
# 1. まず指示内容を送信（ペイン番号は部下に応じて変更: 1, 2, 3...）
tmux send-keys -t 1 "指示内容をここに記載"

# 2. 次にEnterキーを送信して実行
tmux send-keys -t 1 Enter
```

### 例
```bash
# 部下1（ペイン1）への指示
tmux send-keys -t 1 "lsの結果を確認してください"
tmux send-keys -t 1 Enter

# 部下2（ペイン2）への指示
tmux send-keys -t 2 "テストを実行してください"
tmux send-keys -t 2 Enter
```

## 部下からの報告受信方法
部下には以下の方法で報告させる（リーダーはペイン0）：

```bash
# 部下が実行するコマンド（2段階で送信）
tmux send-keys -t 0 '# 部下からの報告: メッセージ内容'
tmux send-keys -t 0 Enter
```

部下にはこの2段階送信の重要性を明確に指示する必要があります。

## 部下の状態確認方法
```bash
# 部下1（ペイン1）の出力を確認
tmux capture-pane -t 1 -p | tail -20

# 部下2（ペイン2）の出力を確認
tmux capture-pane -t 2 -p | tail -20

# 全ペインの一覧を確認
tmux list-panes
```

## 注意事項
- Enterキーの送信は必ず別のコマンドとして実行する
- 部下にも同様に2段階送信の必要性を理解させる
- **すでに起動している部下がいる場合は、新規作成せずにそちらを優先して作業を割り振る**
- **すでに起動している部下に作業をさせた場合、作業完了後もペインを閉じずに待機させる（次のタスクに備える）**

---

# 開発ワークフロー

## 作業フロー
部下に開発タスクを依頼する際は、以下のフローに従う：

### 1. リーダーがissueを指定して部下に作業を依頼
```bash
# issueの一覧を確認
gh issue list

# 部下にissue番号を指定して作業を依頼
```

### 2. 部下がissueを元にブランチを作成
```bash
# ブランチ名の命名規則
BRANCH_NAME="feature/issue-番号-簡潔な説明"

# ブランチを作成
git branch $BRANCH_NAME
```

### 3. 部下がworktreeを作成
**重要**: 部下の作業は必ずgit worktreeを使用する

```bash
# worktreeを作成（ブランチと作業ディレクトリを紐付け）
git worktree add ../churatutor-$BRANCH_NAME $BRANCH_NAME

# worktreeディレクトリに移動して作業
cd ../churatutor-$BRANCH_NAME
```

### 4. 部下がworktree上で作業を行う
- worktreeディレクトリ内で実装を進める
- リーダーのメインディレクトリには影響しない

### 5. 部下がコミット & プッシュ
```bash
git add .
git commit -m "コミットメッセージ"
git push -u origin $BRANCH_NAME
```

### 6. 部下がPRを作成してリーダーに報告
```bash
# プルリクエストを作成
gh pr create --title "タイトル" --body "詳細"

# リーダーに報告
tmux send-keys -t 0 '# 部下からの報告: PR作成完了 URL'
tmux send-keys -t 0 Enter
```

### 7. リーダーがプルリクエストを確認
- 問題があれば → 部下に修正を依頼
- 問題がなければ → マージする

```bash
# PRの確認
gh pr view 番号
gh pr diff 番号

# マージ
gh pr merge 番号 --merge
```

### 8. 部下がマージ後のクリーンアップを行う
部下に以下を指示：
- worktreeを削除
- 不要になったブランチを削除（オプション）
- リーダーに完了報告

```bash
# メインディレクトリに戻る
cd /Users/kenjinakagaki/git/churatutor

# worktreeを削除
git worktree remove ../churatutor-$BRANCH_NAME

# 不要になったブランチを削除（オプション）
git branch -d $BRANCH_NAME
```
