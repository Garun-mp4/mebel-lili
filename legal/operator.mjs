// Публичные реквизиты. Замените ВСЕ плейсхолдеры перед приёмом заявок.
export const operator = {
  approved: false,
  name: '[ПОЛНОЕ НАИМЕНОВАНИЕ ООО / ФИО ИП ИЛИ ФИЗЛИЦА]',
  inn: '[ИНН]',
  registration: '[ОГРН / ОГРНИП ИЛИ «НЕ ПРИМЕНЯЕТСЯ»]',
  address: '[ЮРИДИЧЕСКИЙ / ПОЧТОВЫЙ АДРЕС ОПЕРАТОРА]',
  email: '[EMAIL ДЛЯ ОБРАЩЕНИЙ ПО ПЕРСОНАЛЬНЫМ ДАННЫМ]',
  site: '[https://ДОМЕН-САЙТА]',
  hostingProvider: '[НАИМЕНОВАНИЕ, АДРЕС И РЕКВИЗИТЫ РОССИЙСКОГО ХОСТИНГ-ПРОВАЙДЕРА]',
  databaseLocation: '[АДРЕС ЦОД В РОССИЙСКОЙ ФЕДЕРАЦИИ]',
};

export const consentVersion = '2026-10-04.1';
export const retentionDays = 30;
export function operatorReady(value = operator) {
  return value.approved === true && Object.entries(value).every(([key, field]) =>
    key === 'approved' || (typeof field === 'string' && field.trim() && !/[\[\]]/.test(field)))
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
    && /^https:\/\/[^\s/]+\/?$/.test(value.site);
}
