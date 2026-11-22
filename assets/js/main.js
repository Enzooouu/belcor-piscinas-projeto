/* Belcor Piscinas — interações do protótipo (sem dependências) */
(() => {
  'use strict';

  const WA_NUMBER = '5515988240116'; // (15) 98824-0116
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- Topo: entrada do título ---------- */
  const ready = () => requestAnimationFrame(() => document.body.classList.add('is-ready'));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 700))]).then(ready);
  } else {
    ready();
  }

  // Ondulação das letras: pausa quando o topo sai da tela (economiza bateria no celular)
  const rippleSvg = $('#ripple') && $('#ripple').ownerSVGElement;
  const hero = $('.hero');
  if (rippleSvg && rippleSvg.pauseAnimations) {
    if (reduceMotion) rippleSvg.pauseAnimations();
    else if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(([e]) => {
        e.isIntersecting ? rippleSvg.unpauseAnimations() : rippleSvg.pauseAnimations();
      }).observe(hero);
    }
  }

  // ondulação das letras só depois que a página terminou de carregar (não atrasa a primeira pintura)
  const startRipple = () => setTimeout(() => document.documentElement.classList.add('ripple-on'), 400);
  if (!reduceMotion) { if (document.readyState === 'complete') startRipple(); else window.addEventListener('load', startRipple, { once: true }); }

  // animações contínuas (reflexo da água, fileira de avaliações) só rodam quando estão na tela
  if ('IntersectionObserver' in window) {
    const liveIO = new IntersectionObserver((entries) => entries.forEach(e => e.target.classList.toggle('is-live', e.isIntersecting)), { rootMargin: '100px' });
    $$('.obra, .reviews').forEach(el => liveIO.observe(el));
  } else {
    $$('.obra, .reviews').forEach(el => el.classList.add('is-live'));
  }

  /* ---------- Entradas das seções ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // escalona as partes de cada seção
    $$('section, footer').forEach(sec => $$('[data-reveal]', sec).forEach((el, i) => el.style.setProperty('--i', i)));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Antes e depois ---------- */
  $$('[data-compare]').forEach(stage => {
    const handle = $('.compare-handle', stage);
    let pos = 50;
    const set = (p) => {
      pos = Math.max(0, Math.min(100, p));
      stage.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', Math.round(pos));
      handle.setAttribute('aria-valuetext', Math.round(pos) + '% antes');
    };
    const fromEvent = (e) => {
      const r = stage.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    let dragging = false;
    let startX = 0, startY = 0, decided = false;
    stage.addEventListener('pointerdown', (e) => {
      dragging = true; decided = e.pointerType === 'mouse'; startX = e.clientX; startY = e.clientY;
      if (decided) { stage.setPointerCapture(e.pointerId); stage.classList.add('is-dragging'); fromEvent(e); }
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      if (!decided) {
        // no toque: só arrasta se o movimento for mais horizontal que vertical (deixa a página rolar)
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true; stage.setPointerCapture(e.pointerId); stage.classList.add('is-dragging');
      }
      fromEvent(e);
    });
    const end = (e) => {
      if (dragging && !decided && e.type === 'pointerup') fromEvent(e); // toque simples: pula para o ponto
      dragging = false; stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { set(pos - step); e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { set(pos + step); e.preventDefault(); }
      else if (e.key === 'Home') { set(0); e.preventDefault(); }
      else if (e.key === 'End') { set(100); e.preventDefault(); }
    });
  });

  /* ---------- Simulador de orçamento ---------- */
  const form = $('[data-quote]');
  const preview = $('[data-preview]');
  const sendBtn = $('[data-send]');

  // medidas digitadas: aceita "6", "6,5", "6.5", "6m"
  const num = (v) => { const n = parseFloat(String(v || '').replace(',', '.').replace(/[^\d.]/g, '')); return n > 0 && n < 100 ? n : null; };
  const fmt = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const dims = () => {
    if (!form) return {};
    const c = num(form.comp && form.comp.value), l = num(form.larg && form.larg.value), p = num(form.prof && form.prof.value);
    if (!c && !l && !p) return {};
    const parts = [c ? `${fmt(c)} m de comprimento` : null, l ? `${fmt(l)} m de largura` : null, p ? `${fmt(p)} m de profundidade` : null].filter(Boolean);
    const vol = c && l && p ? c * l * p : null;
    return { text: parts.join(', ') + (vol ? ` (≈ ${fmt(Math.round(vol * 10) / 10)} m³ de água)` : ''), vol };
  };

  const buildMessage = () => {
    if (!form) return '';
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || '').toString().trim();
    const lines = ['Olá, Belcor! Vim pelo site e gostaria de um orçamento.', ''];
    lines.push(`*Serviço:* ${get('servico')}`);
    const d = dims();
    if (d.text) lines.push(`*Medidas:* ${d.text}`);
    else if (get('tamanho')) lines.push(`*Tamanho aproximado:* ${get('tamanho')}`);
    if (get('estampa')) lines.push(`*Estampa do vinil:* ${get('estampa')}`);
    if (get('nome')) lines.push(`*Nome:* ${get('nome')}`);
    if (get('local')) lines.push(`*Bairro/cidade:* ${get('local')}`);
    if (get('obs')) lines.push('', `*Mais detalhes:* ${get('obs')}`);
    return lines.join('\n');
  };

  const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const updateQuote = () => {
    const msg = buildMessage();
    if (preview) preview.innerHTML = escapeHtml(msg).replace(/\*(.+?)\*/g, '<b>$1</b>');
    if (sendBtn) sendBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    const fb = $('[data-fallback-text]'); if (fb) fb.value = msg;
    const volEl = $('[data-volume]');
    if (volEl) {
      const d = dims();
      volEl.hidden = !d.vol;
      if (d.vol) volEl.textContent = `≈ ${fmt(Math.round(d.vol * 10) / 10)} m³ de água, ou ${fmt(Math.round(d.vol * 1000))} litros`;
    }
  };
  if (form) {
    form.addEventListener('input', updateQuote);
    form.addEventListener('change', updateQuote);
    form.addEventListener('submit', (e) => { e.preventDefault(); sendBtn && sendBtn.click(); });
    updateQuote();
  }

  const selectRadio = (name, value) => {
    const input = form && $$(`input[name="${name}"]`, form).find(i => i.value === value);
    if (input) { input.checked = true; updateQuote(); }
  };

  // Atalhos dos cartões de serviço: já marcam o serviço no simulador
  $$('[data-service]').forEach(a => a.addEventListener('click', () => selectRadio('servico', a.dataset.service)));

  /* ---------- Estampas: a obra pronta com a estampa escolhida ---------- */
  const obra = $('[data-obra]');
  const poolFills = $$('[data-pool-fill]');
  const poolName = $('[data-pool-name]');
  const poolDesc = $('[data-pool-desc]');
  const obraPhoto = $('[data-obra-photo]');
  const obraCaption = $('[data-obra-caption]');
  let swapTimer, settleTimer;
  $$('input[name="estampa-galeria"]').forEach(input => {
    input.addEventListener('change', () => {
      if (!input.checked || !obra) return;
      const apply = () => {
        poolFills.forEach(r => r.setAttribute('fill', `url(#${input.dataset.pattern})`));
        poolName.textContent = input.value;
        poolDesc.textContent = input.dataset.desc;
        if (obraCaption) obraCaption.textContent = `Piscina pronta revestida com a estampa ${input.value}`;
        // foto real de obra, quando existir (data-obra na amostra)
        if (obraPhoto) {
          if (input.dataset.obra) { obraPhoto.src = input.dataset.obra; obraPhoto.alt = `Obra da Belcor com a estampa ${input.value}`; obraPhoto.hidden = false; }
          else obraPhoto.hidden = true;
        }
      };
      clearTimeout(swapTimer); clearTimeout(settleTimer);
      if (reduceMotion) { apply(); return; }
      // a água baixa, o revestimento troca e a piscina enche de novo
      obra.classList.add('is-changing');
      swapTimer = setTimeout(apply, 380);
      settleTimer = setTimeout(() => obra.classList.remove('is-changing'), 520);
    });
  });
  const usePrint = $('[data-use-print]');
  if (usePrint) usePrint.addEventListener('click', () => {
    const chosen = $('input[name="estampa-galeria"]:checked');
    if (chosen) selectRadio('estampa', chosen.value);
    // quem escolhe estampa normalmente quer vinil novo
    const svc = form && $('input[name="servico"]:checked', form);
    if (svc && (svc.value === 'Construção de piscina' || svc.value === 'Ainda não sei')) selectRadio('servico', 'Troca de vinil');
  });

  /* ---------- Como funciona: sanfona (abre ao passar o mouse no computador) ---------- */
  const steps = $('[data-steps]');
  if (steps) {
    const items = $$('.step', steps);
    const wide = window.matchMedia('(min-width: 900px)');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const open = (item, force) => {
      const willOpen = force !== undefined ? force : !item.classList.contains('is-open');
      if (wide.matches && !willOpen) return; // no computador sempre há um painel aberto
      items.forEach(other => {
        const isIt = other === item ? willOpen : false;
        other.classList.toggle('is-open', isIt);
        $('.step-head button', other).setAttribute('aria-expanded', String(isIt));
      });
    };
    let hoverTimer;
    items.forEach(item => {
      const btn = $('.step-head button', item);
      btn.addEventListener('click', () => open(item));
      btn.addEventListener('focus', () => { if (wide.matches) open(item, true); });
      item.addEventListener('mouseenter', () => {
        if (!wide.matches || !canHover.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => open(item, true), 90); // evita abrir ao só passar por cima
      });
      item.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
    });
  }

  /* ---------- Perguntas frequentes: abre uma de cada vez ---------- */
  const faqs = $$('[data-faq]');
  faqs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ---------- WhatsApp fixo: some enquanto o botão do topo está visível ---------- */
  const waFloat = $('.wa-float');
  const heroCta = $('.hero-actions');
  if (waFloat && heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => waFloat.classList.toggle('is-hidden', e.isIntersecting), { threshold: 0.2 }).observe(heroCta);
  }

  /* ---------- Cabeçalho fixo e menu do celular ---------- */
  const header = $('[data-header]');
  const menuBtn = $('[data-menu-btn]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (header && menuBtn) {
    const setMenu = (on) => {
      header.classList.toggle('is-open', on);
      menuBtn.setAttribute('aria-expanded', String(on));
      $('.sr-only', menuBtn).textContent = on ? 'Fechar menu' : 'Abrir menu';
    };
    menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
    $$('[data-menu] a, .nav-cta, .wordmark', header).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    document.addEventListener('click', (e) => { if (!header.contains(e.target)) setMenu(false); });
  }

  /* ---------- Estampas: girar a câmera da piscina 3D ---------- */
  if (obra) {
    const reset = $('[data-obra-reset]');
    const TILT0 = 52, YAW0 = 0;
    let tilt = TILT0, yaw = YAW0, drag = null;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const apply = () => {
      obra.style.setProperty('--tilt', tilt + 'deg');
      obra.style.setProperty('--yaw', yaw + 'deg');
      const moved = Math.abs(tilt - TILT0) > 1 || Math.abs(yaw % 360) > 1;
      if (reset) reset.hidden = !moved;
    };
    obra.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      drag = { x: e.clientX, y: e.clientY, tilt, yaw, decided: e.pointerType === 'mouse', id: e.pointerId };
      if (drag.decided) { obra.setPointerCapture(e.pointerId); obra.classList.add('is-dragging'); }
    });
    obra.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.decided) {
        // no toque: só gira se o gesto for de lado; para cima e para baixo a página rola normalmente
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
        drag.decided = true; obra.setPointerCapture(e.pointerId); obra.classList.add('is-dragging');
      }
      yaw = drag.yaw + dx * 0.35; // gira sem limite, para os dois lados
      if (e.pointerType === 'mouse') tilt = clamp(drag.tilt - dy * 0.25, 28, 70);
      obra.classList.add('has-moved');
      apply();
    });
    const end = () => { drag = null; obra.classList.remove('is-dragging'); };
    obra.addEventListener('pointerup', end);
    obra.addEventListener('pointercancel', end);
    // teclado: setas giram quando a piscina está em foco
    obra.tabIndex = 0;
    obra.setAttribute('aria-label', 'Piscina em 3D. Use as setas para girar.');
    obra.addEventListener('keydown', (e) => {
      const k = { ArrowLeft: [0, -10], ArrowRight: [0, 10], ArrowUp: [4, 0], ArrowDown: [-4, 0] }[e.key];
      if (!k) return;
      e.preventDefault(); tilt = clamp(tilt + k[0], 28, 70); yaw = yaw + k[1];
      obra.classList.add('has-moved'); apply();
    });
    // volta pelo caminho mais curto, sem dar várias voltas
    if (reset) reset.addEventListener('click', () => { tilt = TILT0; yaw = Math.round(yaw / 360) * 360; apply(); setTimeout(() => { yaw = YAW0; obra.classList.add('is-dragging'); apply(); requestAnimationFrame(() => obra.classList.remove('is-dragging')); }, 950); });
  }

  /* ---------- Fotos: clique para ampliar, com opção de zoom ---------- */
  const lb = $('[data-lightbox]');
  if (lb && typeof lb.showModal === 'function') {
    const lbImg = $('[data-lb-img]', lb);
    const lbCap = $('[data-lb-caption]', lb);
    const zoomBtn = $('[data-lb-zoom]', lb);
    const zoomLabel = $('[data-lb-zoom-label]', lb);
    let opener = null;
    const setZoom = (on, e) => {
      lb.classList.toggle('is-zoomed', on);
      zoomBtn.setAttribute('aria-pressed', String(on));
      zoomLabel.textContent = on ? 'Tirar zoom' : 'Dar zoom';
      if (on && e) aim(e); else if (!on) { lbImg.style.setProperty('--ox', '50%'); lbImg.style.setProperty('--oy', '50%'); }
    };
    // o ponto de zoom acompanha o mouse ou o dedo
    const aim = (e) => {
      const r = lbImg.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
      lbImg.style.setProperty('--ox', x + '%'); lbImg.style.setProperty('--oy', y + '%');
    };
    const open = (img) => {
      opener = img;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      setZoom(false);
      lb.showModal();
    };
    $$('.service-media img, .step-body img, .t-photo img').forEach(img => {
      img.setAttribute('data-zoomable', '');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ampliar foto: ${img.alt}`);
      img.addEventListener('click', () => open(img));
      img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
    });
    let downAt = null;
    lbImg.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; if (lb.classList.contains('is-zoomed')) lb.classList.add('is-panning'); });
    lbImg.addEventListener('pointermove', (e) => { if (lb.classList.contains('is-zoomed') && (e.pointerType === 'mouse' || downAt)) aim(e); });
    lbImg.addEventListener('pointerup', (e) => {
      lb.classList.remove('is-panning');
      const moved = downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8;
      downAt = null;
      if (!moved) setZoom(!lb.classList.contains('is-zoomed'), e); // toque ou clique simples liga/desliga o zoom
    });
    zoomBtn.addEventListener('click', () => setZoom(!lb.classList.contains('is-zoomed')));
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    // clicar fora da foto fecha
    $('[data-lb-stage]', lb).addEventListener('click', (e) => { if (e.target === e.currentTarget) lb.close(); });
    lb.addEventListener('close', () => { setZoom(false); if (opener) opener.focus(); });
  }

  /* ---------- Aberto agora? (horário de Sorocaba) ---------- */
  const status = $('[data-open-status]');
  if (status) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const get = (t) => (parts.find(p => p.type === t) || {}).value;
    const day = get('weekday'); const mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    const close = { Mon: 17, Tue: 17, Wed: 17, Thu: 17, Fri: 17, Sat: 12 }[day];
    const open = close && mins >= 8 * 60 && mins < close * 60;
    $('[data-open-text]', status).textContent = open ? `Aberto agora, até ${close}h` : 'Fechado agora. Deixe sua mensagem no WhatsApp';
    status.classList.toggle('is-closed', !open);
    status.hidden = false;
  }

  /* ---------- Ano no rodapé ---------- */
  const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
