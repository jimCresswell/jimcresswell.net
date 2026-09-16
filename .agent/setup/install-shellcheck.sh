#!/usr/bin/env bash
# Install the shellcheck that the root `lint:shell` gate runs, pinned by
# version and by the sha256 of each host's release asset. CI
# (.github/workflows/ci.yml), the cloud session hook (cloud-session-setup.sh
# beside this file) and developers all install it here. shellcheck versions
# differ in what they report, so the pin lives here once: the gate reads
# SHELLCHECK_VERSION from this file and fails when another version is first on
# PATH. Moving the pin means changing the version and every digest together,
# each digest recomputed from a download and cross-checked against the
# `digest` GitHub's release API records for that asset.
#
# Usage: install-shellcheck.sh <bin-dir>
#   <bin-dir> receives the binary; the caller puts it on PATH ahead of any
#   other shellcheck.
set -euo pipefail

SHELLCHECK_VERSION=0.11.0

if [[ $# -ne 1 ]]; then
  echo "usage: install-shellcheck.sh <bin-dir>" >&2
  exit 2
fi
bin_dir="$1"

host="$(uname -s) $(uname -m)"
case "$host" in
  "Linux x86_64")
    asset=linux.x86_64
    sha256=b7af85e41cc99489dcc21d66c6d5f3685138f06d34651e6d34b42ec6d54fe6f6
    ;;
  "Linux aarch64")
    asset=linux.aarch64
    sha256=68a8133197a50beb8803f8d42f9908d1af1c5540d4bb05fdfca8c1fa47decefc
    ;;
  "Darwin x86_64")
    asset=darwin.x86_64
    sha256=c2c15e08df0e8fbc374c335b230a7ee958c313fa5714817a59aa59f1aa594f51
    ;;
  "Darwin arm64")
    asset=darwin.aarch64
    sha256=339b930feb1ea764467013cc1f72d09cd6b869ebf1013296ba9055ab2ffbd26f
    ;;
  *)
    echo "install-shellcheck: no pinned shellcheck asset for ${host}" >&2
    exit 1
    ;;
esac

archive="$(mktemp)"
trap 'rm -f "$archive"' EXIT

# https only, on the request and on every redirect hop; the asset redirects
# to release-assets.githubusercontent.com, the host gitleaks' asset uses.
curl --fail --location --silent --show-error --max-time 60 \
  --retry 3 --retry-connrefused --proto '=https' --proto-redir '=https' \
  "https://github.com/koalaman/shellcheck/releases/download/v${SHELLCHECK_VERSION}/shellcheck-v${SHELLCHECK_VERSION}.${asset}.tar.gz" \
  --output "$archive"

# The digest is checked before anything is extracted.
if command -v sha256sum > /dev/null 2>&1; then
  echo "${sha256}  ${archive}" | sha256sum --check -
else
  echo "${sha256}  ${archive}" | shasum --algorithm 256 --check -
fi

# The binary is owned by whoever runs the install, root included.
mkdir -p "$bin_dir"
tar --extract --gzip --no-same-owner --file "$archive" --directory "$bin_dir" \
  --strip-components=1 "shellcheck-v${SHELLCHECK_VERSION}/shellcheck"
"${bin_dir}/shellcheck" --version
