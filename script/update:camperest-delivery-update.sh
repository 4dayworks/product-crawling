#!/bin/bash

LOG_FILE="/Users/yagiyagi/projects/dayworks4/product-crawling/script/update:camperest-delivery-update.log"

echo "[$(date)] Script started" > $LOG_FILE

# Node.js와 npm의 경로 추가
# export PATH="/Users/yagiyagi/.nvm/versions/node/v16.20.1/bin:$PATH"
export PATH="/Users/yagiyagi/.nvm/versions/node/v18.19.0/bin/node:$PATH"

curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer dirldirlvkdlxld41669197319627067" "http://localhost:4003/pay/purchase/delivery/all" >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Script completed successfully" >> $LOG_FILE
else
    echo "[$(date)] Script encountered an error" >> $LOG_FILE
fi



