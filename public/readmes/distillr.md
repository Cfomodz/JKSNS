# distillr

**Daily digests and narrated reels for papers, code, and CTFs** · July 2026

A self-hosted daily digest and video studio for research papers, competitive programming, and CTF solving. It pulls the day's notable research and tools from arXiv, Hugging Face, Hacker News, GitHub, or any RSS feed, and turns them into grounded markdown, shareable cards, and narrated vertical reels.

## Highlights

- Grounded by design: the factual skeleton is assembled with no model, so every bullet keeps the exact source sentence it came from
- Three video series from one engine: Paper of the Day, Dev Solve of the Day, and CTF Solve of the Day
- The digest runs on the Python standard library alone, with no account or API key
- Pluggable prose backends: none, a local Ollama model, the Claude Code CLI, or any OpenAI-compatible endpoint

## Stack

Python · ffmpeg · Ollama · Claude Code

## Links

- Repo: [github.com/JKSNS/distillr](https://github.com/JKSNS/distillr)
