#!/bin/bash
#
# リーダーと部下のClaude Codeチームを起動するスクリプト
#
# 使い方:
#   ./scripts/start-team.sh [部下の数]
#
# 例:
#   ./scripts/start-team.sh      # デフォルト: 部下1人
#   ./scripts/start-team.sh 3    # 部下3人

set -e

# 部下の数（デフォルト: 1）
NUM_SUBORDINATES=${1:-1}

# セッション名
SESSION_NAME="churatutor-team"

# プロジェクトディレクトリ
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 既存のセッションがあれば削除するか確認
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "セッション '$SESSION_NAME' が既に存在します。"
    read -p "削除して新しく作成しますか? (y/N): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        tmux kill-session -t "$SESSION_NAME"
    else
        echo "既存のセッションにアタッチします..."
        tmux attach-session -t "$SESSION_NAME"
        exit 0
    fi
fi

echo "チームを起動します (部下: ${NUM_SUBORDINATES}人)..."

# 新しいセッションを作成（リーダーペイン）
tmux new-session -d -s "$SESSION_NAME" -c "$PROJECT_DIR"

# リーダーペインでClaude Codeを起動
tmux send-keys -t "$SESSION_NAME:0.0" "claude --dangerously-skip-permissions" Enter

# 最初の部下用に右側にペインを分割
tmux split-window -h -t "$SESSION_NAME:0.0" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION_NAME:0.1" "claude --dangerously-skip-permissions" Enter

# 2人目以降の部下を追加
for ((i=2; i<=NUM_SUBORDINATES; i++)); do
    # 右側の最後のペインを垂直分割
    last_pane=$((i - 1))
    tmux split-window -v -t "$SESSION_NAME:0.${last_pane}" -c "$PROJECT_DIR"
    tmux send-keys -t "$SESSION_NAME:0.${i}" "claude --dangerously-skip-permissions" Enter
done

# ペインのレイアウトを均等に調整
tmux select-layout -t "$SESSION_NAME:0" main-vertical

# リーダーペインを選択
tmux select-pane -t "$SESSION_NAME:0.0"

echo ""
echo "==================================="
echo "チーム起動完了!"
echo "==================================="
echo ""
echo "ペインレイアウト:"
echo "  ペイン0: リーダー"
for ((i=1; i<=NUM_SUBORDINATES; i++)); do
    echo "  ペイン${i}: 部下${i}"
done
echo ""
echo "セッションにアタッチします..."
echo ""

# セッションにアタッチ
tmux attach-session -t "$SESSION_NAME"
