var cache = require('memory-cache');

const cached_page = cache.put('cached_page', 'cached page OLE OLE');
console.log(`put page to cache`, cached_page)
// cache.clear()