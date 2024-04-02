# #!/bin/bash

# LOG_FILE="/home/ubuntu/product-crawling/script_file/update:camp-feed-naver-seo.log"

# echo "[$(date)] Script started" > $LOG_FILE

# # Node.js와 npm의 경로 추가
# # export PATH="/Users/yagiyagi/.nvm/versions/node/v16.20.1/bin:$PATH"
# export PATH="/Users/yagiyagi/.nvm/versions/node/v18.19.0/bin/node:$PATH"

# # 기준 날짜 설정 (예: 2024년 1월 10일)
# BASE_DATE="2024-01-10"

# # 현재 날짜와 기준 날짜 사이의 차이(일) 계산
# TODAY=$(date +%F)
# # macOS에서 날짜 차이 계산
# PAGE=$(( ($(date -jf "%Y-%m-%d" "$TODAY" +"%s") - $(date -jf "%Y-%m-%d" "$BASE_DATE" +"%s")) / 86400 ))


# echo "[$(date)] Script started" > $LOG_FILE

# curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer dirldirlvkdlxld41669197319627067" "http://localhost:4003/seo/naver/manual" -d "{\"page\": $PAGE, \"size\": 50}" >> $LOG_FILE 2>&1

# if [ $? -eq 0 ]; then
#     echo "[$(date)] Script completed successfully" >> $LOG_FILE
# else
#     echo "[$(date)] Script encountered an error" >> $LOG_FILE
# fi





