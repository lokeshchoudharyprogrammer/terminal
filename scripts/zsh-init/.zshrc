# Antigravity custom zshrc — loaded via ZDOTDIR

# Add our scripts to PATH first
export PATH="$AGY_SCRIPTS_DIR:$PATH"

# Load user's real zsh config (best-effort, silently)
if [ -f "$HOME/.zshrc" ] && [ "$HOME" != "$AGY_SCRIPTS_DIR/zsh-init" ]; then
  # Only source select parts to avoid full config pollution
  source "$HOME/.zshenv" 2>/dev/null || true
fi

# Run boot sequence
if [ -x "$AGY_SCRIPTS_DIR/agy-boot.sh" ]; then
  "$AGY_SCRIPTS_DIR/agy-boot.sh"
fi

# Set the custom prompt
autoload -U colors && colors
PROMPT='%F{#34d399}guest%f%F{#71717a}@%f%F{#6366f1}antigravity%f%F{#71717a}:%f%F{#fbbf24}~%f%F{#71717a}$%f '

# Enable completions if available
autoload -Uz compinit && compinit -u 2>/dev/null || true

# History
HISTSIZE=100
SAVEHIST=0

# Make sure agy is always findable
alias agy="$AGY_SCRIPTS_DIR/agy"
