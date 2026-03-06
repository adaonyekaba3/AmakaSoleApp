variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment (staging or production)"
  type        = string
  default     = "staging"
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc3"
}

variable "spaces_region" {
  description = "DigitalOcean Spaces region"
  type        = string
  default     = "nyc3"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo)"
  type        = string
}

variable "database_url" {
  description = "Neon PostgreSQL connection URL"
  type        = string
  sensitive   = true
}

variable "redis_url" {
  description = "Redis connection URL"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
}

variable "api_instance_count" {
  description = "Number of API instances"
  type        = number
  default     = 1
}

variable "api_instance_size" {
  description = "API instance size slug"
  type        = string
  default     = "basic-xxs"
}

variable "ml_instance_size" {
  description = "ML service instance size slug"
  type        = string
  default     = "basic-xs"
}
