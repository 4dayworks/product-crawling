# sudo crontab -e 후 아래 스크립트 넣기

```
0 0 * * * /Users/minsekim/projects/Yagiyagi/product-crawling/script/update:product-image.sh
0 */3 * * * /Users/minsekim/projects/Yagiyagi/product-crawling/script/update:product-thirthmall.sh
*/10 * * * * /Users/minsekim/projects/Yagiyagi/product-crawling/script/update:lowest.sh
* * * * * /Users/minsekim/projects/Yagiyagi/product-crawling/script/update:home-shopping-send-push.sh
0 18 * * * /Users/minsekim/projects/Yagiyagi/product-crawling/script/update:home-shopping-get-shoppingmall.sh
0 * * * * /Users/minsekim/projects/Yagiyagi/product-crawling/script/update:fourweek-send-push.sh
```
