#!/bin/bash

LOG_FILE="/Users/minsekim/projects/dayworks4/product-crawling/script/update:product-thirthmall.log"

echo "[$(date)] Script started" > $LOG_FILE

# Node.js와 npm의 경로 추가
export PATH="/Users/minsekim/.nvm/versions/node/v16.20.1/bin:$PATH"

cd /Users/minsekim/projects/dayworks4/product-crawling
npm run update:product-thirthmall >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Script completed successfully" >> $LOG_FILE
else
    echo "[$(date)] Script encountered an error" >> $LOG_FILE
fi
