from flask_caching import Cache

# usage:
# @cache.memoize(60)
cache = Cache(config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_HOST': 'redis',
    'CACHE_REDIS_PORT': '6380',
    'CACHE_REDIS_URL': 'redis://redis:6380/1'
})


# usage:
# set_memoized_cache(function, value, key)
def set_memoized_cache(f, return_value, *args, **kwargs):
    key = f.make_cache_key(f.uncached, *args, **kwargs)
    cache.set(key, return_value, timeout=f.cache_timeout)
