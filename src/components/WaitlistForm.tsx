'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { validateWaitlist, type WaitlistErrorCode } from '@/lib/waitlist';
import styles from './WaitlistForm.module.css';

type FieldErrors = { contact?: WaitlistErrorCode; consent?: WaitlistErrorCode };
type Status = 'idle' | 'sending' | 'success';
type FormError = 'unavailable' | 'network' | 'generic';

export function WaitlistForm() {
  const t = useTranslations('waitlist');
  const locale = useLocale();
  const id = useId();
  const contactRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<FormError | null>(null);

  const contactId = `${id}-contact`;
  const contactHintId = `${id}-contact-hint`;
  const contactErrorId = `${id}-contact-error`;
  const consentId = `${id}-consent`;
  const consentErrorId = `${id}-consent-error`;

  function focusFirstError(errors: FieldErrors) {
    if (errors.contact) contactRef.current?.focus();
    else if (errors.consent) consentRef.current?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = new FormData(event.currentTarget);
    const payload = {
      contact: String(form.get('contact') ?? ''),
      consent: form.get('consent') === 'on',
      website: String(form.get('website') ?? ''),
    };

    setFormError(null);
    const local = validateWaitlist(payload);
    if (!local.ok) {
      setFieldErrors(local.errors);
      focusFirstError(local.errors);
      return;
    }
    setFieldErrors({});
    setStatus('sending');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...payload, locale }),
      });
      if (response.ok) {
        setStatus('success');
        return;
      }
      setStatus('idle');
      if (response.status === 503) {
        setFormError('unavailable');
      } else if (response.status === 422) {
        const body = (await response.json().catch(() => null)) as { errors?: FieldErrors } | null;
        const errors = body?.errors ?? {};
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) focusFirstError(errors);
        else setFormError('generic');
      } else {
        setFormError('generic');
      }
    } catch {
      setStatus('idle');
      setFormError('network');
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className={styles.success}>
        {t('success')}
      </p>
    );
  }

  const hasErrors = Boolean(fieldErrors.contact || fieldErrors.consent || formError);

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {hasErrors && (
        <div role="alert" className={styles.alert}>
          {formError ? t(`errors.${formError}`) : t('errors.summary')}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor={contactId} className={styles.label}>
          {t('contactLabel')}
        </label>
        <input
          ref={contactRef}
          id={contactId}
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="email tel"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          className={styles.input}
          aria-invalid={fieldErrors.contact ? true : undefined}
          aria-describedby={
            fieldErrors.contact ? `${contactHintId} ${contactErrorId}` : contactHintId
          }
        />
        <p id={contactHintId} className={styles.hint}>
          {t('contactHint')}
        </p>
        {fieldErrors.contact && (
          <p id={contactErrorId} className={styles.error}>
            {t(`errors.${fieldErrors.contact}`)}
          </p>
        )}
      </div>

      {/* Champ piège anti-spam : invisible et hors parcours clavier. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          {t('honeypotLabel')}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.field}>
        <div className={styles.consent}>
          <input
            ref={consentRef}
            id={consentId}
            name="consent"
            type="checkbox"
            className={styles.checkbox}
            aria-invalid={fieldErrors.consent ? true : undefined}
            aria-describedby={fieldErrors.consent ? consentErrorId : undefined}
          />
          <label htmlFor={consentId} className={styles.consentLabel}>
            {t('consent')}{' '}
            <span>
              {t('privacyLinkPrefix')} <Link href="/legal/confidentialite">{t('privacyLink')}</Link>
              .
            </span>
          </label>
        </div>
        {fieldErrors.consent && (
          <p id={consentErrorId} className={styles.error}>
            {t(`errors.${fieldErrors.consent}`)}
          </p>
        )}
      </div>

      <button type="submit" className="button" disabled={status === 'sending'}>
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
