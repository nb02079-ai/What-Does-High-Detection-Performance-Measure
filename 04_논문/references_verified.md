# 확인된 인용 목록

**작성일**: 2026-09-21
**원칙**: 본문에 쓰는 모든 수치 인용은 이 목록에서 출처를 확인한 뒤 사용한다. 미확인 인용은 본문에 쓰지 않는다.

---

## 1. CIC-MalMem-2022 선행 연구 보고치 (이진 분류 정확도)

| 출처 | 모델·방법 | 보고 정확도 | 확인 경로 |
|---|---|---|---|
| **Carrier et al. (2022)** — 데이터셋 원 논문 | 스태킹 앙상블 (NB·RF·DT → 로지스틱) | **99%** | ScienceDirect S2667305324001467 에서 인용 확인 |
| **Dener et al. (2022)** | 빅데이터 환경(PySpark), ML·DL 9종 비교 | **99.97%** (로지스틱 회귀), 다음 99.94%(GBT) | ✅ **원문 확인 (2026-09-30)** — MDPI 본문 |
| Sensors 23(11):5348 (MDPI, 2023) — "Obfuscated Memory Malware Detection in Resource-Constrained IoT Devices for Smart City Applications" | CompactCBL / RobustCBL | 99.92% / **99.98%** | mdpi.com/1424-8220/23/11/5348 |
| arXiv 2404.02372 (2024) — "Obfuscated Malware Detection: Investigating Real-world…" | RandomForest | **99.99%** | arxiv.org/pdf/2404.02372 |
| arXiv 2602.02184 — "Malware Detection Through Memory Analysis" | XGBoost | 99.98% | arxiv.org/pdf/2602.02184 |
| arXiv 2407.07918 / ScienceDirect (2024) — "Detecting new obfuscated malware variants: A lightweight and interpretable ML approach" | **상위 5개 특징만 사용** | > 99.8%, 파일당 5.7µs | sciencedirect.com/science/article/pii/S2667305324001467 |
| Emerald ACI (2025) — "Obfuscated file-less malware detection using integrating memory forensics data with ML techniques" | 메모리 포렌식 + ML | 최대 99.96% | emerald.com/aci/…/ACI-02-2025-0052 |

### ⚠️ 정정 사항
- 기존 표현 "99.9~**100%**"는 **오류**. 정확도 100% 보고는 없음. 최대치는 **99.99%**
- "100%"로 오기억한 것은 다른 지표: 한 논문의 **AUC-ROC 1.0**, 다른 논문의 **재현율 100%**("detecting all the malware correctly")
- 올바른 서술: **"후속 연구들은 99.9~99.99%의 정확도를 보고했다"**
  - 이 범위의 근거로 쓸 수 있는 문헌: Dener(99.97), Sensors(99.92/99.98), arXiv 2404.02372(99.99), arXiv 2602.02184(99.98), Emerald ACI(99.96)
  - ⚠️ arXiv 2407.07918(**>99.8%**)은 이 범위 **밖**이므로 "99.9~99.99%"의 근거로 함께 인용하지 않는다
- **원 논문(Carrier et al.)은 99%** → "선행 연구 전반이 99.9% 이상"이라고 뭉뚱그리면 원 논문까지 포함해 부정확

### 서술 수위
- 선행 연구의 측정이 **틀렸다고 쓰지 않는다** — 그들의 수치는 정확하게 측정된 것
- 본 연구의 주장: "이 높은 수치들은 모델의 우수성보다 **데이터셋의 성질**을 반영할 수 있다"
- 근거: 단일 특징 규칙(`svcscan.nservices`)만으로 99.63%, 깊이 1 트리 99.65%
- arXiv 2407.07918의 "상위 5개 특징으로 99.8%"는 저자들이 경량성의 장점으로 제시 → 본 연구의 관점에서는 "1개로도 충분했다"는 증거로 **재해석 가능**하나, 저자들을 비판하는 형태로 쓰지 않는다

---


### 랜섬웨어의 서비스 중지 — MITRE ATT&CK T1489 (2026-09-30)
- **서지**: MITRE ATT&CK. Service Stop, Technique T1489 — Enterprise (Version 1.4, last modified 12 May 2026; ATT&CK v19). https://attack.mitre.org/techniques/T1489/ (2026-09-30 접속)
- **성격**: 비학술 기술 문서이나 보안 연구에서 표준으로 인용되는 공격 기법 분류 체계. 각 사례는 1차 분석 보고서를 출처로 명시
- **기법 정의**: 공격자는 서비스를 중지해 정상 사용자가 쓸 수 없게 하거나, 실행 중에는 데이터 저장소를 수정할 수 없는 서비스(Exchange, SQL Server 등)를 멈춰 데이터 파괴·암호화를 가능하게 한다
- ✅ **CIC-MalMem-2022의 랜섬웨어 5개 계열 중 3개가 문서화됨**

| 계열 | MITRE 사례 설명 | 1차 출처 (MITRE 표기) |
|---|---|---|
| **Conti** (S0575) | `net stop`으로 **보안·백업·데이터베이스·이메일** 관련 Windows 서비스를 **최대 146개**까지 중지 가능 | Baskin (2020), Carbon Black TAU |
| **Maze** (S0449) | 데이터베이스를 암호화하기 위해 **SQL 서비스**를 중지 | Brandt & Mackenzie (2020), Sophos |
| **Pysa** (S0583) | 서비스와 프로세스를 중지할 수 있음 | CERT-FR (2020) |

  (Ako, Shade는 T1489 사례 목록에 없음)
- **4.1 서술 수정안**: 막연한 "일부 랜섬웨어는 ~알려져 있다" 대신 **데이터셋에 실제로 포함된 계열**을 근거로 제시 가능 → 반영 대기 목록 #7

### ⚠️ 검토했으나 쓰지 않기로 한 논증
- "Conti는 최대 146개 서비스를 멈출 수 있는데 Conti 덤프도 389개 → 행위가 반영됐다면 훨씬 적어야 한다 → 구성 차이 설명이 맞다"
- **쓰지 않는 이유**: "최대 146개"는 Conti가 **표적으로 삼는 서비스 목록**의 크기다. 분석용 VM에 그 서비스들(SQL Server, 백업 제품 등)이 **설치되어 있지 않으면** 실제로 멈출 서비스가 거의 없다. 따라서 Conti 덤프가 389개라는 사실은 행위 부재의 증거가 되지 못한다
- 4.1의 핵심 근거는 여전히 **15개 계열 전체의 균일성**(행동이 전혀 다른 애드웨어·트로이 목마까지 같은 값)

### Holzmann & Klar (2024) — 원문 대조 결과 (2026-09-30)
- **서지**: Holzmann, H., & Klar, B. (2024). Robust performance metrics for imbalanced classification problems. *arXiv preprint* arXiv:2404.07661. doi:10.48550/arXiv.2404.07661 (마르부르크대·카를스루에 공대)
- **게재 상태**: ✅ **사전 공개본** — 학술지 게재 표기 없음. 저자들의 R 패키지(RobustMetrics, CRAN)는 2025년 판에서 "(2024)", 2026년 판에서 "(2026)"으로 인용하나 두 경우 모두 arXiv DOI만 제시 → **개정판이 있을 수 있으므로 인용 시 참조한 버전을 표기**
- **정확한 주장** ⚠️ 막연한 "MCC는 불균형에 약하다"가 아님:
  - F-점수, 자카드 계수, **MCC**는 **소수 클래스 비율이 0으로 갈 때**, 그 지표를 기준으로 가장 좋은 분류기(베이즈 분류기)의 **소수 클래스 재현율도 0으로 간다**
  - 즉 **극단적 불균형**에서 이 지표들은 **소수 클래스를 무시하는 분류기를 선호**한다
  - 해법으로 **강건한 F-점수와 강건한 MCC**를 제안
- **본 연구와의 관련성** — 제한적:
  - 판정(H3·H5)은 모두 **클래스가 절반씩인 분할**에서 이루어짐 → 이 문제의 영향이 작음
  - 해당되는 곳은 **공식 시험 분할**(악성 78.8%, 정상 21.2%)의 통합 MCC 정도이며, 이마저 극단적 불균형은 아님. 4.4는 코호트별 탐지율·오탐률을 중심으로 해석함
- **3.6.1 서술 방향**: 반론을 소개하되 **왜 본 연구에는 영향이 작은지**를 함께 밝힌다

### Dener et al. (2022) — 원문 대조 결과
- **서지**: Dener, M., Ok, G., & Orman, A. (2022). Malware Detection Using Memory Analysis Data in Big Data Environment. *Applied Sciences*, 12(17), 8604. doi:10.3390/app12178604 (가지대·앙카라 이을드름 베야즛대, Editor's Choice)
- **데이터셋** ✅ CIC-MalMem-2022 균형판(58,596건, 정상·악성 각 29,298)
- **과제** ✅ 이진 분류
- **최고 정확도** ✅ 로지스틱 회귀 **99.97%**, AUC 100%. 두 번째 GBT 99.94%
- ⚠️ **기존 기록 "최대 99.9%"는 틀림** — 다른 논문(Emerald ACI)의 참고문헌 서술을 통해 간접적으로만 알던 값이었고, 그 2차 서술이 수치를 뭉뚱그림. **교훈: 2차 인용의 수치를 그대로 옮기지 않는다**
- **본 연구에 유용한 원문 사실 (서술 수위 주의)**
  - 분할: 덤프 단위 **70/30 무작위 분할을 10회 반복**해 평균 → 표 1 각주의 "무작위 분할(선행 연구 관행)"을 뒷받침하는 **사실 서술**로 사용 가능. 단 **비판하는 형태로 쓰지 않음**
  - 데이터셋 설명: "악성 덤프는 2GB 메모리 VM에서 VirusTotal 샘플을 실행해 생성, 이어서 **그 기계에서** 애플리케이션을 실행해 정상 덤프 생성" → 4.1 v3의 "같은 가상 머신" 서술과 일치하는 **독립 출처**
  - 원 55개 특징 중 3개(`pslist.nprocs64bit`, `handles.nport`, `svcscan.interactive_process_services`)는 전 덤프에서 0이라 제거
  - 참고: 원문 초록은 최저 정확도를 나이브 베이즈 98.41%, 본문 결과는 MLP 97.67%로 **서로 다르게** 적고 있음. 본 연구는 최고치만 인용하므로 영향 없음. 이 불일치는 인용하지 않음

---

## 2. 핵심 방법론 문헌

| 출처 | 용도 | 상태 |
|---|---|---|
| Arp, Quiring, Pendlebury, Warnecke, Pierazzi, Wressnegger, Cavallaro, Rieck. "Dos and Don'ts of Machine Learning in Computer Security." **USENIX Security 2022** | 서론 차별화, 2장 핵심 | ✅ (이전 조사에서 확인) |
| Pendlebury et al. "TESSERACT: Eliminating Experimental Bias in Malware Classification across Space and Time." **USENIX Security 2019** | 시간·공간 편향 | ✅ |
| Shokri et al. "Membership Inference Attacks against Machine Learning Models." **IEEE S&P 2017** | MIA 원전 | ✅ |
| Carlini et al. "Membership Inference Attacks From First Principles." **IEEE S&P 2022** | TPR@low-FPR 평가 원칙 | ✅ |
| Pierazzi et al. "Intriguing Properties of Adversarial ML Attacks in the Problem Space." **IEEE S&P 2020** | 교란 민감도 vs 실제 회피 | ✅ |
| Chicco & Jurman. "The advantages of the MCC over F1 score and accuracy in binary classification evaluation." **BMC Genomics 2020** | 주지표 MCC 근거 | ✅ |
| Barr-Smith et al. "Survivalism: Systematic Analysis of Windows Malware Living-Off-The-Land." **IEEE S&P 2021** | 특징 설계 근거 | ✅ |
| Caruana et al. "Ensemble Selection from Libraries of Models." **ICML 2004** | 스태킹 이득 한계 | ✅ |
| Kuncheva & Whitaker. "Measures of Diversity in Classifier Ensembles." **Machine Learning 2003** | 다양성-성능 무관 | ✅ |
| Frazier. "A Tutorial on Bayesian Optimization." arXiv:1807.02811 (2018) | GP-EI 근거 | ✅ |
| Domingos. "A Unified Bias-Variance Decomposition for Zero-One and Squared Loss." AAAI 2000 | 이진분류 분산 해석 | ✅ |

---

## 2A. 지름길 학습 문헌 (2.2 벤치마크 타당성)

| 출처 | 서지 | 상태 |
|---|---|---|
| **Geirhos et al. (2020)** | Geirhos, R., Jacobsen, J.-H., Michaelis, C., Zemel, R., Brendel, W., Bethge, M., & Wichmann, F. A. Shortcut learning in deep neural networks. *Nature Machine Intelligence*, 2(11), 665–673. doi:10.1038/s42256-020-00257-z | ✅ |
| **Lapuschkin et al. (2019)** | Lapuschkin, S., Wäldchen, S., Binder, A., Montavon, G., Samek, W., & Müller, K.-R. Unmasking Clever Hans predictors and assessing what machines really learn. *Nature Communications*, 10(1), 1096. doi:10.1038/s41467-019-08987-4 | ✅ |

### 핵심 인용 지점
- **Geirhos**: 지름길 = "표준 벤치마크에서는 잘 작동하나 더 까다로운 시험 조건(실제 환경)으로 전이되지 않는 결정 규칙". 저자들은 이것이 **생물·인공을 막론한 학습 시스템 일반의 특성**일 수 있다고 봄
- **Lapuschkin**: "표준 성능 평가 지표는 다양한 문제 해결 방식을 구분하지 못할 수 있다" → **본 연구 중심 주장의 이론적 닻**

### ⚠️ 사용 시 제약
1. **전이 실패를 시험하지 않았다** — Geirhos 정의상 지름길은 전이 실패를 포함. 본 연구는 벤치마크 내 성능만 보였으므로:
   - ❌ "지름길 학습을 입증했다"
   - ✅ "지름길의 전형적 특징을 보인다" / "지름길일 가능성이 높다"
2. **적용 범위** — Geirhos는 심층 신경망 대상. 본 연구의 발견은 결정트리. 저자들 스스로 "학습 시스템 일반의 특성"이라 한 점을 근거로 확장 서술

## 2B. 보안 ML의 벤치마크 타당성 선행 연구 — **직접적 선행 연구**

| 출처 | 서지 | 상태 |
|---|---|---|
| **BiasSeeker** | Wang, C., Xie, X., Wang, T., & Cui, Y. (2026). Bias in the Shadows: Explore Shortcuts in Encrypted Network Traffic Classification. *arXiv preprint* arXiv:2601.10180. doi:10.48550/arXiv.2601.10180 | ✅ **원문 전체 대조 완료 (2026-09-30)** — 칭화대 컴퓨터과학기술학과, 교신저자 Xie·Cui. v1(2026-01-15)만 존재, 학술지·학회 표기 없음 → **사전 공개본으로 인용** |
| **Jacobs et al. (2022)** | Jacobs, A. S., Beltiukov, R., Willinger, W., Ferreira, R. A., Gupta, A., & Granville, L. Z. (2022). AI/ML for Network Security: The Emperor has no Clothes. In *Proceedings of the 2022 ACM SIGSAC Conference on Computer and Communications Security (CCS '22)*, pp. 1537–1551, Los Angeles, CA, USA. ACM. doi:10.1145/3548606.3560609 (쪽수는 BiasSeeker 참고문헌 기준) | ✅ **확인 (2026-09-29)** — ACM DL·저자 PDF·NSF 저장소 일치 |
| DeGrave et al. | 흉부 X선 COVID-19 탐지기가 거의 완벽한 AUC를 내나 촬영 기관별 표식에 의존 | ⚠️ 미확인 — 비유로 활용 검토 |

### 핵심 인용 지점
- **BiasSeeker — 원문 대조 결과 (7개 항목)**
  1. **서지** ✅ 위 표 참조
  2. **동료 심사** ✅ 사전 공개본(학술지·학회 표기 없음)
  3. **"환경에 얽힌 특징"** ✅ 초록 원문 표현("spurious or environment-entangled features that may compromise generalization, independent of any classifier")
  4. **"19개 데이터셋, 과제 3종"** ✅ 단 **정밀하게 써야 함**: 19개는 **지름길 탐지(AMI 분석)**에 쓰였고, 성능 영향 평가는 과제별 2개씩 **6개 데이터셋**(범주당 최대 500 흐름 표본, 3회 반복 평균)에서 수행
  5. **방법** ✅ 패킷 필드와 라벨 사이의 조정 상호정보(AMI)로 상위 후보 선정 → 도메인 지식으로 3유형 분류(데이터 누출 식별자 / 상대적 인공물 / 과제 무관 필드) → 유형별 검증. **최종 판단은 사람이 한다**고 명시(준자동)
  6. ⚠️ **성능 영향도 측정한다** — 저희 차별점과 충돌. §IV-E1 "지름길 후보 특징이 분류 성능에 미치는 영향을 정량화"하기 위해 특징 **가림(zero padding / 상대 변환 / 무작위 마스킹)** 후 정확도 변화를 측정(Table III, NetMamba·결정트리). 가림 후 정확도가 **오히려 오른** 경우도 보고. 신뢰구간은 제시하지 않음
  7. **영역** ✅ 네트워크 트래픽 기반 — 단 **악성 트래픽 분류 과제 포함**(CIC-AndMal2017, USTC-TFC2016). "악성코드 탐지 영역에선 처음"이라고 쓰면 안 됨. 차이는 **네트워크 트래픽 vs 호스트 행위·메모리**
- 부가: 논의(§VI-C)에서 **"정확도 중심 최적화에서 회복력 중심 모델링으로 전환"**을 주장 → 본 연구의 문제의식과 방향이 같음. **동조 인용 가능**
- **Jacobs et al. (CCS '22)** — ✅ 원문 기준으로 **정정됨**: TRUSTEE를 제안. 블랙박스 모델과 학습 데이터로부터 **충실도가 높고 복잡도가 낮은 결정트리를 합성**해, 네트워크 운영자가 모델의 **과소 명세(underspecification)**를 판단하도록 돕는다. 재현 가능한 공개 모델에서 과소 명세의 세 사례 — **지름길 학습의 증거, 허위 상관, 분포 밖 샘플에 대한 취약성** — 를 드러냈다(CIC-IDS-2017 기반 모델 포함)
  → **본 연구와의 관계**: 결정트리로 보안 모델의 지름길을 드러낸다는 점에서 **본 연구의 얕은 결정트리 진단과 발상이 가깝다.** 차이: Jacobs는 학습된 모델에서 트리를 **추출**, 본 연구는 데이터에 얕은 트리를 **직접 적합**해 모델과 무관하게 벤치마크를 진단. 영역도 네트워크 vs 호스트 메모리·행위
- 🔎 **오귀속 내용의 출처 후보**: BiasSeeker 참고문헌 [14] Wickramasinghe, Shaghaghi, Tsudik, Jha, "SoK: Decoding the Enigma of Encrypted Network Traffic Classifiers," *IEEE S&P 2025*, pp. 1825–1843 — 암호화 트래픽 분류기의 문제를 다룬 SoK로, 앞서 잘못 귀속한 내용의 원 출처일 가능성이 있음. **미확인 — 사용하려면 원문 확인 필요**
- ⚠️ **오귀속 정정**: 기존 기록의 "체계화로 오래된 데이터셋 의존…, 암호화 트래픽 분류기 대다수가 레거시 데이터셋 때문에 실제로는 비암호화 트래픽 사용"은 **Jacobs et al.의 내용이 아니다.** 이전 검색 결과에서 다른 문헌의 내용이 같은 스니펫에 섞여 잘못 귀속된 것. **원 출처 미확인 → 본문 사용 금지** (필요하면 별도로 출처를 찾아 확인)

### ⚠️ 2.2 포지셔닝 수정 (중요)
- ❌ 폐기: "특정 공개 벤치마크의 편향을 정량화한 연구는 드묾"
- ✅ 수정: "벤치마크 타당성 문제는 네트워크 트래픽 분류에서 확인되어 왔다[Jacobs; Wang]. 본 연구는 이 문제의식을 **호스트 행위·메모리 기반 악성코드 탐지 벤치마크**로 확장하고, 이를 모델·개선·해석 층위와 연결한다."
- 사유: "처음이다"는 반례 하나에 무너지나, "기존 흐름을 새 영역으로 확장"은 방어 가능

### 본 연구의 차별점 — ⚠️ 2026-09-30 원문 대조 후 전면 수정

~~"BiasSeeker는 지름길을 탐지만 하고, 본 연구는 성능 기여 크기를 분리한다"~~ → **틀림.** BiasSeeker도 특징 가림으로 성능 영향을 측정함

| | Jacobs et al. (CCS '22) | BiasSeeker (2026, 사전 공개본) | 본 연구 |
|---|---|---|---|
| 영역 | 네트워크 보안 모델 | 네트워크 트래픽 분류 (VPN·**악성 트래픽**·앱) | **호스트 행위·메모리** 기반 악성코드 탐지 |
| 진단 대상 | 학습된 **모델**의 판단 근거 | **입력 특징**(패킷 필드) 중 지름길 후보 | (CIC) 단일 특징의 자명한 분리 / (DMBD) **입력에 없는 교란 변수**(수집 연도) |
| 방법 | 모델에서 결정트리 **추출** | 특징-라벨 상호정보 + 도메인 분류 | 데이터에 얕은 트리 **직접 적합** |
| 영향 측정 | — | 특징을 **가려** 정확도 변화 측정 | 교란 변수는 입력에 없어 **가릴 수 없음** → **평가 데이터를 재구성**(연도 범위 제한·연도별 클래스 균형, 표본 수 통제군)해 기여 분리 |
| 연결 | — | — | 벤치마크 층위를 모델·개선·해석 층위와 연결 |

**핵심 차별점 (정확한 표현)**: 기존 연구는 **모델이 입력으로 받는 특징** 가운데 지름길을 찾고 그 특징을 가려 영향을 잰다. 본 연구의 DMBD 교란은 **모델 입력에 포함되지 않은 수집 연도**에서 비롯되며 행위 특징에 간접적으로 스며 있으므로 특징 가림으로는 다룰 수 없다. 본 연구는 평가 데이터를 재구성해 이 교란의 기여를 분리했다.

**⚠️ 주장하면 안 되는 것**: "본 연구는 신뢰구간을 제시해 더 엄밀하다" — **표 2(교란 분리)에도 신뢰구간이 없음**. 비교 우위로 쓰지 않음

### 교훈 (기록)
"드묾"이라는 주장을 검색 한 번으로 반박할 선행 연구가 존재했다. **"없다/드물다"류 주장은 반드시 검색으로 확인 후 사용**하며, 확인 범위를 한정어로 명시한다.

## 3. 데이터셋

| 데이터셋 | 인용 | 상태 |
|---|---|---|
| **DMBD 2025** | Lawrence Livermore National Laboratory. "Dynamic Malware Behaviorial Dataset." July 2025. LLNL-CODE-837816. (Wintap 기반, gdo-wintap.llnl.gov) | ✅ README 원문 확인 |
| **CIC-MalMem-2022** | Carrier, T., Victor, P., Tekeoglu, A., & Lashkari, A. H. (2022). Detecting Obfuscated Malware using Memory Feature Engineering. In *Proceedings of the 8th International Conference on Information Systems Security and Privacy (ICISSP 2022)*, Vol. 1, pp. 177–188. SciTePress. doi:10.5220/0010908200003120 | ✅ **확인 (2026-09-29)** — SciTePress·dblp·UNB 데이터셋 페이지 일치. 원 논문 보고치: 정확도 99.00%, F1 99.02% |

### ⚠️ Carrier et al. 확인 중 발견 — 데이터셋 README의 수집 환경 서술
- UNB/데이터셋 README: *"정상 샘플은 악성코드를 실행한 것과 **같은 Windows 10 VM**에서 다양한 애플리케이션으로 '정상 사용자 행위'를 만들어 생성"*
- 4.1 v2와 서론 ¶2 초안은 "**두** 가상 머신의 기본 상태 차이"로 서술 → **README와 충돌**
- 또한 README는 악성 샘플 **2,916개**, 본 연구가 파일명에서 복원한 실행 수는 **2,906개**(10개 차이)

---

## 4. 미확인 — 본문 사용 전 확인 필요

| 항목 | 사유 |
|---|---|
| Carrier et al. (2022) 정확한 서지 | 제목·학회명 원문 미확인 |
| Dener et al. (2022) 정확한 서지 | 2차 인용으로만 확인 |
| 업계 수치 (CrowdStrike 1~3% CPU 등, §7.1) | 벤더 자료이므로 인용 방식 결정 필요 |
