(function(){
'use strict';

/* ============ Иконки ============ */
const P = {
  chat:'<path d="M21 12a8 8 0 01-8 8H8l-5 3V12a8 8 0 018-8h2a8 8 0 018 8z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  back:'<path d="M15 18l-6-6 6-6"/>',
  chevron:'<path d="M6 9l6 6 6-6"/>',
  export:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  import:'<path d="M12 16V4M7 9l5-5 5 5M5 21h14"/>',
  reset:'<path d="M3 12a9 9 0 1015-6.7L21 8M21 3v5h-5"/>',
  reply:'<path d="M9 17l-5-5 5-5M4 12h10a6 6 0 016 6"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  code:'<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  design:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18"/>',
  project:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 10h4"/>',
  game:'<rect x="2" y="7" width="20" height="10" rx="3"/><path d="M7 12h.01M11 10v4M17 11v2M16 12h2"/>',
  science:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M8 14h8"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  check:'<path d="M5 12l5 5L19 7"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
function icon(name, size = 18){
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[name]||P.chat)+'</svg>';
}

/* ============ Утилиты ============ */
const $ = (s, r = document) => r.querySelector(s);
const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 9);
const clone = o => JSON.parse(JSON.stringify(o));
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function hash(s){ let h = 0; const str = String(s); for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }
function avatarColor(name){
  const hues = [205, 255, 275, 150, 25, 340, 95];
  const hue = hues[hash(name) % hues.length];
  return 'linear-gradient(135deg,hsl(' + hue + ' 78% 55%),hsl(' + ((hue + 42) % 360) + ' 72% 46%))';
}
function initials(name){
  const parts = String(name || '?').trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0] ? p[0].toUpperCase() : '').join('') || '?';
}
function avatar(name, cls){
  return '<div class="avatar ' + (cls || '') + '" style="background:' + avatarColor(name) + '" title="' + escapeHtml(name) + '" aria-hidden="true">' + escapeHtml(initials(name)) + '</div>';
}
function plural(n, a, b, c){
  const x = Math.abs(n) % 100, y = x % 10;
  if (x > 10 && x < 20) return n + ' ' + c;
  if (y === 1) return n + ' ' + a;
  if (y >= 2 && y <= 4) return n + ' ' + b;
  return n + ' ' + c;
}
function timeAgo(ts){
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'только что';
  const m = Math.floor(s / 60); if (m < 60) return plural(m, 'минуту', 'минуты', 'минут') + ' назад';
  const h = Math.floor(m / 60); if (h < 24) return plural(h, 'час', 'часа', 'часов') + ' назад';
  const d = Math.floor(h / 24); if (d < 30) return plural(d, 'день', 'дня', 'дней') + ' назад';
  const mo = Math.floor(d / 30); if (mo < 12) return plural(mo, 'месяц', 'месяца', 'месяцев') + ' назад';
  return plural(Math.floor(mo / 12), 'год', 'года', 'лет') + ' назад';
}
function fullDate(ts){
  try { return new Date(ts).toLocaleString('ru-RU', {day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit'}); }
  catch (e) { return ''; }
}
function stripMd(s){ return String(s || '').replace(/\*\*/g, '').replace(/`/g, '').replace(/^[-\d.)\s]+/gm, '').replace(/^>\s?/gm, ''); }
function shorten(s, n){
  const t = stripMd(s);
  return t.length <= n ? t : t.slice(0, n).trim() + '…';
}
function readMinutes(text){
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
function highlight(text, q){
  const safe = escapeHtml(text);
  if (!q) return safe;
  const esc = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(esc, 'gi'), m => '<mark>' + m + '</mark>');
}

/* ============ Markdown ============ */
function inlineMd(text){
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
}
function formatContent(src){
  const lines = String(src || '').split(/\r?\n/);
  let html = '', list = null;
  const closeList = () => { if (list) { html += '</' + list + '>'; list = null; } };

  for (const line of lines) {
    const t = line.trim();
    if (!t) { closeList(); continue; }
    if (/^###\s+/.test(t)) { closeList(); html += '<h5>' + inlineMd(t.replace(/^###\s+/, '')) + '</h5>'; continue; }
    if (/^##\s+/.test(t))  { closeList(); html += '<h4>' + inlineMd(t.replace(/^##\s+/, '')) + '</h4>'; continue; }
    if (t.startsWith('> ')) { closeList(); html += '<blockquote>' + inlineMd(t.slice(2)) + '</blockquote>'; continue; }
    if (t.startsWith('- ') || t.startsWith('• ')) {
      if (list !== 'ul') { closeList(); html += '<ul>'; list = 'ul'; }
      html += '<li>' + inlineMd(t.slice(2)) + '</li>';
      continue;
    }
    const ol = t.match(/^(\d+)[.)]\s+(.*)$/);
    if (ol) {
      if (list !== 'ol') { closeList(); html += '<ol>'; list = 'ol'; }
      html += '<li>' + inlineMd(ol[2]) + '</li>';
      continue;
    }
    closeList();
    html += '<p>' + inlineMd(t) + '</p>';
  }
  closeList();
  return html || '<p>Пусто.</p>';
}

/* ============ Данные ============ */
const STORAGE_KEY = 'mini_forum_v1';
const THEME_KEY   = 'forumreader_theme';
const AUTHOR_KEY  = 'forumreader_author';
const SEED_KEY    = 'forumreader_seed_v6';

/* ============ Данные: 250 статей, сгруппированных по каналам ============ */
const CATEGORIES = [
  {
    "id": "cat-1",
    "name": "Разработка",
    "icon": "code",
    "channels": [
      [
        "ch-1",
        "Web-разработка"
      ],
      [
        "ch-2",
        "Мобильная разработка"
      ]
    ]
  },
  {
    "id": "cat-2",
    "name": "Дизайн",
    "icon": "design",
    "channels": [
      [
        "ch-3",
        "UI/UX"
      ],
      [
        "ch-4",
        "Портфолио"
      ]
    ]
  },
  {
    "id": "cat-3",
    "name": "Проекты",
    "icon": "project",
    "channels": [
      [
        "ch-5",
        "Open Source"
      ]
    ]
  },
  {
    "id": "cat-4",
    "name": "Обсуждения",
    "icon": "chat",
    "channels": [
      [
        "ch-6",
        "Общие темы"
      ],
      [
        "ch-7",
        "Хобби"
      ]
    ]
  },
  {
    "id": "cat-5",
    "name": "Игры",
    "icon": "game",
    "channels": [
      [
        "ch-8",
        "PC"
      ],
      [
        "ch-9",
        "Консоли"
      ]
    ]
  },
  {
    "id": "cat-6",
    "name": "Наука",
    "icon": "science",
    "channels": [
      [
        "ch-10",
        "Физика"
      ],
      [
        "ch-11",
        "Математика"
      ]
    ]
  },
  {
    "id": "cat-7",
    "name": "Музыка",
    "icon": "music",
    "channels": [
      [
        "ch-12",
        "Релизы"
      ],
      [
        "ch-13",
        "Обсуждение"
      ]
    ]
  },
  {
    "id": "cat-8",
    "name": "Работа",
    "icon": "brief",
    "channels": [
      [
        "ch-14",
        "Вакансии"
      ],
      [
        "ch-15",
        "Фриланс"
      ]
    ]
  }
];

const sampleData = {
  title: 'Reader',
  categories: CATEGORIES.map(c => ({
    id: c.id, name: c.name, icon: c.icon,
    channels: c.channels.map(ch => ({ id: ch[0], name: ch[1], threads: [] }))
  }))
};
const TOPIC_BASES = {
  "ch-1": [
    "Оптимизация загрузки сайта",
    "CSS Grid и Flexbox",
    "Ленивая загрузка изображений",
    "PWA и офлайн-режим",
    "Типы в JavaScript",
    "Кеширование статики",
    "Code-splitting",
    "Доступность интерфейса",
    "Веб-компоненты",
    "Производительность CSS",
    "Формы и валидация",
    "CDN и HTTP/3"
  ],
  "ch-2": [
    "Адаптивная вёрстка",
    "React Native или нативный код",
    "Экранное время и батарея",
    "Жесты и навигация",
    "Push-уведомления",
    "Локальная база данных",
    "Тестирование на устройствах",
    "Размер установочного файла",
    "Офлайн-режим приложения",
    "Анимации в мобильном UI",
    "Безопасность токенов",
    "Медленная сеть"
  ],
  "ch-3": [
    "Гайд по кнопкам",
    "Тёмная тема",
    "Контраст текста",
    "Типографика длинной статьи",
    "Микроанимации",
    "Формы без ошибок",
    "Пустые состояния",
    "Мобильная навигация",
    "Цветовая система",
    "Иконки и их смысл",
    "Дизайн-система",
    "Обратная связь пользователю"
  ],
  "ch-4": [
    "Что показать новичку",
    "Структура кейса",
    "Оформление проектов",
    "Сопроводительное письмо",
    "Скриншоты и демо",
    "Личный бренд",
    "Отзывы и рекомендации",
    "GitHub как витрина",
    "Ошибки в портфолио",
    "Подготовка к собеседованию",
    "Выбор формата сайта",
    "Обновление портфолио"
  ],
  "ch-5": [
    "Первый вклад в проект",
    "Чек-лист хорошего README",
    "Понятные коммиты",
    "Метки для новичков",
    "Политика пулл-реквестов",
    "Лицензия и право",
    "Документация без боли",
    "Тесты маленькой библиотеки",
    "Комьюнити и общение",
    "Ведение changelog",
    "Выбор задачи",
    "Релизы и версии"
  ],
  "ch-6": [
    "Приветствие и правила",
    "Как задать хороший вопрос",
    "Отдых за компьютером",
    "Книги недели",
    "Рабочее пространство",
    "Фокус и внимание",
    "Привычки на каждый день",
    "Планирование недели",
    "Цифровой минимализм",
    "Список полезных сервисов",
    "Вопросы новичков",
    "Подборка ссылок"
  ],
  "ch-7": [
    "Рисование с нуля",
    "Фотография на телефон",
    "Музыка без слов",
    "Прогулки и наблюдения",
    "Коллекционирование",
    "Домашние растения",
    "Готовка по выходным",
    "Настольные игры",
    "Вязание и ручное дело",
    "Кино по выходным",
    "Спорт без зала",
    "Дневник впечатлений"
  ],
  "ch-8": [
    "Настройки графики",
    "Сборка тихого ПК",
    "Инди-игры",
    "Игровая библиотека",
    "Геймпад или клавиатура",
    "Прохождение без спешки",
    "Обновление драйверов",
    "SSD и загрузка",
    "Мониторы для игр",
    "Моддинг",
    "Эмуляторы",
    "Стриминг с ПК"
  ],
  "ch-9": [
    "Какую консоль выбрать",
    "Эксклюзивы",
    "Обратная совместимость",
    "Настройки телевизора",
    "Игры для компании",
    "Подписки и сервисы",
    "Контроллеры",
    "Обновление прошивки",
    "Хранение игр",
    "Шум охлаждения",
    "Ретро-консоли",
    "Гонки на консоли"
  ],
  "ch-10": [
    "Парадокс близнецов",
    "Почему небо голубое",
    "Энтропия в быту",
    "Скорость света",
    "Гравитация и орбиты",
    "Кванты простыми словами",
    "Тепло и температура",
    "Звук и его скорость",
    "Электричество дома",
    "Оптика в жизни",
    "Маятник",
    "Изменение состояния воды"
  ],
  "ch-11": [
    "Сумма нечётных чисел",
    "Золотое сечение",
    "Вероятность в примерах",
    "Алгебра без скуки",
    "Геометрия на бумаге",
    "Логические задачи",
    "Последовательности",
    "Проценты правильно",
    "Координаты и графики",
    "Множества",
    "Доказательства",
    "Числа Фибоначчи"
  ],
  "ch-12": [
    "Альбом недели",
    "Переслушивание",
    "Новые имена",
    "Жанры и границы",
    "Влияние классики",
    "Концерты онлайн",
    "Плейлист дня",
    "Обложки альбомов",
    "Тексты и смысл",
    "Музыка в фильмах",
    "Инструментал",
    "Любимые треки"
  ],
  "ch-13": [
    "Наушники для работы",
    "Музыка для концентрации",
    "Звук и качество",
    "Настроение и жанр",
    "Слушаю ночью",
    "Музыка в дороге",
    "Плейлист для сна",
    "Любимый исполнитель",
    "Новое и старое",
    "Поиск музыки",
    "Фон для работы",
    "Обсуждение релизов"
  ],
  "ch-14": [
    "Резюме без воды",
    "Что спросить на собеседовании",
    "Первая работа",
    "Переход в другую сферу",
    "Зарплатные ожидания",
    "Испытательный срок",
    "Портфолио для вакансии",
    "Сопроводительное письмо в резюме",
    "Переговоры об оффере",
    "Работа из дома",
    "Собеседование онлайн",
    "Отказ и выводы"
  ],
  "ch-15": [
    "Как посчитать ставку",
    "Договор с клиентом",
    "Учёт часов",
    "Поиск первых заказов",
    "Портфолио фрилансера",
    "Коммуникация с заказчиком",
    "Сроки и правки",
    "Оплата и налоги",
    "Выгорание",
    "Повышение цены",
    "Повторные заказы",
    "Инструменты для работы"
  ]
};
const TOPIC_ASPECTS = ["обзор","практика","разбор ошибок","чек-лист","пример","вопросы и ответы","сравнение","мини-гайд","опыт сообщества","подводные камни","от простого к сложному","итоги"];
const INTROS = ["Тема «{topic}» регулярно появляется в разделе «{channel}». Ниже собраны наблюдения и практические шаги, которые помогают разобраться в вопросе без лишней теории.","Когда начинаешь разбираться с «{topic}», кажется, что всё уже давно известно. На практике в канале «{channel}» каждый раз всплывают новые детали, о которых молчат короткие гайды.","Раздел «{channel}» существует для обсуждения задач вроде «{topic}». Я постарался собрать рабочий подход: от постановки проблемы до простой проверки результата.","О «{topic}» можно говорить долго, но полезнее договориться о конкретике. Эта статья — попытка зафиксировать базовые принципы и показать, как они выглядят в обычной работе."];
const BULLETS = ["Сначала зафиксируйте цель: что именно должно измениться после внедрения","Разбейте задачу на мелкие шаги и проверяйте каждый отдельно","Используйте уже существующие инструменты, а не изобретайте всё заново","Документируйте решения: через месяц детали забудутся","Проверяйте результат на реальных данных, а не только на учебном примере","Оставляйте простой путь отката, если изменения не сработают","Сверяйтесь с опытом сообщества — в канале всегда есть разные точки зрения","Не забывайте про крайние случаи: именно они ловят больше всего ошибок","Измеряйте состояние до и после, иначе нельзя доказать пользу изменений","Фиксируйте сроки: бесконечная доводка полезности не добавляет"];
const STEPS = ["Соберите вводные данные и запишите, что считается успешным результатом. Без этого критерия любое изменение можно назвать удачным.","Сделайте минимальную версию решения. Она должна проверяться за несколько минут и не требовать подготовки сложного окружения.","Проверьте решение на типичном и на нестандартном случае. Если оба проходят, переходите к оценке затрат.","Сравните затраты с пользой. Иногда проще оставить всё как есть и вернуться к вопросу позже, когда появятся новые данные.","Покажите результат коллегам или сообществу. Свежий взгляд чаще находит проблему, чем ещё час самостоятельной проверки.","Зафиксируйте итог короткой заметкой: что сделали, почему выбрали такой путь и что я сделал бы иначе в следующий раз.","Повторите проверку через несколько дней. Некоторые ошибки проявляются только после того, как отвлечёшься от задачи.","Уберите временные файлы и экспериментальные настройки, чтобы последующая работа не начиналась с расчистки мусора."];
const QUOTES = ["> Хорошее решение — то, которое можно объяснить одной фразой и проверить на практике.","> Не бойтесь начинать с простого варианта: его всегда можно усложнить, когда появятся данные.","> Если объяснение занимает больше страницы, скорее всего, в подходе есть лишний шаг.","> Полезнее один раз измерить, чем десять раз предположить.","> Работа закончена не тогда, когда «всё работает», а тогда, когда понятно, почему это работает."];
const SUMMARIES = ["Если коротко: «{topic}» требует не столько сложных инструментов, сколько последовательности. Сформулируйте цель, сделайте минимальный шаг и проверьте результат.","Итог прост: в «{topic}» выигрывает тот, кто фиксирует решения и возвращается к ним с новыми данными. Остальное — детали.","Что запомнить: «{topic}» лучше разбирать на маленьких примерах. Так ошибки видны сразу, а исправления не требуют переделывать всё.","В итоге «{topic}» перестаёт быть сложным, когда появляется план. План есть — значит, есть и точка, где можно остановиться.","Подводя черту, «{topic}» — это задача про внимательность к мелочам. Именно они определяют, будет ли результат устойчивым."];
const EXTRAS = ["Представим обычную ситуацию: задача кажется понятной, но при проверке выясняется, что результат зависит от мелочей. Сначала фиксируем исходные данные, затем делаем минимальное изменение и сравниваем два состояния. Такой подход занимает чуть больше времени на старте, зато экономит часы на последующих исправлениях.","Второй пример — работа с готовым решением, которое писали другие люди. Не стоит сразу переписывать всё: сначала полезно понять, почему выбрано именно такое устройство. Часто за странным на первый взгляд кодом стоит ограничение, которое больше не существует, но иногда оно всё ещё защищает от реальной проблемы.","Третий случай — когда данных для решения не хватает. В такой ситуации помогает обратная связь: короткий вопрос в канале или быстрый опрос среди коллег. Ответы покажут, какие предположения разделяют другие, и где ваша картина расходится с их опытом.","Не стоит забывать и про документацию. Запишите не только итоговое решение, но и причины, по которым другие варианты были отклонены. Через неделю эта заметка сэкономит вам время, а коллеге поможет включиться без долгих объяснений.","Наконец, полезно договориться о критерии готовности. Например, результат считается достигнутым, если проверка проходит на реальных данных, а не на специально подобранном примере, и если решение можно объяснить новому человеку за пару минут."];
const AUTHORS = ["Анна","Сергей","Ирина","Максим","Юлия","Алексей","Мария","Денис","Ольга","Павел","Виктория","Роман","Елена","Дмитрий","Никита","Мария","Влад","Катя"];
const TAGS = ["Вопрос","Инструкция","Обсуждение","Анонс"];
const REPLY_TEXTS = ["Согласен с подходом. У себя добавил проверку на двух разных устройствах — выявило проблему, которую не видно в одном окружении.","Спасибо за разбор! Давно искал понятное объяснение, теперь есть куда возвращаться.","Интересно. А если данных совсем мало, вы бы начали с ручной проверки или сразу с автоматизации?","Полезная статья, сохранил. Особенно отозвался пункт про фиксацию причин отклонённых вариантов.","Попробую применить на своём проекте и вернусь с результатами через пару недель.","Хороший материал. Добавлю от себя: не забывайте проверять решение после обновлений зависимостей."];

function seededRandom(seed){
  return function(){
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(arr, rnd){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
function makeContent(topic, channelName, rnd, long){
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const bullets = shuffled(BULLETS, rnd).slice(0, long ? 5 : 3);
  const steps = shuffled(STEPS, rnd).slice(0, long ? 5 : 3);
  const parts = [
    pick(INTROS).replace('{topic}', topic).replace('{channel}', channelName),
    '## Что важно\n\n' + bullets.map(b => '- ' + b).join('\n'),
    '## Как действовать\n\n' + steps.map((s, i) => (i + 1) + '. ' + s).join('\n'),
    pick(QUOTES),
    '## Итоги\n\n' + pick(SUMMARIES).replace('{topic}', topic)
  ];
  let text = parts.join('\n\n');
  if (long) {
    text += '\n\n## Разбор примера\n\n' + EXTRAS[0] + '\n\n' + EXTRAS[1] + '\n\n- ' + bullets[0] + '\n- ' + bullets[1] + '\n- ' + bullets[2];
    let n = 2;
    while (text.length < 1550) { text += '\n\n' + EXTRAS[n % EXTRAS.length]; n++; }
  } else if (text.length < 520) {
    let n = 0;
    while (text.length < 560) { text += '\n\n' + EXTRAS[n % EXTRAS.length]; n++; }
  }
  return text;
}
function buildGeneratedThreads(){
  const rnd = seededRandom(20261118);
  const counts = {};
  CATEGORIES.forEach(c => c.channels.forEach(ch => counts[ch[0]] = 10));
  for (let i = 0; i < 100; i++) {
    const keys = Object.keys(counts);
    counts[keys[Math.floor(rnd() * keys.length)]]++;
  }
  const out = [];
  const now = Date.now();
  CATEGORIES.forEach(c => c.channels.forEach(ch => {
    const chId = ch[0], channelName = ch[1];
    const bases = TOPIC_BASES[chId];
    const n = counts[chId];
    for (let k = 0; k < n; k++) {
      const topic = bases[k % bases.length];
      const vi = Math.floor(k / bases.length);
      let title = topic;
      if (vi > 0) title += ': ' + TOPIC_ASPECTS[vi % TOPIC_ASPECTS.length];
      if (vi >= TOPIC_ASPECTS.length) title += ' — ' + (vi + 1);
      const long = out.length % 7 === 0;
      const ts = now - 1000 * 60 * 60 - Math.floor(rnd() * 1000 * 60 * 60 * 24 * 60);
      const replyCount = Math.floor(rnd() * 3);
      const replies = [];
      for (let r = 0; r < replyCount; r++) {
        replies.push({
          id: 'r-gen-' + out.length + '-' + r,
          author: AUTHORS[Math.floor(rnd() * AUTHORS.length)],
          text: REPLY_TEXTS[Math.floor(rnd() * REPLY_TEXTS.length)],
          ts: ts + 1000 * 60 * (30 + r * 45)
        });
      }
      out.push({ cat: c.id, ch: chId, thread: {
        id: 't-gen-' + out.length,
        title: title,
        content: makeContent(title, channelName, rnd, long),
        author: AUTHORS[Math.floor(rnd() * AUTHORS.length)],
        tag: TAGS[Math.floor(rnd() * TAGS.length)],
        ts: ts,
        replies: replies
      }});
    }
  }));
  return out;
}
const generatedThreads = buildGeneratedThreads();
const OLD_GENERATED_ID = /^(t-[1-5]|t-seed-.+|t-topic-.+|t-gen-.+)$/;
function applySeedUpdates(data){
  let changed = false;
  data.categories.forEach(c => c.channels.forEach(ch => {
    const before = ch.threads.length;
    ch.threads = ch.threads.filter(t => !OLD_GENERATED_ID.test(t.id));
    if (ch.threads.length !== before) changed = true;
  }));
  generatedThreads.forEach(seed => {
    const cat = data.categories.find(c => c.id === seed.cat);
    const ch = cat && cat.channels.find(x => x.id === seed.ch);
    if (!ch || ch.threads.some(t => t.id === seed.thread.id)) return;
    ch.threads.push(clone(seed.thread));
    changed = true;
  });
  return changed;
}

function normalize(d){
  const data = (d && typeof d === 'object') ? d : clone(sampleData);
  data.title = data.title || 'Reader';
  data.categories = Array.isArray(data.categories) ? data.categories : [];
  data.categories.forEach(c => {
    c.id = c.id || uid('cat');
    c.name = String(c.name || 'Без названия');
    c.icon = P[c.icon] ? c.icon : 'chat';
    c.channels = Array.isArray(c.channels) ? c.channels : [];
    c.channels.forEach(ch => {
      ch.id = ch.id || uid('ch');
      ch.name = String(ch.name || 'Канал');
      ch.threads = Array.isArray(ch.threads) ? ch.threads : [];
      ch.threads.forEach(t => {
        t.id = t.id || uid('t');
        t.title = String(t.title || 'Без названия');
        t.content = String(t.content || '');
        t.author = String(t.author || 'Аноним');
        t.tag = String(t.tag || '');
        t.ts = Number(t.ts) || Date.now();
        t.replies = Array.isArray(t.replies) ? t.replies : [];
        t.replies.forEach(r => {
          r.id = r.id || uid('r');
          r.author = String(r.author || 'Аноним');
          r.text = String(r.text || '');
          r.ts = Number(r.ts) || Date.now();
        });
      });
    });
  });
  return data;
}
function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  let data;
  if (!raw) data = clone(sampleData);
  else {
    try { data = normalize(JSON.parse(raw)); }
    catch (e) { data = clone(sampleData); }
  }
  if (localStorage.getItem(SEED_KEY) !== '6') {
    applySeedUpdates(data);
    localStorage.setItem(SEED_KEY, '6');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}
function saveData(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }
  catch (e) { toast('Не удалось сохранить: хранилище переполнено', 'bad'); }
}

/* ============ Состояние ============ */
const state = {
  data: loadData(),
  activeCategoryId: null,
  activeChannelId: null,
  activeThreadId: null,
  search: '',
  sort: 'new',
  tag: '',
  collapsed: new Set(),
  theme: localStorage.getItem(THEME_KEY) || 'dark',
  author: localStorage.getItem(AUTHOR_KEY) || ''
};
if (state.theme !== 'light' && state.theme !== 'dark') state.theme = 'dark';
document.documentElement.dataset.theme = state.theme;

/* ============ Тост ============ */
let toastTimer = null;
function toast(msg, type){
  const el = $('#toast');
  el.textContent = msg;
  el.dataset.type = type || 'ok';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ============ Модалка ============ */
let modalSubmit = null;
function openModal(opts){
  modalSubmit = opts.onSubmit || null;
  $('#modalBox').innerHTML =
    '<h3>' + escapeHtml(opts.title) + '</h3>' +
    (opts.desc ? '<p class="desc">' + escapeHtml(opts.desc) + '</p>' : '') +
    '<form id="modalForm">' + (opts.body || '') +
      '<div class="modal-actions">' +
        '<button type="button" class="btn" data-act="close-modal">Отмена</button>' +
        '<button type="submit" class="btn ' + (opts.okClass || 'primary') + '">' + escapeHtml(opts.ok || 'Сохранить') + '</button>' +
      '</div>' +
    '</form>';
  $('#modal').hidden = false;
  setTimeout(() => { const f = $('#modalBox').querySelector('input,textarea,select'); if (f) f.focus(); }, 50);
}
function closeModal(){ $('#modal').hidden = true; modalSubmit = null; }

$('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });
$('#modalBox').addEventListener('click', e => { if (e.target.closest('[data-act="close-modal"]')) closeModal(); });
$('#modalBox').addEventListener('submit', e => {
  e.preventDefault();
  if (!modalSubmit) return closeModal();
  const values = Object.fromEntries(new FormData(e.target).entries());
  if (modalSubmit(values) !== false) closeModal();
});

/* ============ Доступ к данным ============ */
function allThreads(){
  const out = [];
  state.data.categories.forEach(c => c.channels.forEach(ch => ch.threads.forEach(t => out.push({ cat: c, ch: ch, t: t }))));
  return out;
}
function findChannel(catId, chId){
  const c = state.data.categories.find(x => x.id === catId);
  return c ? c.channels.find(x => x.id === chId) : null;
}
function findThread(catId, chId, tId){
  const ch = findChannel(catId, chId);
  return ch ? ch.threads.find(t => t.id === tId) : null;
}
function searchResults(){
  const q = state.search.trim().toLowerCase();
  if (!q) return [];
  return allThreads().filter(({ t }) =>
    (t.title + ' ' + stripMd(t.content) + ' ' + t.author + ' ' + (t.tag || '')).toLowerCase().includes(q)
  );
}
function sortItems(items){
  const arr = items.slice();
  if (state.sort === 'top') arr.sort((a, b) => b.t.replies.length - a.t.replies.length || b.t.ts - a.t.ts);
  else if (state.sort === 'title') arr.sort((a, b) => a.t.title.localeCompare(b.t.title, 'ru'));
  else arr.sort((a, b) => b.t.ts - a.t.ts);
  return arr;
}

/* ============ Рендер: сайдбар ============ */
function isActive(catId, chId){
  return state.activeCategoryId === catId && state.activeChannelId === chId;
}
function renderSidebar(){
  const box = $('#categories');
  box.innerHTML = state.data.categories.map(c => {
    const total = c.channels.reduce((a, ch) => a + ch.threads.length, 0);
    const collapsed = state.collapsed.has(c.id);
    return '<div class="cat' + (collapsed ? ' collapsed' : '') + '">' +
      '<button class="cat-head" data-act="toggle-cat" data-id="' + c.id + '" aria-expanded="' + (!collapsed) + '">' +
        '<span class="cat-icon">' + icon(c.icon, 17) + '</span>' +
        '<span class="cat-name">' + escapeHtml(c.name) + '</span>' +
        '<span class="cat-count">' + total + '</span>' +
        '<span class="chev">' + icon('chevron', 14) + '</span>' +
      '</button>' +
      '<div class="channels">' +
        c.channels.map(ch =>
          '<button class="channel' + (isActive(c.id, ch.id) ? ' active' : '') + '" data-act="open-channel" data-cat="' + c.id + '" data-id="' + ch.id + '"' +
            (isActive(c.id, ch.id) ? ' aria-current="true"' : '') + '>' +
            '<span class="dot"></span><span class="ch-name">' + escapeHtml(ch.name) + '</span><span class="n">' + ch.threads.length + '</span>' +
          '</button>'
        ).join('') +
        '<button class="add-channel" data-act="add-channel" data-id="' + c.id + '">+ канал</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ============ Рендер: список ============ */
function emptyState(kind){
  if (kind === 'search') return '<div class="empty"><div class="big">' + icon('search', 34) + '</div><h3>Ничего не найдено</h3><p>Измените запрос или сбросьте поиск.</p></div>';
  if (kind === 'tag')    return '<div class="empty"><div class="big">' + icon('chat', 34) + '</div><h3>Нет тем с этим тегом</h3><p>Снимите фильтр, чтобы увидеть все темы канала.</p></div>';
  if (kind === 'threads')return '<div class="empty"><div class="big">' + icon('chat', 34) + '</div><h3>Здесь пока пусто</h3><p>Создайте первую тему в этом канале.</p><button class="btn primary" data-act="new-thread">' + icon('plus', 15) + '<span>Новая тема</span></button></div>';
  return '<div class="empty"><div class="big">' + icon('spark', 34) + '</div><h3>Выберите канал</h3><p>Слева откройте категорию и канал — здесь появятся темы.</p></div>';
}
function cardHtml(item){
  const t = item.t, q = state.search.trim();
  return '<article class="thread" data-act="open-thread" data-cat="' + item.cat.id + '" data-ch="' + item.ch.id + '" data-id="' + t.id + '" tabindex="0" role="button">' +
    avatar(t.author) +
    '<div class="thread-body">' +
      '<div class="thread-top">' +
        '<h3>' + highlight(t.title, state.search) + '</h3>' +
        (t.tag ? '<span class="tag" data-tag="' + escapeHtml(t.tag) + '">' + escapeHtml(t.tag) + '</span>' : '') +
      '</div>' +
      '<p class="excerpt">' + highlight(shorten(t.content, 200), state.search) + '</p>' +
      '<div class="thread-meta">' +
        (q ? '<span class="chip-loc">' + escapeHtml(item.cat.name) + ' / ' + escapeHtml(item.ch.name) + '</span>' : '') +
        '<span>автор <b>' + escapeHtml(t.author) + '</b></span>' +
        '<span title="' + fullDate(t.ts) + '">' + timeAgo(t.ts) + '</span>' +
        '<span class="pill-stat">' + icon('reply', 13) + t.replies.length + '</span>' +
        '<span class="pill-stat">' + icon('clock', 13) + readMinutes(t.content) + ' мин</span>' +
      '</div>' +
    '</div>' +
  '</article>';
}
function renderFilters(items){
  const box = $('#filters');
  const counts = new Map();
  items.forEach(({ t }) => { if (t.tag) counts.set(t.tag, (counts.get(t.tag) || 0) + 1); });
  if (!counts.size) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML =
    '<button class="chip' + (!state.tag ? ' on' : '') + '" data-act="filter-tag" data-tag="">Все <span class="num">' + items.length + '</span></button>' +
    [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, n]) =>
      '<button class="chip' + (state.tag === tag ? ' on' : '') + '" data-act="filter-tag" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + ' <span class="num">' + n + '</span></button>'
    ).join('');
}
function renderList(){
  state.activeThreadId = null;
  $('#threadView').hidden = true;
  $('#listView').hidden = false;

  const q = state.search.trim();
  let items = [];

  if (q) {
    items = searchResults();
    $('#eyebrow').textContent = 'Поиск';
    $('#pageTitle').textContent = 'Результаты';
    $('#filters').hidden = true;
  } else if (!state.activeCategoryId || !state.activeChannelId) {
    $('#eyebrow').textContent = 'Форум';
    $('#pageTitle').textContent = 'Добро пожаловать';
    $('#filters').hidden = true;
    $('#threads').innerHTML = emptyState('welcome');
    return;
  } else {
    const c = state.data.categories.find(x => x.id === state.activeCategoryId);
    const ch = c.channels.find(x => x.id === state.activeChannelId);
    $('#eyebrow').textContent = c.name;
    $('#pageTitle').textContent = ch.name;
    items = ch.threads.map(t => ({ cat: c, ch: ch, t: t }));
    renderFilters(items);
  }

  items = sortItems(items);
  if (!q && state.tag) items = items.filter(o => o.t.tag === state.tag);

  if (!items.length) {
    $('#threads').innerHTML = emptyState(q ? 'search' : (state.tag ? 'tag' : 'threads'));
    return;
  }
  $('#threads').innerHTML = items.map(cardHtml).join('');
}

/* ============ Рендер: тема ============ */
function renderThread(){
  const t = findThread(state.activeCategoryId, state.activeChannelId, state.activeThreadId);
  if (!t) { renderList(); return; }

  $('#listView').hidden = true;
  $('#threadView').hidden = false;

  const cat = state.data.categories.find(c => c.id === state.activeCategoryId);
  const ch = cat.channels.find(c => c.id === state.activeChannelId);
  $('#eyebrow').textContent = cat.name + ' / ' + ch.name;
  $('#pageTitle').textContent = t.title;

  const replies = t.replies.slice().sort((a, b) => a.ts - b.ts);

  $('#threadContainer').innerHTML =
    '<article class="post">' +
      '<div class="post-head">' +
        avatar(t.author, 'lg') +
        '<div class="post-head-main">' +
          '<h3>' + escapeHtml(t.title) + '</h3>' +
          '<div class="thread-meta">' +
            (t.tag ? '<span class="tag" data-tag="' + escapeHtml(t.tag) + '">' + escapeHtml(t.tag) + '</span>' : '') +
            '<span><b>' + escapeHtml(t.author) + '</b></span>' +
            '<span title="' + fullDate(t.ts) + '">' + timeAgo(t.ts) + '</span>' +
            '<span class="pill-stat">' + icon('chat', 13) + t.replies.length + '</span>' +
            '<span class="pill-stat">' + icon('clock', 13) + readMinutes(t.content) + ' мин чтения</span>' +
          '</div>' +
        '</div>' +
        '<button class="btn icon ghost" data-act="del-thread" title="Удалить тему" aria-label="Удалить тему">' + icon('trash', 16) + '</button>' +
      '</div>' +
      '<div class="prose md">' + formatContent(t.content) + '</div>' +
      '<div class="divider"></div>' +
      '<div class="replies-title">' + icon('chat', 15) + 'Ответы <span class="badge-n">' + t.replies.length + '</span></div>' +
      '<div class="replies">' +
        (replies.length
          ? replies.map(r =>
              '<div class="reply">' +
                avatar(r.author, 'sm') +
                '<div class="body">' +
                  '<div class="reply-top">' +
                    '<span class="who">' + escapeHtml(r.author) + '</span>' +
                    '<span class="when" title="' + fullDate(r.ts) + '">' + timeAgo(r.ts) + '</span>' +
                    '<button class="reply-del" data-act="del-reply" data-id="' + r.id + '" title="Удалить ответ" aria-label="Удалить ответ">' + icon('close', 13) + '</button>' +
                  '</div>' +
                  '<div class="txt md">' + formatContent(r.text) + '</div>' +
                '</div>' +
              '</div>'
            ).join('')
          : '<div class="hint">Пока нет ответов — будьте первым.</div>') +
      '</div>' +
      '<form class="composer" id="composer">' +
        '<div class="composer-row">' +
          '<input class="input" id="replyAuthor" name="author" placeholder="Ваше имя" maxlength="40" style="max-width:210px" value="' + escapeHtml(state.author) + '" />' +
          '<span class="hint">Аватар подберётся автоматически</span>' +
        '</div>' +
        '<textarea class="input" id="replyText" name="text" rows="3" placeholder="Напишите ответ… **жирный**, `код`, - список, > цитата"></textarea>' +
        '<div class="composer-actions">' +
          '<span class="hint">Ctrl / ⌘ + Enter — отправить</span>' +
          '<button class="btn primary" type="submit">' + icon('reply', 15) + 'Ответить</button>' +
        '</div>' +
      '</form>' +
    '</article>';
}

/* ============ Рендер: правая колонка ============ */
function renderAside(){
  const all = allThreads();
  const replies = all.reduce((a, o) => a + o.t.replies.length, 0);
  const channels = state.data.categories.reduce((a, c) => a + c.channels.length, 0);

  $('#stats').innerHTML =
    '<div class="stat"><b>' + state.data.categories.length + '</b><span>категорий</span></div>' +
    '<div class="stat"><b>' + channels + '</b><span>каналов</span></div>' +
    '<div class="stat"><b>' + all.length + '</b><span>тем</span></div>' +
    '<div class="stat"><b>' + replies + '</b><span>ответов</span></div>';

  const active = new Map();
  all.forEach(({ cat, ch }) => {
    const cur = active.get(ch.id) || { cat: cat.name, ch: ch.name, n: 0 };
    cur.n += 1;
    active.set(ch.id, cur);
  });
  const list = [...active.values()].sort((a, b) => b.n - a.n).slice(0, 5);
  $('#activeChannels').innerHTML = list.length
    ? list.map(a => '<div class="active-row"><span>' + escapeHtml(a.ch) + '<div class="who">' + escapeHtml(a.cat) + '</div></span><b>' + a.n + '</b></div>').join('')
    : '<div class="hint">Пока нет тем</div>';

  try {
    const bytes = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
    $('#storageInfo').textContent = 'Данные в браузере · ' + Math.max(1, Math.round(bytes / 1024)) + ' КБ';
  } catch (e) {
    $('#storageInfo').textContent = 'Данные в браузере';
  }
}

/* ============ Общий рендер ============ */
function renderAll(){
  renderSidebar();
  renderAside();

  const q = state.search.trim();
  $('#searchNotice').hidden = !q;
  if (q) $('#noticeText').textContent = 'Найдено тем: ' + searchResults().length;
  $('#searchClear').classList.toggle('show', !!$('#searchInput').value);

  if (state.activeThreadId && !q) renderThread();
  else renderList();
}

/* ============ Действия ============ */
function postReply(){
  const authorEl = $('#replyAuthor');
  const textEl = $('#replyText');
  const author = (authorEl ? authorEl.value : '').trim();
  const text = (textEl ? textEl.value : '').trim();
  if (!text) { toast('Введите текст ответа', 'bad'); if (textEl) textEl.focus(); return; }

  const t = findThread(state.activeCategoryId, state.activeChannelId, state.activeThreadId);
  if (!t) return;

  t.replies.push({ id: uid('r'), author: author || 'Аноним', text: text, ts: Date.now() });
  state.author = author;
  localStorage.setItem(AUTHOR_KEY, author);
  saveData();
  renderThread();
  renderSidebar();
  renderAside();
  toast('Ответ опубликован', 'good');
}

function newThreadFlow(){
  if (!state.activeChannelId) { toast('Сначала выберите канал', 'bad'); return; }
  openModal({
    title: 'Новая тема',
    desc: 'Заголовок и сообщение обязательны.',
    body:
      '<div class="field"><label>Заголовок</label><input class="input" name="title" required maxlength="120" placeholder="О чём тема?" /></div>' +
      '<div class="field field-row">' +
        '<div><label>Автор</label><input class="input" name="author" maxlength="40" placeholder="Аноним" value="' + escapeHtml(state.author) + '" /></div>' +
        '<div><label>Тег</label><select class="input" name="tag">' +
          '<option value="">Без тега</option><option>Вопрос</option><option>Инструкция</option><option>Обсуждение</option><option>Анонс</option>' +
        '</select></div>' +
      '</div>' +
      '<div class="field"><label>Сообщение</label><textarea class="input" name="content" required placeholder="Поддерживаются переносы, списки «- », **жирный**, `код`, > цитаты"></textarea></div>',
    ok: 'Опубликовать',
    onSubmit: v => {
      const title = String(v.title || '').trim();
      const content = String(v.content || '').trim();
      if (!title || !content) return false;

      const ch = findChannel(state.activeCategoryId, state.activeChannelId);
      if (!ch) return false;

      const author = String(v.author || '').trim() || 'Аноним';
      state.author = String(v.author || '').trim();
      localStorage.setItem(AUTHOR_KEY, state.author);

      const t = { id: uid('t'), title: title, content: content, author: author, tag: v.tag || '', ts: Date.now(), replies: [] };
      ch.threads.push(t);
      saveData();

      state.activeThreadId = t.id;
      state.search = '';
      state.tag = '';
      $('#searchInput').value = '';
      renderAll();
      $('#content').scrollTop = 0;
      toast('Тема опубликована', 'good');
    }
  });
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;

  if (act === 'toggle-cat') {
    const id = el.dataset.id;
    if (state.collapsed.has(id)) state.collapsed.delete(id); else state.collapsed.add(id);
    renderSidebar();
    return;
  }

  if (act === 'open-channel') {
    state.activeCategoryId = el.dataset.cat;
    state.activeChannelId = el.dataset.id;
    state.activeThreadId = null;
    state.search = '';
    state.tag = '';
    $('#searchInput').value = '';
    closeDrawer();
    renderAll();
    return;
  }

  if (act === 'open-thread') {
    state.activeCategoryId = el.dataset.cat;
    state.activeChannelId = el.dataset.ch;
    state.activeThreadId = el.dataset.id;
    renderAll();
    $('#content').scrollTop = 0;
    return;
  }

  if (act === 'new-thread') { newThreadFlow(); return; }

  if (act === 'filter-tag') {
    const tag = el.dataset.tag || '';
    state.tag = state.tag === tag ? '' : tag;
    renderList();
    return;
  }

  if (act === 'add-channel') {
    const cat = state.data.categories.find(c => c.id === el.dataset.id);
    if (!cat) return;
    openModal({
      title: 'Новый канал',
      desc: 'Категория «' + cat.name + '»',
      body: '<div class="field"><label>Название канала</label><input class="input" name="name" required maxlength="60" placeholder="Например, Обсуждения" /></div>',
      ok: 'Добавить',
      onSubmit: v => {
        const name = String(v.name || '').trim();
        if (!name) return false;
        const ch = { id: uid('ch'), name: name, threads: [] };
        cat.channels.push(ch);
        saveData();
        state.activeCategoryId = cat.id;
        state.activeChannelId = ch.id;
        state.activeThreadId = null;
        state.tag = '';
        state.collapsed.delete(cat.id);
        renderAll();
        toast('Канал добавлен', 'good');
      }
    });
    return;
  }

  if (act === 'del-thread') {
    const t = findThread(state.activeCategoryId, state.activeChannelId, state.activeThreadId);
    if (!t) return;
    openModal({
      title: 'Удалить тему?',
      desc: 'Тема «' + t.title + '» и все ответы будут удалены безвозвратно.',
      ok: 'Удалить',
      okClass: 'danger-solid',
      onSubmit: () => {
        const ch = findChannel(state.activeCategoryId, state.activeChannelId);
        if (!ch) return false;
        ch.threads = ch.threads.filter(x => x.id !== t.id);
        saveData();
        state.activeThreadId = null;
        renderAll();
        toast('Тема удалена', 'good');
      }
    });
    return;
  }

  if (act === 'del-reply') {
    const t = findThread(state.activeCategoryId, state.activeChannelId, state.activeThreadId);
    if (!t) return;
    const id = el.dataset.id;
    openModal({
      title: 'Удалить ответ?',
      desc: 'Ответ будет удалён безвозвратно.',
      ok: 'Удалить',
      okClass: 'danger-solid',
      onSubmit: () => {
        t.replies = t.replies.filter(r => r.id !== id);
        saveData();
        renderThread();
        renderSidebar();
        renderAside();
        toast('Ответ удалён', 'good');
      }
    });
    return;
  }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'composer') { e.preventDefault(); postReply(); }
});

document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;

  if (e.key === 'Escape') {
    if (!$('#modal').hidden) { closeModal(); return; }
    if (state.activeThreadId) { state.activeThreadId = null; renderAll(); return; }
    if (document.activeElement === $('#searchInput') && state.search) {
      state.search = ''; $('#searchInput').value = ''; renderAll(); return;
    }
    closeDrawer();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.target.id === 'replyText') {
    e.preventDefault();
    postReply();
    return;
  }

  if (typing || !$('#modal').hidden) return;

  if (e.key === '/') { e.preventDefault(); $('#searchInput').focus(); return; }
  if (e.key.toLowerCase() === 'n') { e.preventDefault(); newThreadFlow(); }
});

/* ============ Элементы управления ============ */
const searchInput = $('#searchInput');
searchInput.addEventListener('input', e => {
  state.search = e.target.value.trim();
  state.tag = '';
  renderAll();
});

$('#searchClear').addEventListener('click', () => {
  searchInput.value = '';
  state.search = '';
  state.tag = '';
  renderAll();
  searchInput.focus();
});

$('#clearSearch').addEventListener('click', () => {
  searchInput.value = '';
  state.search = '';
  state.tag = '';
  renderAll();
});

$('#sortSelect').addEventListener('change', e => {
  state.sort = e.target.value;
  renderAll();
});

$('#backBtn').addEventListener('click', () => {
  state.activeThreadId = null;
  renderAll();
});

$('#collapseAll').addEventListener('click', () => {
  const allCollapsed = state.data.categories.every(c => state.collapsed.has(c.id));
  if (allCollapsed) state.collapsed.clear();
  else state.data.categories.forEach(c => state.collapsed.add(c.id));
  renderSidebar();
  $('#collapseAll').textContent = allCollapsed ? 'свернуть' : 'развернуть';
});

$('#addCatBtn').addEventListener('click', () => {
  openModal({
    title: 'Новая категория',
    body: '<div class="field"><label>Название</label><input class="input" name="name" required maxlength="50" placeholder="Например, Обучение" /></div>',
    ok: 'Добавить',
    onSubmit: v => {
      const name = String(v.name || '').trim();
      if (!name) return false;
      const cat = { id: uid('cat'), name: name, icon: 'chat', channels: [] };
      state.data.categories.push(cat);
      saveData();
      state.activeCategoryId = cat.id;
      state.activeChannelId = null;
      state.activeThreadId = null;
      state.collapsed.delete(cat.id);
      renderAll();
      toast('Категория добавлена', 'good');
    }
  });
});

$('#newThreadBtn').addEventListener('click', newThreadFlow);

/* ---------- Тема ---------- */
function applyTheme(){
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem(THEME_KEY, state.theme);
  $('#themeBtn').innerHTML = icon(state.theme === 'dark' ? 'sun' : 'moon', 17);
  $('#themeBtn').setAttribute('aria-label', state.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
}
$('#themeBtn').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
});

/* ---------- Drawer ---------- */
function openDrawer(){ $('#sidebar').classList.add('open'); $('#scrim').hidden = false; }
function closeDrawer(){ $('#sidebar').classList.remove('open'); $('#scrim').hidden = true; }
$('#menuBtn').addEventListener('click', () => {
  if ($('#sidebar').classList.contains('open')) closeDrawer(); else openDrawer();
});
$('#drawerClose').addEventListener('click', closeDrawer);
$('#scrim').addEventListener('click', closeDrawer);

/* ---------- Экспорт / импорт / сброс ---------- */
$('#exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'forumreader_export.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Экспорт готов', 'good');
});

$('#importBtn').addEventListener('click', () => $('#importFile').click());

$('#importFile').addEventListener('change', e => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try { parsed = JSON.parse(reader.result); }
    catch (err) { toast('Файл не является корректным JSON', 'bad'); return; }
    if (!parsed || !Array.isArray(parsed.categories)) { toast('Это не данные ForumReader', 'bad'); return; }
    openModal({
      title: 'Импортировать данные?',
      desc: 'Текущие темы и каналы будут заменены содержимым файла.',
      ok: 'Импортировать',
      onSubmit: () => {
        state.data = normalize(parsed);
        saveData();
        state.activeCategoryId = null;
        state.activeChannelId = null;
        state.activeThreadId = null;
        state.search = '';
        state.tag = '';
        searchInput.value = '';
        renderAll();
        toast('Данные импортированы', 'good');
      }
    });
  };
  reader.readAsText(file);
  e.target.value = '';
});

$('#resetBtn').addEventListener('click', () => {
  openModal({
    title: 'Сбросить к примеру?',
    desc: 'Все созданные темы, каналы и категории будут удалены из этого браузера.',
    ok: 'Сбросить',
    okClass: 'danger-solid',
    onSubmit: () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SEED_KEY);
      state.data = loadData();
      state.activeCategoryId = null;
      state.activeChannelId = null;
      state.activeThreadId = null;
      state.search = '';
      state.tag = '';
      searchInput.value = '';
      renderAll();
      toast('Пример восстановлен', 'good');
    }
  });
});

/* ============ Chrome ============ */
function updateChrome(){
  $('#brandIcon').innerHTML = icon('chat', 22);
  $('#searchIcon').innerHTML = icon('search', 15);
  $('#searchClear').innerHTML = icon('close', 14);
  $('#addCatBtn').innerHTML = icon('plus', 15) + '<span>Категория</span>';
  $('#menuBtn').innerHTML = icon('menu', 18);
  $('#drawerClose').innerHTML = icon('close', 16);
  $('#backBtn').innerHTML = icon('back', 15) + 'К списку тем';
  $('#exportBtn').innerHTML = icon('export', 16);
  $('#importBtn').innerHTML = icon('import', 16);
  $('#resetBtn').innerHTML = icon('reset', 16);
  $('#newThreadBtn').innerHTML = icon('plus', 16) + '<span class="label">Новая тема</span>';
  $('#noticeIcon').innerHTML = icon('search', 15);
  $('#footIcon').innerHTML = icon('db', 13);
}

/* ============ Старт ============ */
updateChrome();
applyTheme();
$('#sortSelect').value = state.sort;
renderAll();

})();
