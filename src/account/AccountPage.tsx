import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import './AccountPage.css'

interface MeResponse {
  user: {
    id: string
    displayName: string | null
    status: string
  }
  contacts: Array<{
    type: string
    value: string
    isVerified: boolean
  }>
}

interface Address {
  id: string
  label: string
  city: string
  street: string
  building: string
  entrance?: string
  floor?: string
  apartment?: string
  comment?: string
  isDefault: boolean
}

interface Favorite {
  id: string
  sku: string
  createdAt: string
}

interface Order {
  id: string
  externalOrderId: string | null
  totalAmount: string
  currency: string
  status: string
  placedAt: string
}

interface Consent {
  id: string
  consentType: string
  documentVersion: string
  granted: boolean
  grantedAt: string
  revokedAt: string | null
}

interface PrivacyRequest {
  id: string
  requestType: string
  status: string
  payload: {
    reason?: string
  } | null
  createdAt: string
  completedAt: string | null
}

type NoticeTone = 'success' | 'warning'

interface NoticeState {
  tone: NoticeTone
  message: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function maskPhone(phone: string) {
  if (phone.length < 12) return phone
  return `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10, 12)}`
}

function formatErrorMessage(error: string) {
  switch (error) {
    case 'UNAUTHORIZED':
      return 'Сессия не найдена. Войдите заново.'
    case 'OTP_COOLDOWN':
      return 'Код уже отправлен. Подождите немного перед повторной отправкой.'
    case 'INVALID_CODE':
      return 'Код из SMS не подошёл. Проверьте цифры и попробуйте ещё раз.'
    case 'OTP_EXPIRED':
      return 'Срок действия кода истёк. Запросите новый код.'
    case 'INVALID_CHALLENGE':
      return 'Сессия подтверждения устарела. Запросите код заново.'
    case 'OTP_MAX_ATTEMPTS':
      return 'Слишком много попыток. Запросите новый код.'
    case 'REQUEST_FAILED':
      return 'Не удалось выполнить запрос. Попробуйте ещё раз.'
    default:
      return error
  }
}

function formatConsentType(type: string) {
  if (type === 'personal_data') return 'Обработка персональных данных'
  if (type === 'marketing') return 'Маркетинговые сообщения'
  return type
}

function formatOrderStatus(status: string) {
  if (status === 'new') return 'Новый'
  if (status === 'paid') return 'Оплачен'
  if (status === 'delivered') return 'Выдан'
  if (status === 'cancelled') return 'Отменён'
  return status
}

function formatPrivacyRequestType(type: string) {
  if (type === 'export') return 'Экспорт данных'
  if (type === 'delete') return 'Удаление аккаунта'
  if (type === 'revoke_marketing') return 'Отзыв маркетинга'
  return type
}

function formatPrivacyRequestStatus(status: string) {
  if (status === 'new') return 'Новый'
  if (status === 'in_progress') return 'В работе'
  if (status === 'completed') return 'Завершён'
  if (status === 'rejected') return 'Отклонён'
  return status
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? 'REQUEST_FAILED')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function AccountPage() {
  const [me, setMe] = useState<MeResponse | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [consents, setConsents] = useState<Consent[]>([])
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [privacyContactEmail, setPrivacyContactEmail] = useState('')

  const [phone, setPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [debugCode, setDebugCode] = useState<string | null>(null)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [personalDataConsent, setPersonalDataConsent] = useState(false)
  const [cooldownSec, setCooldownSec] = useState(0)
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [addressLabel, setAddressLabel] = useState('Дом')
  const [addressCity, setAddressCity] = useState('Краснодар')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressBuilding, setAddressBuilding] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  const latestMarketingConsent = useMemo(
    () => consents.find((item) => item.consentType === 'marketing'),
    [consents],
  )

  const verifiedPhone = useMemo(
    () => me?.contacts.find((contact) => contact.type === 'phone')?.value ?? phone,
    [me, phone],
  )

  const verifiedEmail = useMemo(
    () => me?.contacts.find((contact) => contact.type === 'email')?.value ?? '',
    [me],
  )

  const loadDashboard = async () => {
    const [meData, ordersData, favoritesData, addressesData, consentsData, privacyRequestsData] = await Promise.all([
      api<MeResponse>('/api/me'),
      api<{ items: Order[] }>('/api/me/orders'),
      api<{ items: Favorite[] }>('/api/me/favorites'),
      api<{ items: Address[] }>('/api/me/addresses'),
      api<{ items: Consent[] }>('/api/me/consents'),
      api<{ items: PrivacyRequest[]; contactEmail: string }>('/api/me/privacy/requests'),
    ])

    setMe(meData)
    setOrders(ordersData.items)
    setFavorites(favoritesData.items)
    setAddresses(addressesData.items)
    setConsents(consentsData.items)
    setPrivacyRequests(privacyRequestsData.items)
    setPrivacyContactEmail(privacyRequestsData.contactEmail)
    setProfileName(meData.user.displayName ?? '')
    setProfileEmail(meData.contacts.find((contact) => contact.type === 'email')?.value ?? '')
  }

  useEffect(() => {
    loadDashboard()
      .catch(() => setMe(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (cooldownSec <= 0) return

    const timeoutId = window.setTimeout(() => {
      setCooldownSec((value) => Math.max(0, value - 1))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [cooldownSec])

  const sendOtpRequest = async () => {
    setError(null)
    setNotice(null)

    if (!personalDataConsent) {
      setError('Подтвердите согласие на обработку персональных данных, чтобы продолжить.')
      return
    }

    setIsRequestingOtp(true)

    try {
      const response = await api<{ challengeId: string; debugCode?: string; retryAfterSec?: number }>('/api/auth/start', {
        method: 'POST',
        body: JSON.stringify({ channel: 'sms', phone }),
      })

      setChallengeId(response.challengeId)
      setDebugCode(response.debugCode ?? null)
      setCooldownSec(response.retryAfterSec ?? 0)
      setNotice({
        tone: 'success',
        message: 'Код отправлен. Обычно SMS приходит в течение минуты.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось отправить код'
      setError(message)
    } finally {
      setIsRequestingOtp(false)
    }
  }

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault()
    await sendOtpRequest()
  }

  const verifyOtp = async (event: FormEvent) => {
    event.preventDefault()
    if (!challengeId) return
    setError(null)
    setNotice(null)
    setIsVerifyingOtp(true)

    try {
      await api('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
          challengeId,
          code: otpCode,
          displayName,
          marketingConsent,
        }),
      })

      setChallengeId(null)
      setOtpCode('')
      setNotice({
        tone: 'success',
        message: 'Вход подтверждён. Личный кабинет открыт.',
      })
      await loadDashboard()
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось подтвердить код'
      setError(message)
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const resendOtp = async () => {
    if (cooldownSec > 0 || isRequestingOtp) return

    try {
      await sendOtpRequest()
    } catch {
      // requestOtp already handles state and messaging
    }
  }

  const updateProfile = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSavingProfile(true)

    try {
      await api('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({
          displayName: profileName,
          email: profileEmail || undefined,
        }),
      })
      await loadDashboard()
      setNotice({
        tone: 'success',
        message: 'Профиль обновлён. Если добавили email, он сохранён как неподтверждённый контакт.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось сохранить профиль'
      setError(message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const addAddress = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSavingAddress(true)

    try {
      await api('/api/me/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label: addressLabel,
          city: addressCity,
          street: addressStreet,
          building: addressBuilding,
          isDefault: addresses.length === 0,
        }),
      })
      setAddressStreet('')
      setAddressBuilding('')
      await loadDashboard()
      setNotice({
        tone: 'success',
        message: 'Адрес сохранён в личном кабинете.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось добавить адрес'
      setError(message)
    } finally {
      setIsSavingAddress(false)
    }
  }

  const deleteAddress = async (id: string) => {
    setError(null)
    setNotice(null)

    try {
      await api(`/api/me/addresses/${id}`, { method: 'DELETE' })
      await loadDashboard()
      setNotice({
        tone: 'warning',
        message: 'Адрес удалён из личного кабинета.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось удалить адрес'
      setError(message)
    }
  }

  const requestExport = async () => {
    setError(null)
    setNotice(null)

    try {
      const payload = await api<Record<string, unknown>>('/api/me/privacy/export', {
        method: 'POST',
      })
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'marconi-account-export.json'
      link.click()
      URL.revokeObjectURL(url)
      setNotice({
        tone: 'success',
        message: 'Экспорт сформирован и скачан в формате JSON.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось экспортировать данные'
      setError(message)
    }
  }

  const requestDeletion = async () => {
    setError(null)
    setNotice(null)

    try {
      await api('/api/me/privacy/delete', {
        method: 'POST',
        body: JSON.stringify({
          reason: 'Запрос создан пользователем из личного кабинета.',
        }),
      })
      setNotice({
        tone: 'warning',
        message: 'Запрос на удаление зарегистрирован. Его должен обработать ответственный сотрудник по регламенту.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось отправить запрос'
      setError(message)
    }
  }

  const revokeMarketing = async () => {
    setError(null)
    setNotice(null)

    try {
      await api('/api/me/privacy/revoke-marketing', {
        method: 'POST',
      })
      await loadDashboard()
      setNotice({
        tone: 'warning',
        message: 'Маркетинговое согласие отозвано. Рекламные рассылки должны быть остановлены.',
      })
    } catch (err) {
      const message = err instanceof Error ? formatErrorMessage(err.message) : 'Не удалось отозвать согласие'
      setError(message)
    }
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setMe(null)
    setOrders([])
    setFavorites([])
    setAddresses([])
    setConsents([])
    setPrivacyRequests([])
    setNotice({
      tone: 'success',
      message: 'Вы вышли из личного кабинета.',
    })
  }

  if (loading) {
    return (
      <div className="account-shell">
        <p className="account-loading">Загружаем личный кабинет…</p>
      </div>
    )
  }

  return (
    <div className="account-shell">
      <div className="account-bg account-bg--top" aria-hidden="true" />
      <div className="account-bg account-bg--bottom" aria-hidden="true" />

      <main className="account container">
        <div className="account-topbar">
          <a href="/" className="account-back">На главную</a>
          {me ? <button className="account-logout" onClick={logout}>Выйти</button> : null}
        </div>

        <header className="account-hero" data-reveal>
          <div className="account-kicker-row">
            <p className="account-kicker">Личный кабинет</p>
            <span className="account-badge">Privacy by design</span>
          </div>
          <h1>{me ? `Здравствуйте, ${me.user.displayName ?? 'друг Маркони'}` : 'Безопасный вход в Маркони'}</h1>
          <p>
            Кабинет для повторных заказов, адресов, избранного и управления согласиями. Собираем
            только то, что нужно для сервиса, и даём пользователю прозрачный контроль над данными.
          </p>

          <div className="account-metrics">
            <div className="account-metric">
              <strong>{orders.length}</strong>
              <span>заказов в истории</span>
            </div>
            <div className="account-metric">
              <strong>{addresses.length}</strong>
              <span>адресов сохранено</span>
            </div>
            <div className="account-metric">
              <strong>{consents.length}</strong>
              <span>событий согласия</span>
            </div>
          </div>
        </header>

        {error ? <p className="account-error">{error}</p> : null}
        {notice ? <p className={`account-notice account-notice--${notice.tone}`}>{notice.message}</p> : null}

        {!me ? (
          <section className="account-auth">
            <div className="account-auth-intro account-card" data-reveal>
              <h2>Как устроен вход</h2>
              <div className="account-steps">
                <div className="account-step">
                  <span>1</span>
                  <div>
                    <strong>Подтверждаем телефон</strong>
                    <p>Используем одноразовый код вместо пароля, чтобы не хранить чувствительные секреты пользователя.</p>
                  </div>
                </div>
                <div className="account-step">
                  <span>2</span>
                  <div>
                    <strong>Фиксируем согласия</strong>
                    <p>Перед входом пользователь видит документы и сам решает, хочет ли получать рекламные сообщения.</p>
                  </div>
                </div>
                <div className="account-step">
                  <span>3</span>
                  <div>
                    <strong>Даём контроль над данными</strong>
                    <p>После входа доступны экспорт, отзыв маркетинга и заявка на удаление персональных данных.</p>
                  </div>
                </div>
              </div>

              <div className="account-legal-links">
                <a href="/legal/privacy">Политика обработки ПДн</a>
                <a href="/legal/marketing">Согласие на рекламу</a>
              </div>
            </div>

            <div className="account-grid">
              <form className="account-card" onSubmit={requestOtp} data-reveal>
                <div className="account-card-head">
                  <div>
                    <p className="account-eyebrow">Шаг 1</p>
                    <h2>Получить код</h2>
                  </div>
                  <span className="account-status account-status--warm">Без пароля</span>
                </div>

                <label>
                  Телефон
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </label>

                <label>
                  Как к вам обращаться
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Иван"
                    autoComplete="name"
                  />
                </label>

                <label className="account-checkbox">
                  <input
                    type="checkbox"
                    checked={personalDataConsent}
                    onChange={(event) => setPersonalDataConsent(event.target.checked)}
                  />
                  <span>
                    Подтверждаю согласие на обработку персональных данных в объёме, необходимом для входа
                    и обслуживания заказов.
                  </span>
                </label>

                <label className="account-checkbox">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(event) => setMarketingConsent(event.target.checked)}
                  />
                  <span>Хочу получать новости и акции Маркони. Это согласие можно отозвать в кабинете в любой момент.</span>
                </label>

                <button className="btn btn--primary" type="submit" disabled={isRequestingOtp || cooldownSec > 0}>
                  {cooldownSec > 0 ? `Повторно через ${cooldownSec} сек` : 'Получить SMS-код'}
                </button>

                <p className="account-note">
                  Для production нужен реальный SMS-провайдер, локализация хранения ПДн в РФ и опубликованные юридические документы.
                </p>
              </form>

              <form className="account-card" onSubmit={verifyOtp} data-reveal>
                <div className="account-card-head">
                  <div>
                    <p className="account-eyebrow">Шаг 2</p>
                    <h2>Подтвердить вход</h2>
                  </div>
                  <span className="account-status account-status--soft">
                    {challengeId ? 'Код отправлен' : 'Ждём запрос'}
                  </span>
                </div>

                <label>
                  Код из SMS
                  <input
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value)}
                    placeholder="123456"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </label>

                <div className="account-inline-meta">
                  <span>Номер: {verifiedPhone ? maskPhone(verifiedPhone) : 'ещё не указан'}</span>
                  <button
                    className="account-inline-action"
                    type="button"
                    onClick={resendOtp}
                    disabled={cooldownSec > 0 || !phone}
                  >
                    {cooldownSec > 0 ? `Отправить ещё раз через ${cooldownSec} сек` : 'Отправить код ещё раз'}
                  </button>
                </div>

                {debugCode ? <p className="account-dev-note">Dev OTP: {debugCode}</p> : null}

                <button className="btn btn--primary" type="submit" disabled={!challengeId || isVerifyingOtp}>
                  {isVerifyingOtp ? 'Проверяем…' : 'Войти'}
                </button>

                <p className="account-note">
                  Если код не пришёл, сначала проверьте правильность номера. Для релиза стоит добавить мониторинг доставки OTP.
                </p>
              </form>
            </div>
          </section>
        ) : (
          <div className="account-dashboard">
            <section className="account-panel" data-reveal>
              <div className="account-panel-nav">
                <a href="#profile" className="account-tab">Профиль</a>
                <a href="#addresses" className="account-tab">Адреса</a>
                <a href="#orders" className="account-tab">Заказы</a>
                <a href="#privacy" className="account-tab">Приватность</a>
              </div>
            </section>

            <div className="account-grid">
              <section id="profile" className="account-card" data-reveal>
                <div className="account-card-head">
                  <div>
                    <p className="account-eyebrow">Профиль</p>
                    <h2>Основные данные</h2>
                  </div>
                  <span className="account-status account-status--warm">{me.user.status}</span>
                </div>

                <form onSubmit={updateProfile} className="account-stack">
                  <label>
                    Имя
                    <input value={profileName} onChange={(event) => setProfileName(event.target.value)} autoComplete="name" />
                  </label>

                  <label>
                    Email для чеков и связи
                    <input
                      value={profileEmail}
                      onChange={(event) => setProfileEmail(event.target.value)}
                      placeholder="name@example.ru"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </label>

                  <div className="account-list">
                    {me.contacts.map((contact) => (
                      <div key={`${contact.type}-${contact.value}`} className="account-row">
                        <span>{contact.type === 'phone' ? 'Телефон' : 'Контакт'}</span>
                        <strong>{contact.value}</strong>
                        <small>{contact.isVerified ? 'Подтверждён' : 'Ожидает подтверждения'}</small>
                      </div>
                    ))}
                  </div>

                  {verifiedEmail && verifiedEmail !== profileEmail ? (
                    <p className="account-note">Сохранённый email: {verifiedEmail}</p>
                  ) : null}

                  <button className="btn btn--primary" type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Сохраняем…' : 'Сохранить профиль'}
                  </button>
                </form>
              </section>

              <section id="addresses" className="account-card" data-reveal>
                <div className="account-card-head">
                  <div>
                    <p className="account-eyebrow">Адресная книга</p>
                    <h2>Доставка без повторного ввода</h2>
                  </div>
                  <span className="account-status account-status--soft">{addresses.length} шт.</span>
                </div>

                <form onSubmit={addAddress} className="account-stack">
                  <label>
                    Название
                    <input value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} />
                  </label>
                  <label>
                    Город
                    <input value={addressCity} onChange={(event) => setAddressCity(event.target.value)} />
                  </label>
                  <label>
                    Улица
                    <input value={addressStreet} onChange={(event) => setAddressStreet(event.target.value)} />
                  </label>
                  <label>
                    Дом
                    <input value={addressBuilding} onChange={(event) => setAddressBuilding(event.target.value)} />
                  </label>
                  <button className="btn btn--primary" type="submit" disabled={isSavingAddress}>
                    {isSavingAddress ? 'Сохраняем…' : 'Добавить адрес'}
                  </button>
                </form>

                <div className="account-list">
                  {addresses.length === 0 ? <p className="account-empty">Адресов пока нет.</p> : null}
                  {addresses.map((address) => (
                    <div key={address.id} className="account-row account-row--action">
                      <div>
                        <span>{address.label}{address.isDefault ? ' · по умолчанию' : ''}</span>
                        <strong>{address.city}, {address.street}, {address.building}</strong>
                      </div>
                      <button className="account-inline-action" type="button" onClick={() => deleteAddress(address.id)}>
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section id="orders" className="account-card" data-reveal>
                <div className="account-card-head">
                  <div>
                    <p className="account-eyebrow">История</p>
                    <h2>Заказы и избранное</h2>
                  </div>
                  <span className="account-status account-status--soft">{favorites.length} в избранном</span>
                </div>

                <div className="account-list">
                  <p className="account-subhead">Заказы</p>
                  {orders.length === 0 ? (
                    <p className="account-empty">История заказов появится после интеграции с системой заказов.</p>
                  ) : null}
                  {orders.map((order) => (
                    <div key={order.id} className="account-row">
                      <span>{formatDate(order.placedAt)}</span>
                      <strong>{order.totalAmount} {order.currency}</strong>
                      <small>{formatOrderStatus(order.status)}{order.externalOrderId ? ` · #${order.externalOrderId}` : ''}</small>
                    </div>
                  ))}

                  <p className="account-subhead">Избранное</p>
                  {favorites.length === 0 ? <p className="account-empty">Избранное пока пусто.</p> : null}
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="account-row">
                      <span>Позиция</span>
                      <strong>{favorite.sku}</strong>
                      <small>Добавлено {formatDate(favorite.createdAt)}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section id="privacy" className="account-card" data-reveal>
                <div className="account-card-head">
                  <div>
                    <p className="account-eyebrow">Приватность</p>
                    <h2>Согласия и запросы</h2>
                  </div>
                  <span className="account-status account-status--warm">
                    {latestMarketingConsent?.granted && !latestMarketingConsent.revokedAt ? 'Маркетинг включён' : 'Маркетинг выключен'}
                  </span>
                </div>

                <div className="account-list">
                  {consents.map((consent) => (
                    <div key={consent.id} className="account-row">
                      <span>{formatConsentType(consent.consentType)}</span>
                      <strong>{consent.granted ? 'Согласие дано' : 'Согласие отозвано'}</strong>
                      <small>
                        Версия {consent.documentVersion} · {formatDate(consent.grantedAt)}
                        {consent.revokedAt ? ` · отзыв ${formatDate(consent.revokedAt)}` : ''}
                      </small>
                    </div>
                  ))}
                </div>

                <div className="account-legal-links">
                  <a href="/legal/privacy">Политика обработки ПДн</a>
                  <a href="/legal/marketing">Маркетинговое согласие</a>
                </div>

                <div className="account-actions">
                  <button className="btn btn--outline" type="button" onClick={requestExport}>Экспорт данных</button>
                  <button className="btn btn--outline" type="button" onClick={revokeMarketing}>Отозвать маркетинг</button>
                  <button className="btn btn--outline" type="button" onClick={requestDeletion}>Запросить удаление</button>
                </div>

                <div className="account-list">
                  <p className="account-subhead">История privacy-запросов</p>
                  {privacyRequests.length === 0 ? (
                    <p className="account-empty">Вы ещё не создавали запросы на экспорт или удаление данных.</p>
                  ) : null}
                  {privacyRequests.map((request) => (
                    <div key={request.id} className="account-row">
                      <span>{formatPrivacyRequestType(request.requestType)}</span>
                      <strong>{formatPrivacyRequestStatus(request.status)}</strong>
                      <small>
                        Создан {formatDate(request.createdAt)}
                        {request.completedAt ? ` · завершён ${formatDate(request.completedAt)}` : ''}
                        {request.payload?.reason ? ` · ${request.payload.reason}` : ''}
                      </small>
                    </div>
                  ))}
                </div>

                <p className="account-note">
                  По 152-ФЗ и 38-ФЗ эти действия требуют не только интерфейса, но и внутреннего регламента обработки запросов и остановки рассылок.
                </p>
                {privacyContactEmail ? (
                  <p className="account-note">
                    Канал для privacy-обращений: <a href={`mailto:${privacyContactEmail}`}>{privacyContactEmail}</a>
                  </p>
                ) : null}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
