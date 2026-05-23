# 푸리에 변환 — 시각적 완전 해설

직접 손으로 조작하며 푸리에 변환을 이해할 수 있는 인터랙티브 학습 사이트입니다.  
3Blue1Brown의 "But what is the Fourier Transform?" 영상을 기반으로 제작되었습니다.

---

## 📄 학습 자료

### [① 푸리에 변환 기초 (CFT)](https://wooonc6.github.io/fourier-visualizer/)

연속 푸리에 변환의 핵심 개념을 직관적으로 이해합니다.

| 섹션 | 내용 | 인터랙션 |
|------|------|----------|
| 1. 왜 필요한가 | 사인파 합성 문제 | 파형 합성기 — 여러 주파수를 섞고 복합 파형 확인 |
| 2. 3단계 접근법 | 핵심 아이디어 개요 | — |
| 3. 원에 감기 | 질량 중심 이동 원리 | 감기 주파수 슬라이더로 질량 중심 이동 체험 |
| 4. 주파수 스펙트럼 | "거의 푸리에 변환" | 자동 스캔으로 스파이크 발생 확인 |
| 5. 공식 | 수식 및 오일러 공식 연결 | KaTeX 수식 렌더링 |
| 6. 최종 정리 | 핵심 개념 요약 | 응용 분야 |

---

### [② DFT vs FFT · FNO 연결](https://wooonc6.github.io/fourier-visualizer/fft.html)

이산 푸리에 변환(DFT)과 고속 푸리에 변환(FFT)의 차이, 그리고 프로젝트(FNO)와의 연결을 다룹니다.

| 섹션 | 내용 | 인터랙션 |
|------|------|----------|
| 4-0. O() 표기법 | 알고리즘 복잡도 개념 | 성장 곡선 비교 그래프 (N 조절) |
| 4-1. DFT | 왜 O(N²)인가 | N에 따른 연산 횟수 시각화 |
| 4-2. FFT | 왜 O(N log N)인가 | DFT vs FFT 연산 횟수 비교 |
| 5. FNO 연결 | 합성곱 정리, 모델 분업 구조 | — |

---

## 기술 스택

- HTML / CSS / JavaScript
- [P5.js](https://p5js.org/) — 인터랙티브 시각화
- [KaTeX](https://katex.org/) — 수식 렌더링
- GitHub Pages — 호스팅

## 원본

3Blue1Brown — [But what is the Fourier Transform? A visual introduction.](https://www.3blue1brown.com/lessons/fourier-transforms)
