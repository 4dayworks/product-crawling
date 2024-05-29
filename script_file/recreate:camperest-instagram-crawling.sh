#!/bin/bash

LOG_FILE="/Users/yagiyagi/projects/dayworks4/product-crawling/script_file/recreate:camperest-instagram-crawling.log"
echo "[$(date)] Script started" > $LOG_FILE

# Node.js와 npm의 경로 추가
export PATH="/Users/yagiyagi/.nvm/versions/node/v18.19.0/bin:$PATH"

curl -X DELETE -H "Authorization: Bearer dirldirlvkdlxld41669197319627067" "http://localhost:4003/crawling/instargram/restart/current" >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Script completed successfully" >> $LOG_FILE
else
    echo "[$(date)] Script encountered an error" >> $LOG_FILE
fi
