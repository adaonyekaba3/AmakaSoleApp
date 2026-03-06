output "api_url" {
  description = "API application URL"
  value       = digitalocean_app.amakasole_api.default_ingress
}

output "ml_service_url" {
  description = "ML service application URL"
  value       = digitalocean_app.amakasole_ml.default_ingress
}

output "spaces_bucket_name" {
  description = "Spaces bucket name"
  value       = digitalocean_spaces_bucket.assets.name
}

output "cdn_endpoint" {
  description = "CDN endpoint for assets"
  value       = digitalocean_cdn.assets_cdn.endpoint
}

output "redis_host" {
  description = "Managed Redis host"
  value       = digitalocean_database_cluster.redis.host
  sensitive   = true
}
