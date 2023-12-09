import testTime from 'vitools/testTime'
import { testMultithread } from 'vitools/testMultithread'

const attempt = 3

testMultithread(async () => {
  const tested = await testTime(async () => {
    let requests: Promise<any>[] = []
    for (let i = 0; i < 10000; i++) {
      requests.push(
        fetch(`http://localhost/auth?signup&password=qqqqQQQ1&username=a${attempt}mt${process.pid}test` + i, {
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
        }).catch(e => console.warn(`${e} catched: `, e))
      );
      await Promise.all(requests);
    }
  }, 1);
  console.log(tested, `thread with pid ${process.pid}`);
}, {
  delay: 0,
  threadCount: 12,
  logs: true
})
