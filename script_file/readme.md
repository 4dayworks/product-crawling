# sudo crontab -e 후 아래 스크립트 넣기

====================================================================================

MacOS Crontab

-> app.ts 반복서버 처리로 이동됨

====================================================================================

AWS Ubuntu Crontab

/Users/yagiyagi/projects/dayworks4/product-crawling/script_file -> /home/ubuntu/product-crawling/script_file

```
0 0 * * * /home/ubuntu/product-crawling/script_file/update:camp-es-all.sh
0 0 * * * /home/ubuntu/product-crawling/script_file/update:product-image.sh
0 */3 * * * /home/ubuntu/product-crawling/script_file/update:product-thirthmall.sh
*/10 * * * * /home/ubuntu/product-crawling/script_file/update:lowest.sh
* * * * * /home/ubuntu/product-crawling/script_file/update:home-shopping-send-push.sh
0 18 * * * /home/ubuntu/product-crawling/script_file/update:home-shopping-get-shoppingmall.sh
0 0 * * * /home/ubuntu/product-crawling/script_file/update:camp-feed-naver-seo.sh
0 0 * * * /home/ubuntu/product-crawling/script_file/update:camp-seo.sh
0 0 * * * /home/ubuntu/product-crawling/script_file/update:camperest-campsite-all.sh
30 0 * * * /home/ubuntu/product-crawling/script_file/update:delete-search-used-function.sh
```

====================================================================================
