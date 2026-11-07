/** Studio signature stamped in ink on exported artwork. Change SIGNATURE_TEXT to use a personal or studio name. */
export const SIGNATURE_TEXT='Khatti · QariAI';
export function stampSignature(x,w,h,ink='#125454'){
  x.save();x.globalAlpha=.62;x.fillStyle=ink;x.textAlign='right';x.textBaseline='alphabetic';x.direction='ltr';
  x.font=Math.max(14,Math.round(w*.022))+'px HarfNaskh, serif';x.fillText(SIGNATURE_TEXT,w-w*.045,h-w*.04);x.restore();
}
export function signatureSvg(w,h,ink='#125454'){
  return '<text x="'+Math.round(w-w*.045)+'" y="'+Math.round(h-w*.04)+'" text-anchor="end" font-size="'+Math.round(w*.022)+'" fill="'+ink+'" fill-opacity=".62" style="font-family:HarfNaskh,serif">'+SIGNATURE_TEXT+'</text>';
}
