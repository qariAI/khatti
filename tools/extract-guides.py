import re,io,json,base64,sys,math
import numpy as np
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from PIL import Image,ImageDraw
from skimage.morphology import skeletonize
from skimage.measure import label,regionprops
from scipy import ndimage as ndi
import uharfbuzz as hb
from skan import Skeleton,summarize

css=open('src/styles.css',encoding='utf8').read()
m=re.search(r'font-family:HarfNaskh;src:url\(data:font/woff;base64,([A-Za-z0-9+/=]+)',css)
woff=base64.b64decode(m.group(1))
tt=TTFont(io.BytesIO(woff));tt.flavor=None;buf=io.BytesIO();tt.save(buf);ttf=buf.getvalue()
tt=TTFont(io.BytesIO(ttf));gs=tt.getGlyphSet();order=tt.getGlyphOrder();upem=tt['head'].unitsPerEm
face=hb.Face(hb.Blob(ttf));font=hb.Font(face)
S=.5 # px per font unit

class Flat(BasePen):
    def __init__(s,gs):
        super().__init__(gs);s.cs=[];s.c=None
    def _moveTo(s,p): s.c=[p];s.cs.append(s.c)
    def _lineTo(s,p): s.c.append(p)
    def _curveToOne(s,a,b,c):
        p0=s.c[-1]
        for i in range(1,13):
            t=i/12;u=1-t
            s.c.append((u**3*p0[0]+3*u*u*t*a[0]+3*u*t*t*b[0]+t**3*c[0],u**3*p0[1]+3*u*u*t*a[1]+3*u*t*t*b[1]+t**3*c[1]))
    def _qCurveToOne(s,a,c):
        p0=s.c[-1]
        for i in range(1,11):
            t=i/10;u=1-t
            s.c.append((u*u*p0[0]+2*u*t*a[0]+t*t*c[0],u*u*p0[1]+2*u*t*a[1]+t*t*c[1]))
    def _closePath(s): pass

def contours(gid):
    p=Flat(gs);gs[order[gid]].draw(p);return p.cs

def raster(cs):
    xs=[x for c in cs for x,y in c];ys=[y for c in cs for x,y in c]
    xmin,xmax,ymin,ymax=min(xs)-20,max(xs)+20,min(ys)-20,max(ys)+20
    W=int((xmax-xmin)*S)+1;H=int((ymax-ymin)*S)+1
    acc=np.zeros((H,W),bool)
    for c in cs:
        im=Image.new('1',(W,H),0);ImageDraw.Draw(im).polygon([((x-xmin)*S,(ymax-y)*S) for x,y in c],fill=1)
        acc^=np.array(im,bool)
    return acc,xmin,ymax

def rdp(pts,eps):
    if len(pts)<3:return pts
    a=np.array(pts[0]);b=np.array(pts[-1]);d=b-a;n=np.hypot(*d)
    ds=[abs(d[0]*(p[1]-a[1])-d[1]*(p[0]-a[0]))/n if n else math.hypot(p[0]-a[0],p[1]-a[1]) for p in pts[1:-1]]
    i=int(np.argmax(ds))+1
    if ds[i-1]>eps:
        return rdp(pts[:i+1],eps)[:-1]+rdp(pts[i:],eps)
    return [pts[0],pts[-1]]

def strokes_of(mask,xmin,ymax):
    """list of strokes (each a list of (fx,fy) in font units)"""
    lab=label(mask,connectivity=2);out=[]
    for r in regionprops(lab):
        h=r.bbox[2]-r.bbox[0];w=r.bbox[3]-r.bbox[1]
        comp=(lab==r.label)
        if max(h,w)/S<190 and r.area/S/S<16000:   # dot / hamza
            cy,cx=r.centroid;fx=xmin+cx/S;fy=ymax-cy/S
            out.append(('dot',[(fx-30,fy+30),(fx+30,fy-30)]));continue
        sk=skeletonize(comp)
        if sk.sum()<3:continue
        dt=ndi.distance_transform_edt(comp);thick=np.median(dt[sk])*2
        for it in range(2):
            s=Skeleton(sk);t=summarize(s,separator='-')
            drop=[]
            for i,row in t.iterrows():
                if row['branch-type']==1 and row['branch-distance']<thick*1.1:drop.append(i)
            if not drop:break
            for i in drop:
                co=s.path_coordinates(i).astype(int)
                # remove all but junction end: remove the endpoint side
                ends=co if row is None else co
                sk[co[:,0],co[:,1]]=False if False else sk[co[:,0],co[:,1]]
            # prune by removing the spur pixels except the junction pixel
            for i in drop:
                co=s.path_coordinates(i).astype(int)
                deg=[ (sk[max(0,r0-1):r0+2,max(0,c0-1):c0+2].sum()-1) for r0,c0 in co]
                # keep the pixel with highest degree (junction), remove others
                keep=int(np.argmax(deg));
                for k,(r0,c0) in enumerate(co):
                    if k!=keep:sk[r0,c0]=False
            sk=skeletonize(sk)
        if sk.sum()<3:continue
        s=Skeleton(sk);cand=[]
        for i in range(s.n_paths):
            co=s.path_coordinates(i)
            pts=[(xmin+c/S,ymax-r/S) for r,c in co]
            if len(pts)>=3:cand.append(('s',pts))
        if max(h,w)/S<330 and cand:cand=[max(cand,key=lambda t:len(t[1]))]
        out+=cand
    return out

def plen(p):return sum(math.dist(p[i],p[i+1]) for i in range(len(p)-1))
def tangent(p,end,n=6):
    a=p[end] ;b=p[min(len(p)-1,n)] if end==0 else p[max(0,len(p)-1-n)]
    return (a[0]-b[0],a[1]-b[1])  # pointing outward from the stroke at that end
def merge(strokes,gap=7,maxdev=55):
    strokes=[list(s) for s in strokes];changed=True
    while changed:
        changed=False
        best=None
        for i in range(len(strokes)):
            for j in range(i+1,len(strokes)):
                for ei in (0,-1):
                    for ej in (0,-1):
                        a=strokes[i][ei];b=strokes[j][ej]
                        if math.dist(a,b)>gap:continue
                        ti=tangent(strokes[i],0 if ei==0 else len(strokes[i])-1);tj=tangent(strokes[j],0 if ej==0 else len(strokes[j])-1)
                        # smooth continuation: outward tangent of one is opposite of the other's
                        ang=math.degrees(math.acos(max(-1,min(1,-(ti[0]*tj[0]+ti[1]*tj[1])/((math.hypot(*ti)*math.hypot(*tj)) or 1)))))
                        if ang<maxdev and (best is None or ang<best[0]):best=(ang,i,j,ei,ej)
        if best:
            _,i,j,ei,ej=best;a=strokes[i];b=strokes[j]
            if ei==0:a=a[::-1]
            if ej==-1:b=b[::-1]
            strokes[i]=a+b;del strokes[j];changed=True
    return strokes
def orient(pts):
    (x0,y0),(x1,y1)=pts[0],pts[-1];dx,dy=x1-x0,y1-y0
    if abs(dy)>1.2*abs(dx): return pts if dy<0 else pts[::-1]   # font y up: top->bottom means y decreasing
    return pts if dx<0 else pts[::-1]  # right->left

def orient_d(pts):
    (x0,y0),(x1,y1)=pts[0],pts[-1];dx,dy=x1-x0,y1-y0
    if abs(dy)>1.2*abs(dx): return pts if dy>0 else pts[::-1]
    return pts if dx<0 else pts[::-1]
def build(text,level_id,title,ar,cap,names):
    b=hb.Buffer();b.add_str(text);b.guess_segment_properties();b.direction='rtl';b.script='Arab';b.language='ar'
    hb.shape(font,b,{'rlig':False,'liga':False,'dlig':False,'clig':False})
    infos=b.glyph_infos;poss=b.glyph_positions
    x=0;glyphs=[]
    for inf,p in zip(infos,poss):
        glyphs.append(dict(gid=inf.codepoint,cl=inf.cluster,x=x+p.x_offset,y=p.y_offset));x+=p.x_advance
    total=x;k=min(880/total,.45);X0=(1000-total*k)/2;base=330
    steps=[];pend={}
    for g in sorted(glyphs,key=lambda g:g['cl']):
        ch=text[g['cl']]
        if ch.isspace():continue
        cs=contours(g['gid'])
        if not cs:continue
        mask,xmin,ymax=raster(cs)
        sts=strokes_of(mask,xmin,ymax)
        subs=[]
        conv=lambda pts:[(X0+(g['x']+fx)*k, base-(g['y']+fy)*k) for fx,fy in pts]
        body=[conv(p) for kind,p in sts if kind=='s'];dots=[conv(p) for kind,p in sts if kind=='dot']
        body=merge(body)
        body=[b for b in body if plen(b)>14]
        pend.setdefault(g['cl'],dict(name=names[ch],body=[],dots=[]));pend[g['cl']]['body']+=body;pend[g['cl']]['dots']+=dots
    for cl in sorted(pend):
        e=pend[cl];body=[orient_d(p) for p in e['body']];body.sort(key=lambda p:-plen(p));body=[rdp(p,1.3) for p in body]
        subs=body+e['dots']
        steps.append(dict(name=e['name'],subs=['M'+' L'.join('%.1f,%.1f'%p for p in pts) for pts in subs]))
    return dict(id=level_id,title=title,ar=ar,cap=cap,steps=steps)

names={'ا':'Alif','أ':'Alif','ل':'Lam','ه':'Ha','ك':'Kaf','ب':'Ba','ر':'Ra','م':'Mim','ح':'Ha','د':'Dal'}
L13=build('الله أكبر',13,'Allahu Akbar','الله أكبر',None,names)
L16=build('محمد',16,'Muhammad ﷺ','محمد ﷺ','Muhammad · peace be upon him',names)
json.dump([L13,L16],open('tools/levels.json','w'),ensure_ascii=False)
for L in (L13,L16):print(L['id'],[ (s['name'],len(s['subs'])) for s in L['steps']])
