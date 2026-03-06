"""
RQ worker for processing scan jobs in the background.
Run with: rq worker scan-processing --url redis://localhost:6379
"""
import os
import redis
from rq import Worker, Queue, Connection
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

if __name__ == "__main__":
    conn = redis.from_url(REDIS_URL)
    with Connection(conn):
        worker = Worker(
            [Queue("scan-processing"), Queue("gait-analysis")],
            connection=conn,
        )
        worker.work()
