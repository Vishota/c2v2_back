import test from 'vitools/testTime'

let i = 0;
test(async () => {
  await fetch("http://localhost/auth?signup&password=qqqqQQQ1&username=u3test"+i++, {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    "method": "GET",
    "mode": "cors"
  });
}, 1000).then(v => console.log(i, v))