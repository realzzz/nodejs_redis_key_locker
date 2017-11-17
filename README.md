# nodejs_redis_key_locker


If you are using nodejs cluster and try to find a locker machanism between instances, this could help.


The idea is simple, having instances access to the same redis server, and try to set value to a key for GetLock/ReleaseLock operations.


````
// if need to lock a key
lockKey(KEY_TO_LOCK, "value_of_my_lock", wait_time_out, callback_for_result);

// if need to unlock a key
unlockKey(KEY_TO_LOCK, "ori_value_key", callback_for_result);

````
