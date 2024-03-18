# sudo crontab -e 후 아래 스크립트 넣기

```
0 0 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camp-es-all.sh
0 0 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:product-image.sh
0 */3 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:product-thirthmall.sh
*/10 * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:lowest.sh
* * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:home-shopping-send-push.sh
0 18 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:home-shopping-get-shoppingmall.sh
0 0 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camp-feed-naver-seo.sh
0 0 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camp-seo.sh
*/5 * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camperest-delivery-update.sh
0 0 * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camperest-campsite-all.sh
* * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camperest-camppost-resize-all.sh
```

야기야기 습관 알림 발송

```
0 * * * * /Users/yagiyagi/projects/dayworks4/product-crawling/script/update:fourweek-send-push.sh
```
