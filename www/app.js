(() => {
  'use strict';

  const STORAGE_KEY = 'kbm-lw-agenda-v1';
  const services = [
    { icon: '⌂', name: 'Onderhoud', description: 'Periodiek onderhoud en kleine herstelwerkzaamheden, zorgvuldig ingepland.', price: 'Vanaf € 65' },
    { icon: '✳', name: 'Reparatie', description: 'Vakkundige reparaties en praktische oplossingen in en om het huis.', price: 'Prijs op aanvraag' },
    { icon: '⌂', name: 'Renovatie', description: 'Renovatie en verbouwing op maat, van eerste plan tot nette afwerking.', price: 'Prijs op aanvraag' },
    { icon: '✎', name: 'Schilderwerk', description: 'Netjes voorbereid schilderwerk voor een duurzaam en strak resultaat.', price: 'Prijs op aanvraag' },
    { icon: '▦', name: 'Verbouwen', description: 'Ruimtes aanpassen aan nieuwe wensen met oog voor het bestaande pand.', price: 'Prijs op aanvraag' },
    { icon: '⌁', name: 'Vastgoedonderhoud', description: 'Totaalonderhoud voor woningen en vastgoed, afgestemd op jouw planning.', price: 'Prijs op aanvraag' }
  ];
  const labels = { home: 'Overzicht', agenda: 'Agenda', diensten: 'Diensten', ervaringen: 'Ervaringen', contact: 'Contact' };
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const parseDay = (value) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const longDate = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
  const monthDate = new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' });
  const fullDay = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
  const now = new Date();
  let appointments = loadAppointments();
  let selectedDay = dayKey(now);
  let calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let toastTimer;

  function loadAppointments() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter(isAppointment).sort(sortAppointments) : [];
    } catch {
      return [];
    }
  }

  function isAppointment(item) {
    return item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.customer === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && /^\d{2}:\d{2}$/.test(item.start) && /^\d{2}:\d{2}$/.test(item.end);
  }

  function sortAppointments(a, b) {
    return `${a.date}T${a.start}`.localeCompare(`${b.date}T${b.start}`);
  }

  function saveAppointments() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      return true;
    } catch {
      showToast('Opslaan is niet gelukt. Maak ruimte op dit apparaat.');
      return false;
    }
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function setPage(page) {
    if (!labels[page]) page = 'home';
    $$('.page').forEach((section) => section.classList.toggle('active', section.id === `page-${page}`));
    $$('.nav-link').forEach((button) => {
      const active = button.dataset.page === page;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    $('#crumb').textContent = labels[page];
    history.replaceState(null, '', `#${page}`);
    if (page === 'agenda') renderCalendar();
    if (page === 'home') renderHome();
    $('#sidebar').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function appointmentRows(items, includeDate = false) {
    return items.map((item) => {
      const date = parseDay(item.date);
      const status = ['Nieuw', 'In uitvoering', 'Afgerond'].includes(item.status) ? item.status : 'Nieuw';
      return `<article class="appointment-row" data-id="${esc(item.id)}">
        <div class="appointment-date">${includeDate ? `${esc(shortDate.format(date).split(' ')[0])}<strong>${date.getDate()}</strong>` : `<strong>${esc(item.start)}</strong>`}</div>
        <span class="appointment-marker"></span>
        <div class="appointment-info"><strong>${esc(item.title)}</strong><small>${esc(item.customer)}${item.phone ? ` · ${esc(item.phone)}` : ''}${item.notes ? ` · ${esc(item.notes)}` : ''}</small></div>
        <span class="appointment-status" data-status="${esc(status)}">${esc(status)}</span>
        <div class="row-actions"><button class="row-action" data-action="status" aria-label="Status wijzigen">${status === 'Afgerond' ? 'Heropenen' : 'Status wijzigen'}</button><button class="row-action" data-action="delete" aria-label="Afspraak verwijderen">Verwijder</button></div>
      </article>`;
    }).join('');
  }

  function renderHome() {
    const today = new Date();
    $('#welcomeDate').textContent = longDate.format(today).replace(',', '').toLocaleUpperCase('nl-NL');
    $('#todayPill').textContent = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).format(today);
    const monthItems = appointments.filter((item) => {
      const date = parseDay(item.date);
      return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
    });
    $('#monthCount').textContent = String(monthItems.length).padStart(2, '0');
    $('#openCount').textContent = String(appointments.filter((item) => item.status !== 'Afgerond').length).padStart(2, '0');
    $('#navCount').textContent = appointments.length;
    const upcoming = appointments.filter((item) => item.date >= dayKey(today) && item.status !== 'Afgerond').slice(0, 4);
    $('#nextDate').textContent = upcoming.length ? shortDate.format(parseDay(upcoming[0].date)).replace('.', '') : '—';
    $('#nextTitle').textContent = upcoming.length ? upcoming[0].title : 'Nog niets ingepland';
    $('#upcomingList').innerHTML = appointmentRows(upcoming, true);
    $('#homeEmpty').hidden = upcoming.length > 0;
    $('#upcomingList').hidden = upcoming.length === 0;
  }

  function renderCalendar() {
    $('#calendarMonth').textContent = monthDate.format(calendarMonth);
    $('#selectedDayTitle').textContent = fullDay.format(parseDay(selectedDay));
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(first.getFullYear(), first.getMonth(), first.getDate() - mondayOffset);
    const weekdayLabels = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
    let html = weekdayLabels.map((label) => `<div class="calendar-weekday">${label}</div>`).join('');
    for (let i = 0; i < 42; i++) {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const key = dayKey(day);
      const count = appointments.filter((item) => item.date === key).length;
      const classes = ['calendar-day', day.getMonth() !== calendarMonth.getMonth() ? 'outside' : '', key === dayKey(now) ? 'today' : '', key === selectedDay ? 'selected' : ''].filter(Boolean).join(' ');
      html += `<button class="${classes}" data-day="${key}" aria-label="${esc(fullDay.format(day))}${count ? `, ${count} afspraken` : ''}" aria-pressed="${key === selectedDay}">${day.getDate()}${count ? '<span class="day-dot"></span>' : ''}</button>`;
    }
    $('#calendarGrid').innerHTML = html;
    const forDay = appointments.filter((item) => item.date === selectedDay);
    $('#dayList').innerHTML = appointmentRows(forDay);
    $('#dayList').hidden = !forDay.length;
    $('#dayEmpty').hidden = !!forDay.length;
  }

  function renderServices() {
    $('#serviceGrid').innerHTML = services.map((service) => `<article class="service-card"><span class="service-icon" aria-hidden="true">${service.icon}</span><h2>${esc(service.name)}</h2><p>${esc(service.description)}</p><p class="service-price">${esc(service.price)}</p><button data-service="${esc(service.name)}">Plan deze klus <svg><use href="#i-arrow"/></svg></button></article>`).join('');
  }

  function openAppointment(title = '') {
    const dialog = $('#appointmentDialog');
    const form = $('#appointmentForm');
    form.reset();
    form.elements.date.value = selectedDay >= dayKey(now) ? selectedDay : dayKey(now);
    form.elements.start.value = '09:00';
    form.elements.end.value = '11:00';
    form.elements.title.value = title;
    $('#appointmentFeedback').textContent = '';
    dialog.showModal();
    if (title) form.elements.customer.focus();
    else form.elements.title.focus();
  }

  function handleAppointmentSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const date = data.get('date');
    const start = data.get('start');
    const end = data.get('end');
    if (end <= start) {
      $('#appointmentFeedback').textContent = 'De eindtijd moet na de starttijd liggen.';
      form.elements.end.focus();
      return;
    }
    const item = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: String(data.get('title')).trim(), customer: String(data.get('customer')).trim(),
      phone: String(data.get('phone')).trim(), date, start, end,
      notes: String(data.get('notes')).trim(), status: 'Nieuw', createdAt: new Date().toISOString()
    };
    appointments.push(item);
    appointments.sort(sortAppointments);
    if (saveAppointments()) {
      selectedDay = date;
      calendarMonth = new Date(parseDay(date).getFullYear(), parseDay(date).getMonth(), 1);
      $('#appointmentDialog').close();
      renderAll();
      showToast('Afspraak staat in je agenda.');
    }
  }

  function handleRowAction(event) {
    const button = event.target.closest('[data-action]');
    const row = event.target.closest('[data-id]');
    if (!button || !row) return;
    const index = appointments.findIndex((item) => item.id === row.dataset.id);
    if (index < 0) return;
    if (button.dataset.action === 'delete') {
      const item = appointments[index];
      if (!window.confirm(`Afspraak “${item.title}” verwijderen?`)) return;
      appointments.splice(index, 1);
      saveAppointments();
      renderAll();
      showToast('Afspraak verwijderd.');
      return;
    }
    const statuses = ['Nieuw', 'In uitvoering', 'Afgerond'];
    const current = statuses.indexOf(appointments[index].status);
    appointments[index].status = statuses[(current + 1) % statuses.length];
    saveAppointments();
    renderAll();
    showToast(`Status: ${appointments[index].status.toLowerCase()}.`);
  }

  function downloadBackup() {
    const file = new Blob([JSON.stringify({ app: 'KBM & LW Agenda', version: 1, exportedAt: new Date().toISOString(), appointments }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `kbm-lw-agenda-${dayKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Back-up gedownload. Bewaar dit bestand zelf.');
  }

  async function importBackup(file) {
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const items = Array.isArray(payload) ? payload : payload.appointments;
      if (!Array.isArray(items) || !items.every(isAppointment)) throw new Error('invalid');
      if (!window.confirm(`De back-up bevat ${items.length} afspraken. De huidige agenda wordt hiermee vervangen. Doorgaan?`)) return;
      appointments = items.map((item) => ({ ...item })).sort(sortAppointments);
      saveAppointments();
      selectedDay = dayKey(new Date());
      renderAll();
      showToast('Back-up teruggezet op dit apparaat.');
    } catch {
      showToast('Dit back-upbestand kan niet worden ingelezen.');
    } finally {
      $('#importFile').value = '';
    }
  }

  function handleContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = `Van: ${String(data.get('name')).trim()}\nOnderwerp: ${String(data.get('subject')).trim()}\n\n${String(data.get('message')).trim()}`;
    const feedback = $('#contactFeedback');
    const copy = navigator.clipboard?.writeText(message);
    if (copy) {
      copy.then(() => { feedback.textContent = 'Bericht gekopieerd. Plak het in je eigen e-mail of berichtenapp.'; }, () => { feedback.textContent = message; });
    } else {
      feedback.textContent = message;
    }
  }

  function renderAll() {
    renderHome();
    renderCalendar();
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const nav = event.target.closest('[data-page]');
      if (nav) return setPage(nav.dataset.page);
      const goto = event.target.closest('[data-goto]');
      if (goto) return setPage(goto.dataset.goto);
      if (event.target.closest('[data-new-appointment]')) return openAppointment();
      if (event.target.closest('[data-close-dialog]')) return $('#appointmentDialog').close();
      const day = event.target.closest('[data-day]');
      if (day) { selectedDay = day.dataset.day; calendarMonth = new Date(parseDay(selectedDay).getFullYear(), parseDay(selectedDay).getMonth(), 1); return renderCalendar(); }
      const service = event.target.closest('[data-service]');
      if (service) return openAppointment(service.dataset.service);
      if (event.target.closest('[data-action]')) return handleRowAction(event);
      if (event.target.closest('#prevMonth')) { calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1); return renderCalendar(); }
      if (event.target.closest('#nextMonth')) { calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1); return renderCalendar(); }
      if (event.target.closest('#todayButton')) { selectedDay = dayKey(new Date()); calendarMonth = new Date(); return renderCalendar(); }
      if (event.target.closest('.backup-download')) return downloadBackup();
      if (event.target.closest('.backup-restore')) return $('#importFile').click();
      if (event.target.closest('#menuButton')) return $('#sidebar').classList.toggle('open');
    });
    $('#appointmentForm').addEventListener('submit', handleAppointmentSubmit);
    $('#contactForm').addEventListener('submit', handleContact);
    $('#importFile').addEventListener('change', (event) => importBackup(event.target.files[0]));
    window.addEventListener('hashchange', () => setPage(location.hash.slice(1)));
  }

  function init() {
    $('#todayPill').textContent = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).format(now);
    renderServices();
    renderAll();
    bindEvents();
    const initialPage = location.hash.slice(1);
    if (initialPage && labels[initialPage]) setPage(initialPage);
    if ('serviceWorker' in navigator && !window.Capacitor?.isNativePlatform?.() && /^https?:$/.test(location.protocol)) {
      window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}), { once: true });
    }
  }

  init();
})();
