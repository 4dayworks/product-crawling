#!/bin/bash

# S3 URL에서 .mp4 파일 목록
FILES=(
    # "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/kFzLSoqU0WE.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-VN90lkRYV0.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-VH4sm4ME1U.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-TYAJlvJThw.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-tfVP_g97Qs.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-sOKVuDT4Uo.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-o8syyPDMMs.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-nLVKV9D56c.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-kkhzDal-Rw.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-fRHQfLFcAM.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-FhkJ3mK5hk.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-cvEcqB_F2Q.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-COkNavbJ5I.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-B-Z4WFqwbg.mp4"
    "https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/shorts/-8z0qL-d_9c.mp4"
)


# 'video' 폴더 생성 및 해당 폴더로 이동
mkdir -p video
cd video

# 파일 다운로드 및 첫 번째 프레임 저장
for file_url in "${FILES[@]}"; do
    # 파일명 추출
    filename=$(basename "$file_url")
    base=${filename%.mp4}

    # S3에서 파일 다운로드 (curl 사용)
    curl -o "./$filename" "$file_url"

    # 첫 번째 프레임을 이미지로 저장
    ffmpeg -i "./$filename" -ss 00:00:00 -vframes 1 "./${base}_intro.png"
done

