'use client';

import { useEffect, useRef } from 'react';

interface VakifbankAcsFormProps {
  actionUrl: string;
  paReq: string;
  termUrl: string;
  md: string;
}

export function VakifbankAcsForm({
  actionUrl,
  paReq,
  termUrl,
  md,
}: VakifbankAcsFormProps): React.ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form ref={formRef} id="vakifbank-acs-form" method="POST" action={actionUrl}>
      <input type="hidden" name="PaReq" value={paReq} />
      <input type="hidden" name="TermUrl" value={termUrl} />
      <input type="hidden" name="MD" value={md} />
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-xl bg-primary-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
      >
        Banka doğrulama ekranına devam et
      </button>
    </form>
  );
}
