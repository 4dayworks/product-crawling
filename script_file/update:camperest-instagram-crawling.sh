#!/bin/bash

LOG_FILE="/Users/yagiyagi/projects/dayworks4/product-crawling/script_file/update:camperest-instagram-crawling.log"
PID_FILE="/tmp/camperest_instagram_crawling.pid"

# 이미 실행 중인지 확인
if [ -f $PID_FILE ]; then
  if kill -0 $(cat $PID_FILE) > /dev/null 2>&1; then
    echo "[$(date)] Script is already running" >> $LOG_FILE
    exit 1
  else
    # PID 파일이 있지만 프로세스가 실행 중이 아닌 경우, PID 파일 삭제
    rm -f $PID_FILE
  fi
fi

# PID 파일 생성
echo $$ > $PID_FILE

echo "[$(date)] Script started" > $LOG_FILE

# Node.js와 npm의 경로 추가
export PATH="/Users/yagiyagi/.nvm/versions/node/v18.19.0/bin:$PATH"

# 무한 루프 시작
while true
do
   curl -X PATCH -H "Authorization: Bearer dirldirlvkdlxld41669197319627067" "http://localhost:4001/instagram/crawling/process" >> $LOG_FILE 2>&1
    if [ $? -eq 0 ]; then
        echo "[$(date)] Script completed successfully" >> $LOG_FILE
    else
        echo "[$(date)] Script encountered an error" >> $LOG_FILE
    fi
  sleep 1
done

# 스크립트 종료 시 PID 파일 삭제
trap "rm -f $PID_FILE" EXIT
