import { Card } from '@/components/ui/Card';

export default function SuspendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto">
      <Card className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-black uppercase">Account Suspended</h1>
        <p className="text-sm leading-relaxed">
          Your account has been suspended due to a violation of our community guidelines.
          If you believe this is a mistake, please contact support.
        </p>
        <div className="w-16 h-16 border-4 border-black bg-neo-pink neo-shadow flex items-center justify-center">
          <span className="text-3xl font-black">!</span>
        </div>
      </Card>
    </div>
  );
}
