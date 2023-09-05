#!/bin/bash

LOG_FILE="/Users/minsekim/projects/Yagiyagi/product-crawling/script/get_product_image.log"

echo "[$(date)] Script started" >> $LOG_FILE

# NVM 환경 설정
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 원하는 Node 버전 활성화
nvm use v16.20.1

cd /Users/minsekim/projects/Yagiyagi/product-crawling

/Users/minsekim/.yarn/bin/yarn update:product-image >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] Script completed successfully" >> $LOG_FILE
else
    echo "[$(date)] Script encountered an error" >> $LOG_FILE
fi
