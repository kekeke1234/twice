# twice 프로젝트 - Judge0 컴파일러 오류 해결

## 문제
- 코드 실행 시 "Failed to fetch" 오류
- Judge0 API 서버 (localhost:2355) 연결 불가

## 원인
- Docker가 설치되지 않음 (도커 명령 인식 불가)
- Docker Desktop 설치 시 "PC에서는 이 앱을 실행할 수 없습니다" 에러 발생

## 해결 방법

### 1단계: WSL 2와 Hyper-V 활성화 (관리자 PowerShell)
```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
→ PC 재부팅 필요

### 2단계: Docker Desktop 설치
https://www.docker.com/products/docker-desktop 에서 다운로드 및 설치

### 3단계: Judge0 서버 실행
```powershell
docker run -d -p 2355:2355 --name judge0 judge0/judge0:latest
```

### 4단계: twice 앱 실행
```bash
cd C:\Users\장재영\dev\twice
npm run dev
```

## 현재 상태
- [ ] WSL 2/Hyper-V 활성화 안됨
- [ ] Docker Desktop 설치 안됨
- [ ] Judge0 서버 미실행
