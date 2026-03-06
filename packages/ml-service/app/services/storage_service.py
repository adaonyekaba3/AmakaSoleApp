import os
import boto3
from botocore.config import Config


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.getenv("DO_SPACES_ENDPOINT"),
        region_name="us-east-1",
        aws_access_key_id=os.getenv("DO_SPACES_KEY"),
        aws_secret_access_key=os.getenv("DO_SPACES_SECRET"),
        config=Config(signature_version="s3v4"),
    )


BUCKET = os.getenv("DO_SPACES_BUCKET", "amakasole-assets")
CDN_ENDPOINT = os.getenv("DO_SPACES_CDN_ENDPOINT", "")


def download_file(key: str, local_path: str):
    client = get_s3_client()
    client.download_file(BUCKET, key, local_path)


def upload_file(local_path: str, key: str, content_type: str = "application/octet-stream"):
    client = get_s3_client()
    client.upload_file(
        local_path,
        BUCKET,
        key,
        ExtraArgs={"ContentType": content_type, "ACL": "public-read"},
    )


def get_cdn_url(key: str) -> str:
    if CDN_ENDPOINT:
        return f"{CDN_ENDPOINT}/{key}"
    return f"{os.getenv('DO_SPACES_ENDPOINT')}/{BUCKET}/{key}"
