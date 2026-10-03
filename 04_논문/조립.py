"""장별 원고 → 논문_전체 조립 (2026-10-02, 16단계)
사용: paper 폴더에서 `python 조립.py`  — ORDER의 파일명을 최신 버전으로 맞춘 뒤 실행
- 각 파일의 머리말(첫 '---'까지) 제거, 4.1~4.4는 '# 4. 결과' 아래로 한 단계 내림
- 4.2의 각주 ¹² → ²³ (4.1의 ¹과 겹치지 않게)
- 캡션 끝 *(파일명.png)* → 캡션 앞 이미지 링크 figures/파일명.png
- 표·그림 번호를 등장 순서로 한 번에 재정렬(연쇄 치환 방지). 마침표 뒤 숫자(소수)만 제외
"""
import re
ORDER=['0_초록_v2.md','1장_서론_v6.md','2장_관련연구_v5.md','3장_연구설계_v7.md','4.1_벤치마크층위_v11.md','4.2_모델층위_v7.md','4.3_개선층위_v3.md','4.4_해석층위_v4.md','5장_논의_v4.md','6장_한계_v3.md','7장_결론_v2.md','8_참고문헌_v1.md','9_부록A_v1.md','9_부록B_v1.md']
PAT=r'(표|그림) (M\d+|\d+)(?!\d)(?!\.\d)'
TM={'M1':1,'M2':2,'M3':3,'M4':4,'1':5,'2':6,'3':7,'4':8,'5':9,'6':10,'7':11,'8':12,'9':13,'10':14,'11':15,'12':16}
FM={'M1':1,'1':2,'2':3,'3':4,'4':5,'5':6,'6':7,'7':8,'8':9}
def body(f):
    L=open('원고/'+f,encoding='utf-8').read().split('\n'); i=next(k for k,l in enumerate(L) if l.strip()=='---'); assert i<12,f
    return L[0],'\n'.join(L[i+1:]).strip('\n')
parts=[]
t,b=body(ORDER[0])
ko=re.search(r'^## (높은 탐지 성능은[^\n]+)',b,re.M).group(1); en=re.search(r'^## (What Does[^\n]+)',b,re.M).group(1)
b=b.replace('## '+ko,'## 초록').replace('## '+en,'## Abstract\n\n*'+en+'*')
parts.append('# '+ko+'\n\n*'+en+'*\n\n'+b)
for f in ORDER[1:]:
    t,b=body(f)
    if f.startswith('4.'):
        if f.startswith('4.1'): parts.append('# 4. 결과')
        t='#'+t; b=re.sub(r'^(#{2,})',r'#\1',b,flags=re.M)
        if f.startswith('4.2'): b=b.replace('¹','\x01').replace('²','³').replace('\x01','²')
    parts.append(t+'\n\n'+b)
doc='\n\n---\n\n'.join(parts)+'\n'
doc=re.sub(r'(\*\*그림 M?\d+\.\*\*[^\n]*?) \*\(([\w\-]+\.png)\)\*',lambda m:f'![](figures/{m.group(2)})\n\n{m.group(1)}',doc)
doc=re.sub(PAT,lambda m:f'{m.group(1)} {(TM if m.group(1)=="표" else FM)[m.group(2)]}',doc)
open('논문_전체_v1.md','w',encoding='utf-8').write(doc); print('조립 완료')
