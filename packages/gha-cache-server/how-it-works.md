---
title: How it works
description: How the cache server integrates with GitHub Actions
outline: [2, 4]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Reverse-Engineered API

We replicate the official cache API by examining runner requests and the actions/cache source. See GitHub docs on cache keys.

## Self-Hosted Runner Setup

### Binary Patch

The runner overrides `ACTIONS_RESULTS_URL` with GitHub's official endpoint.

```c# [Excerpt from the runner source]
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

We patched the binary by replacing the strings `ACTIONS_RESULTS_URL` with `ACTIONS_RESULTS_ORL`, so that the runner overrides a dummy environment variable instead.
