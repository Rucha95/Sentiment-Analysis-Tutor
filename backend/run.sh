#!/usr/bin/env bash
python -m venv .venv
source .venv/bin/activate || source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
