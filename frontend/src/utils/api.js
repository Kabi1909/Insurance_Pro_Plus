import { showToast } from './toast.js';
export async function api(path, options = {}) {
  const response = await fetch('/api' + path, {
    credentials: 'same-origin', ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || 'The request failed. Please try again.'), { status: response.status });
  return data;
}

export async function download(path) {
  try {
    const response=await fetch('/api'+path,{credentials:'same-origin'});
    if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'Download failed.');}
    const url=URL.createObjectURL(await response.blob());const link=document.createElement('a');
    link.href=url;link.download=response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1]||'download';
    document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }catch(error){showToast(error.message,'error');}
}

export function payHereRedirect(checkout) {
  if (checkout.action !== 'https://sandbox.payhere.lk/pay/checkout') throw new Error('Unexpected payment destination.');
  const form = document.createElement('form');
  form.method = 'POST'; form.action = checkout.action;
  for (const [name, value] of Object.entries(checkout.fields)) {
    const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; form.appendChild(input);
  }
  document.body.appendChild(form); form.submit();
}

export async function uploadFile(file, related) {
  if (file.size > 5 * 1024 * 1024) throw new Error('Maximum file size is 5 MB.');
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(new Error('Unable to read file.')); reader.readAsDataURL(file);
  });
  return api('/documents', { method: 'POST', body: { name: file.name, base64, related } });
}

export const money = value => '$' + Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
