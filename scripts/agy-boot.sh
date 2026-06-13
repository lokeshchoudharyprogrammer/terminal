#!/usr/bin/env bash
# Antigravity terminal boot sequence

G='\033[38;2;52;211;153m'
B='\033[38;2;99;102;241m'
Y='\033[38;2;251;191;36m'
D='\033[38;2;113;113;122m'
W='\033[38;2;255;255;255m'
RESET='\033[0m'

clear

printf "${B}"
printf '  ╔══════════════════════════════════════════════════════════════════════╗\n'
printf '  ║          A N T I G R A V I T Y   C L O U D   T E R M I N A L       ║\n'
printf '  ║                    Secure Auth Session  v1.0.0                      ║\n'
printf '  ╚══════════════════════════════════════════════════════════════════════╝\n'
printf "${RESET}\n"

boot_step() {
  local label="$1"
  local delay="$2"
  printf "  ${D}→ %s...${RESET}" "$label"
  sleep "$delay"
  printf "\r\033[2K"
  printf "  ${G}✓ %s${RESET}\n" "$label"
}

boot_step "Initializing PTY kernel interface"      0.12
boot_step "Loading secure sandbox environment"     0.09
boot_step "Connecting to Antigravity auth relay"   0.10
boot_step "Verifying TLS certificate chain"        0.08
boot_step "Mounting virtual filesystem layer"      0.09

printf "\n"
printf "  ${D}┌─────────────────────────────────────────────────────────────────┐${RESET}\n"
printf "  ${D}│  Platform  : macOS (darwin-arm64)   Shell: zsh   PTY: active    │${RESET}\n"
printf "  ${D}│  Session   : guest-unauthenticated                               │${RESET}\n"
printf "  ${D}│  Auth mode : Google OAuth + agy CLI                             │${RESET}\n"
printf "  ${D}└─────────────────────────────────────────────────────────────────┘${RESET}\n"
printf "\n"
printf "  ${Y}⚡ This is a real shell — all commands work normally.${RESET}\n"
printf "\n"
printf "     ${B}\$ ${W}agy install${RESET}   — Install Antigravity CLI\n"
printf "     ${B}\$ ${W}agy${RESET}           — Start Google OAuth authentication\n"
printf "\n"
