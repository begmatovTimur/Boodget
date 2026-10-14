"""Isolated test configuration: never connect tests to the deployed database."""

from .settings import *  # noqa: F403

SECRET_KEY = "boodget-tests-only-key"
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
