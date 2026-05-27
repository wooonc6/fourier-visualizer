# 푸리에 변환 — 시각적 완전 해설

직접 손으로 조작하며 푸리에 변환을 이해할 수 있는 인터랙티브 학습 사이트입니다.  
3Blue1Brown의 "But what is the Fourier Transform?" 영상을 기반으로 제작되었습니다.

**🌐 사이트 바로가기**
- [① 푸리에 변환 기초 (CFT)](https://wooonc6.github.io/fourier-visualizer/)
- [② DFT vs FFT · FNO 연결](https://wooonc6.github.io/fourier-visualizer/fft.html)
- [③ 전체 스토리 — 오일러 공식부터 FNO까지](https://wooonc6.github.io/fourier-visualizer/fourier-story.html)

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

### [③ 전체 스토리 — 오일러 공식부터 FNO까지](https://wooonc6.github.io/fourier-visualizer/fourier-story.html)

오일러 공식에서 출발해 FNO 적용까지 11개 섹션을 스크롤로 이어가는 통합 해설 페이지입니다.

| 섹션 | 내용 | 인터랙션 |
|------|------|----------|
| 1. 오일러 공식 | e^iθ = cosθ + i·sinθ | θ 슬라이더로 회전 확인 |
| 2. 복잡한 파형 | 여러 주파수의 합성 | f₁/f₂/f₃ 진폭 조절 |
| 3. FT 수식 | F(ω) = ∫f(t)e^{−iωt}dt | — |
| 4. 원에 감기 | 복소평면 Wrapping | 신호/감기 주파수 슬라이더 |
| 5. 질량 중심 | 주파수 세기 측정 | 실시간 질량 중심 계산 |
| 6. 발견의 순간 | 주파수 정렬 | — |
| 7. 스펙트럼 | 주파수 스파이크 | 2번 연동 실시간 갱신 |
| 8. FT 수식 해설 | 세 요소 분해 | — |
| 9. DFT | 이산화 + N=4 계산기 | 샘플 값 입력 |
| 10. FFT | O(N²)→O(N log N) | N 슬라이더 + 나비 다이어그램 |
| 11. FNO 역할 | FNO + SSM 구조 | — |

---

## 기술 스택

- HTML / CSS / JavaScript
- [P5.js](https://p5js.org/) — 인터랙티브 시각화
- [KaTeX](https://katex.org/) — 수식 렌더링
- GitHub Pages — 호스팅

## 원본

3Blue1Brown — [But what is the Fourier Transform? A visual introduction.](https://www.3blue1brown.com/lessons/fourier-transforms)

