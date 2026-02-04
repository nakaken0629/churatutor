# tmuxを使った部下（サブペイン）管理方法

## 概要
リーダー（ペイン1）として、tmuxの2つ目のペイン（ペイン2）で動作する部下のClaude Codeを管理する方法。

## 部下のClaude Code起動方法
```bash
# ペイン2を作成
tmux splitw -h
# ペイン2でClaude Codeを起動
tmux send-keys -t 2 "claude --dangerously-skip-permissions" ENTER
```

## 部下への指示方法
**重要**: tmuxでは指示とEnterキーを2回に分けて送信する必要があります。

```bash
# 1. まず指示内容を送信
tmux send-keys -t 2 "指示内容をここに記載"

# 2. 次にEnterキーを送信して実行
tmux send-keys -t 2 Enter
```

### 例
```bash
tmux send-keys -t 2 "lsの結果を確認してください"
tmux send-keys -t 2 Enter
```

## 部下からの報告受信方法
部下には以下の方法で報告させる：

```bash
# 部下が実行するコマンド（2段階で送信）
tmux send-keys -t 1 '# 部下からの報告: メッセージ内容'
tmux send-keys -t 1 Enter
```

部下にはこの2段階送信の重要性を明確に指示する必要があります。

## 部下の状態確認方法
```bash
# ペイン2の出力を確認
tmux capture-pane -t 2 -p | tail -20
```

## 注意事項
- Enterキーの送信は必ず別のコマンドとして実行する
- 部下にも同様に2段階送信の必要性を理解させる

---

# 開発ワークフロー

## 作業フロー
部下に開発タスクを依頼する際は、以下のフローに従う：

### 1. GitHubにissueを立てる
```bash
gh issue create --title "タイトル" --body "詳細"
```

### 2. issueに対応するブランチを作成し、worktreeを作成する
**重要**: 部下の作業は必ずgit worktreeを使用する

```bash
# ブランチ名を決定
BRANCH_NAME="feature/issue-番号-簡潔な説明"

# worktreeを作成（新しいブランチと作業ディレクトリを同時に作成）
git worktree add ../churatutor-$BRANCH_NAME -b $BRANCH_NAME

# 部下にはworktreeのディレクトリで作業させる
# 例: ../churatutor-feature/issue-1-add-login
```

### 3. 部下が作業を行う
- 部下に指示を出し、**worktreeディレクトリ内で**実装を進めさせる
- 必要に応じて進捗を確認
- リーダーのメインディレクトリには影響しない

### 4. 実装完了後、pushしてプルリクエストを作成
部下に以下を指示：
- 変更をcommit & push
- プルリクエストを作成（`gh pr create`）
- リーダーに報告

### 5. リーダーがプルリクエストを確認
- 問題があれば → 部下に修正を依頼
- 問題がなければ → マージする

```bash
# PRの確認
gh pr view 番号
gh pr diff 番号

# マージ
gh pr merge 番号 --merge
```

### 6. マージ後のクリーンアップ
```bash
# worktreeを削除
git worktree remove ../churatutor-$BRANCH_NAME

# 不要になったブランチを削除（オプション）
git branch -d $BRANCH_NAME
```
