"""Seed entry point: `python -m app.scripts.seed [--force]` (D13, D51; spec 07, spec 11).

Railway's pre-deploy step runs it right after `alembic upgrade head`. It does nothing unless
`SEED_ON_DEPLOY=true` or `--force` is given (`make seed`, the start scripts). The demo data itself
(spec 11) is created through the module services once they exist (D51); until then a forced run
only logs that no seed data is defined. Any failure exits non-zero, which stops the deploy
(SEED-09).
"""

import argparse
import logging
import sys
from collections.abc import Sequence

from app.core.config import get_settings
from app.core.logging import configure_logging

logger = logging.getLogger("app.seed")


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="python -m app.scripts.seed",
        description="Load the idempotent BayFlow demo data (spec 11).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="seed even when SEED_ON_DEPLOY is not true",
    )
    return parser.parse_args(argv)


def run(*, force: bool) -> int:
    """Run the seed if enabled; returns the process exit code."""
    if not (force or get_settings().seed_on_deploy):
        logger.info("seed skipped (SEED_ON_DEPLOY is not true)")
        return 0
    logger.info("no seed data defined yet")
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        configure_logging(get_settings().log_level)
        return run(force=args.force)
    except Exception:
        logger.exception("seed failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
