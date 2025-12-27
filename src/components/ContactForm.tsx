"use client";

import { useId, useMemo, useState } from "react";

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({ toEmail }: { toEmail: string }) {
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors: FieldErrors = useMemo(() => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Unesite ime.";
    if (!email.trim()) next.email = "Unesite email.";
    else if (!isValidEmail(email.trim())) next.email = "Email nije ispravan.";
    if (!message.trim()) next.message = "Unesite poruku.";
    return next;
  }, [email, message, name]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    const subjectText = subject.trim() || `Upit sa sajta — ${name.trim()}`;
    const body = [
      `Ime: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    const mailto = `mailto:${toEmail}?subject=${encodeURIComponent(
      subjectText
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  const show = (key: keyof FieldErrors) => submitted && errors[key];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="text-sm font-medium">
            Ime *
          </label>
          <input
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-sky-500/30 placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.03]"
            aria-invalid={Boolean(show("name"))}
            aria-describedby={show("name") ? `${nameId}-error` : undefined}
            placeholder="Vaše ime"
            autoComplete="name"
          />
          {show("name") ? (
            <div id={`${nameId}-error`} className="mt-1 text-xs text-rose-600">
              {errors.name}
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor={emailId} className="text-sm font-medium">
            Email *
          </label>
          <input
            id={emailId}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-sky-500/30 placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.03]"
            aria-invalid={Boolean(show("email"))}
            aria-describedby={show("email") ? `${emailId}-error` : undefined}
            placeholder="vaš@email.com"
            autoComplete="email"
            inputMode="email"
          />
          {show("email") ? (
            <div id={`${emailId}-error`} className="mt-1 text-xs text-rose-600">
              {errors.email}
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={subjectId} className="text-sm font-medium">
          Naslov
        </label>
        <input
          id={subjectId}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-sky-500/30 placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.03]"
          placeholder="Npr. Ponuda za panelne filtere"
        />
      </div>

      <div>
        <label htmlFor={messageId} className="text-sm font-medium">
          Poruka *
        </label>
        <textarea
          id={messageId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 min-h-32 w-full resize-y rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-sky-500/30 placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.03]"
          aria-invalid={Boolean(show("message"))}
          aria-describedby={show("message") ? `${messageId}-error` : undefined}
          placeholder="Ukratko opišite potrebe (dimenzije, klasa, količina, rok...)."
        />
        {show("message") ? (
          <div id={`${messageId}-error`} className="mt-1 text-xs text-rose-600">
            {errors.message}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
        >
          Pošalji (otvara email)
        </button>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Ako se email klijent ne otvori, pišite direktno na{" "}
          <a className="font-medium hover:underline" href={`mailto:${toEmail}`}>
            {toEmail}
          </a>
          .
        </div>
      </div>
    </form>
  );
}

