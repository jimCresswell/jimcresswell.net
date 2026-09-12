# Practice Context

This directory is optional and outside the Practice Core.

The Core remains the required seven-file package in `.agent/practice-core/`.
This directory exists to help Practice exchanges travel with a little extra
context without bloating the Core itself.

## Structure

- `outgoing/` — sender-maintained **ephemeral** support for the next exchange
- `incoming/` — received support material and temporary integration notes

`incoming/` is transient and should normally contain only `.gitkeep` between
integrations. `outgoing/` should stay small and disposable; durable substance
belongs in PDRs, portable patterns, local reference docs, or host-product
decision records.
