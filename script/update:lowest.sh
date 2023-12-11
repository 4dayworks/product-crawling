#!/bin/bash

LOG_FILE="/Users/minsekim/projects/dayworks4/product-crawling/script/update:lowest.log"

echo "[$(date)] Script started" > $LOG_FILE

# Node.js와 npm의 경로 추가
export PATH="/Users/minsekim/.nvm/versions/node/v16.20.1/bin:$PATH"

curl -X GET -H "Authorization: Bearer dirldirlvkdlxld41669197319627067" "https://node2.yagiyagi.kr/cache/set?url=https%3A%2F%2Fnode2.yagiyagi.kr%2Fproduct%2Fprice%2Flowest%3Fsize%3D10%26page%3D0%26type%3Dreview" >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Script completed successfully" >> $LOG_FILE
else
    echo "[$(date)] Script encountered an error" >> $LOG_FILE
fi
