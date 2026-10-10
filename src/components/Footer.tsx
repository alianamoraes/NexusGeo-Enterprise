import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-center gap-2 px-6 py-4 border-t text-xs text-muted"
      style={{ borderColor: 'var(--c-border)' }}
    >
      <span>Desenvolvido por</span>
      <span className="font-medium text-secondary">Aliana Moraes</span>
      <Heart className="w-3 h-3 text-accent-400/60" />
    </footer>
  );
}
