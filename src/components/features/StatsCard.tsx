import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number | undefined | null;
  subtitle?: string;
  color?: 'yellow' | 'blue' | 'pink' | 'green';
}

const colorMap = {
  yellow: 'bg-neo-yellow',
  blue: 'bg-neo-blue',
  pink: 'bg-neo-pink',
  green: 'bg-neo-green',
};

export const StatsCard = ({ title, value, subtitle, color = 'yellow' }: StatsCardProps) => {
  return (
    <Card className={`${colorMap[color]} flex flex-col gap-1`} padding="sm">
      <p className="text-xs font-bold uppercase tracking-wider text-black/60">{title}</p>
      <p className="text-3xl font-black">{value ?? '—'}</p>
      {subtitle && <p className="text-xs font-medium text-black/50">{subtitle}</p>}
    </Card>
  );
};
