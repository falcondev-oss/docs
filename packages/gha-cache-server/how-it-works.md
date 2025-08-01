---
title: How it works
description: How the cache server integrates with GitHub Actions
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 1. Reverse-Engineering

We replicate the official cache API by examining runner requests and the actions/cache source. See GitHub docs on cache keys.

## 2. Configuring the Runner

The runner overrides `ACTIONS_RESULTS_URL` with its internal endpoint. We patched the binary by replacing `ACTIONS_RESULTS_URL` with `ACTIONS_RESULTS_ORL` (keeping the same length) to allow a custom cache URL.

```c#
var systemConnection = ExecutionContext.Global.Endpoints.Single(x => string.Equals(x.Name, WellKnownServiceEndpointNames.SystemVssConnection, StringComparison.OrdinalIgnoreCase));
Environment["ACTIONS_RUNTIME_URL"] = systemConnection.Url.AbsoluteUri;
Environment["ACTIONS_RUNTIME_TOKEN"] = systemConnection.Authorization.Parameters[EndpointAuthorizationParameters.AccessToken];
if (systemConnection.Data.TryGetValue("CacheServerUrl", out var cacheUrl) && !string.IsNullOrEmpty(cacheUrl))
{
    Environment["ACTIONS_CACHE_URL"] = cacheUrl;
}
if (systemConnection.Data.TryGetValue("PipelinesServiceUrl", out var pipelinesServiceUrl) && !string.IsNullOrEmpty(pipelinesServiceUrl))
{
    Environment["ACTIONS_RUNTIME_URL"] = pipelinesServiceUrl;
}
if (systemConnection.Data.TryGetValue("GenerateIdTokenUrl", out var generateIdTokenUrl) && !string.IsNullOrEmpty(generateIdTokenUrl))
{
    Environment["ACTIONS_ID_TOKEN_REQUEST_URL"] = generateIdTokenUrl;
    Environment["ACTIONS_ID_TOKEN_REQUEST_TOKEN"] = systemConnection.Authorization.Parameters[EndpointAuthorizationParameters.AccessToken];
}
if (systemConnection.Data.TryGetValue("ResultsServiceUrl", out var resultsUrl) && !string.IsNullOrEmpty(resultsUrl))
{
    Environment["ACTIONS_RESULTS_URL"] = resultsUrl;
}

if (ExecutionContext.Global.Variables.GetBoolean("actions_uses_cache_service_v2") ?? false)
{
    Environment["ACTIONS_CACHE_SERVICE_V2"] = bool.TrueString;
}
```
