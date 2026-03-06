terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.34"
    }
  }
  required_version = ">= 1.0"
}

provider "digitalocean" {
  token = var.do_token
}

# App Platform — API
resource "digitalocean_app" "amakasole_api" {
  spec {
    name   = "amakasole-api-${var.environment}"
    region = var.region

    service {
      name               = "api"
      instance_count     = var.api_instance_count
      instance_size_slug = var.api_instance_size
      http_port          = 3000

      github {
        repo           = var.github_repo
        branch         = var.environment == "production" ? "main" : "staging"
        deploy_on_push = true
      }

      source_dir = "packages/api"

      build_command = "npm install && npm run build"
      run_command   = "node dist/server.js"

      env {
        key   = "DATABASE_URL"
        value = var.database_url
        type  = "SECRET"
      }
      env {
        key   = "REDIS_URL"
        value = var.redis_url
        type  = "SECRET"
      }
      env {
        key   = "JWT_SECRET"
        value = var.jwt_secret
        type  = "SECRET"
      }
      env {
        key   = "STRIPE_SECRET_KEY"
        value = var.stripe_secret_key
        type  = "SECRET"
      }
      env {
        key   = "NODE_ENV"
        value = var.environment
      }
    }
  }
}

# App Platform — ML Service
resource "digitalocean_app" "amakasole_ml" {
  spec {
    name   = "amakasole-ml-${var.environment}"
    region = var.region

    service {
      name               = "ml-service"
      instance_count     = 1
      instance_size_slug = var.ml_instance_size
      http_port          = 8000

      github {
        repo           = var.github_repo
        branch         = var.environment == "production" ? "main" : "staging"
        deploy_on_push = true
      }

      source_dir     = "packages/ml-service"
      dockerfile_path = "packages/ml-service/Dockerfile"

      env {
        key   = "REDIS_URL"
        value = var.redis_url
        type  = "SECRET"
      }
    }
  }
}

# Spaces bucket for scan data
resource "digitalocean_spaces_bucket" "assets" {
  name   = "amakasole-assets-${var.environment}"
  region = var.spaces_region
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}

# CDN for Spaces
resource "digitalocean_cdn" "assets_cdn" {
  origin = digitalocean_spaces_bucket.assets.bucket_domain_name
}

# Managed Redis
resource "digitalocean_database_cluster" "redis" {
  name       = "amakasole-redis-${var.environment}"
  engine     = "redis"
  version    = "7"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
}
