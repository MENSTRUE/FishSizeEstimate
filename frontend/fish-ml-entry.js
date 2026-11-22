// Add an entry for the independent ML workspace without editing React source.
(() => {
  if (location.pathname.toLowerCase().includes('fish-ml')) return;
  let tries = 0;
  const inject = () => {
    if (document.getElementById('fish-ml-open')) return;
    const candidates = Array.from(document.querySelectorAll('aside, nav, [class*="sidebar"], [class*="Sidebar"]'));
    const target = candidates.find(node => node.textContent?.includes('Image workspace'));
    if (target) {
      const a = document.createElement('a');
      a.id = 'fish-ml-open';
      a.href = '/fish-ml.html';
      a.textContent = '🐟 Fish ML · YOLO V11';
      a.style.cssText = 'display:block;margin:12px 14px;padding:12px 14px;border-radius:10px;background:#123553;color:#a9dbff;text-decoration:none;font:600 13px system-ui;border:1px solid #2b5776';
      target.append(a);
    } else if (++tries < 25) {
      setTimeout(inject, 400);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
