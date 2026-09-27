export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-orange-500' : 'bg-blue-600';
  
  const icon = type === 'success' 
    ? `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
    : `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

  toast.className = `fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg z-[200] flex items-center font-medium transition-all duration-300 transform translate-y-[-100%] opacity-0 ${bg}`;
  // Only the static icon is markup; messages may include user-entered text.
  toast.innerHTML = icon;
  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-[-100%]', 'opacity-0');
  }, 10);

  // Animate out
  setTimeout(() => {
    toast.classList.add('translate-y-[-100%]', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
