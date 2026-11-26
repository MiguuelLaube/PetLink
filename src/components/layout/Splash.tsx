import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { readLocal, writeLocal } from '@/lib/storage';

const KEY = 'petlink:splash-visto';

/** Vídeo do logo na primeira visita; botão Pular e Esc fecham. */
export function Splash() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => !readLocal<boolean>(KEY, false) && !navigator.webdriver);
  const [leaving, setLeaving] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  const close = () => {
    writeLocal(KEY, true);
    setLeaving(true);
    window.setTimeout(() => setShow(false), 350);
  };

  useEffect(() => {
    if (!show) return;
    btn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const timer = reduce ? window.setTimeout(close, 1800) : undefined;
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, reduce]);

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Abertura PetLink"
      className={`fixed inset-0 z-[60] grid place-items-center bg-[#efe8e2] transition-opacity duration-300 ${leaving ? 'opacity-0' : 'opacity-100'}`}
    >
      {reduce ? (
        <img src="/brand/logo.webp" alt="PetLink — Conexão e amor animal" className="w-64" />
      ) : (
        <video
          className="h-full w-full object-contain"
          autoPlay
          muted
          playsInline
          poster="/brand/splash-poster.webp"
          onEnded={close}
          aria-label="Animação do logo PetLink"
        >
          <source src="/brand/splash.webm" type="video/webm" />
          <source src="/brand/splash.mp4" type="video/mp4" />
        </video>
      )}
      <button
        ref={btn}
        type="button"
        onClick={close}
        className="absolute bottom-8 right-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-cream shadow-soft hover:bg-primary-hover"
      >
        Pular
      </button>
    </div>
  );
}
