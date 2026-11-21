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

  const buildMessage = () => {
    if (!form) return '';
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || '').toString().trim();
    const lines = ['Olá, Belcor! Vim pelo site e gostaria de um orçamento.', ''];
    lines.push(`*Serviço:* ${get('servico')}`);
    let tamanho = get('tamanho');
    if (get('medidas')) tamanho = tamanho ? `${tamanho}. Medidas: ${get('medidas')}` : `Medidas: ${get('medidas')}`;
    if (tamanho) lines.push(`*Tamanho aproximado:* ${tamanho}`);
    if (get('estampa')) lines.push(`*Estampa do vinil:* ${get('estampa')}`);
    if (get('nome')) lines.push(`*Nome:* ${get('nome')}`);
    if (get('local')) lines.push(`*Bairro/cidade:* ${get('local')}`);
    return lines.join('\n');
  };

  const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const updateQuote = () => {
    const msg = buildMessage();
    if (preview) preview.innerHTML = escapeHtml(msg).replace(/\*(.+?)\*/g, '<b>$1</b>');
    if (sendBtn) sendBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    const fb = $('[data-fallback-text]'); if (fb) fb.value = msg;
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

  /* ---------- Ano no rodapé ---------- */
  const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
