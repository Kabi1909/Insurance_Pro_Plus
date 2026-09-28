// Small dependency-free text PDF for policy schedules, receipts and reports.
export function pdf(lines) {
  const pages=[];
  for(let i=0;i<lines.length;i+=48) pages.push(lines.slice(i,i+48));
  if(!pages.length) pages.push(['No records.']);
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  const kids=[];
  for(const page of pages) {
    const pageId=objects.length+1; kids.push(`${pageId} 0 R`);
    const content='BT /F1 10 Tf 40 800 Td 15 TL '+page.map(line=>'('+String(line).replace(/[^\x20-\x7e]/g,' ').replace(/[\\()]/g,'\\$&').slice(0,110)+') Tj T*').join('\n')+' ET';
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageId+1} 0 R >>`, `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
  }
  objects[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
  let result='%PDF-1.4\n'; const offsets=[0];
  objects.forEach((obj,index)=>{offsets.push(Buffer.byteLength(result));result+=`${index+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=Buffer.byteLength(result);
  result+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('');
  return Buffer.from(result+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
}
