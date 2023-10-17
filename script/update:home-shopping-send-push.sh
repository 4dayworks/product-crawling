#!/bin/bash

LOG_FILE="/Users/minsekim/projects/Yagiyagi/product-crawling/script/update:lowest.log"

echo "[$(date)] Script started" > $LOG_FILE

# Node.js와 npm의 경로 추가
export PATH="/Users/minsekim/.nvm/versions/node/v16.20.1/bin:$PATH"

curl -X GET -H "Authorization: Bearer dirldirlvkdlxld41669197319627067" "https://node2.yagiyagi.kr//crawling/shop/check" >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Script completed successfully" >> $LOG_FILE
else
    echo "[$(date)] Script encountered an error" >> $LOG_FILE
fi
