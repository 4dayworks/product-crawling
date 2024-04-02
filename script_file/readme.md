# sudo crontab -e 후 아래 스크립트 넣기

====================================================================================

MacOS Crontab

```
* * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camperest-camppost-resize-all.sh
*/5 * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camperest-delivery-update.sh
```

====================================================================================

AWS Ubuntu Crontab

/Users/yagiyagi/projects/dayworks4/product-crawling/script -> /home/ubuntu/product-crawling/script

```
0 0 * * * /home/ubuntu/product-crawling/script/update:camp-es-all.sh
0 0 * * * /home/ubuntu/product-crawling/script/update:product-image.sh
0 */3 * * * /home/ubuntu/product-crawling/script/update:product-thirthmall.sh
*/10 * * * * /home/ubuntu/product-crawling/script/update:lowest.sh
* * * * * /home/ubuntu/product-crawling/script/update:home-shopping-send-push.sh
0 18 * * * /home/ubuntu/product-crawling/script/update:home-shopping-get-shoppingmall.sh
0 0 * * * /home/ubuntu/product-crawling/script/update:camp-feed-naver-seo.sh
0 0 * * * /home/ubuntu/product-crawling/script/update:camp-seo.sh
0 0 * * * /home/ubuntu/product-crawling/script/update:camperest-campsite-all.sh
30 0 * * * /home/ubuntu/product-crawling/script/update:delete-search-used-function.sh
```

====================================================================================
