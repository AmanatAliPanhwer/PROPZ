'use client'

import { useActionState } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createThank } from '@/lib/actions';

interface ThankFormProps {
  senderId: string;
  workers: { id: string; name: string; profession: string | null }[];
  tags: { id: string; name: string }[];
  preselectedReceiverId?: string;
}

export const ThankForm = ({ senderId, workers, tags, preselectedReceiverId }: ThankFormProps) => {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set('senderId', senderId);
      try {
        await createThank(formData);
      } catch (e) {
        return { error: e instanceof Error ? e.message : 'Something went wrong' };
      }
      return { error: null };
    },
    { error: null }
  );

  return (
    <Card>
      <h2 className="text-xl font-black uppercase mb-4">Send a Thank You</h2>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="receiverId" className="font-bold text-sm uppercase tracking-wide">
            To (Worker)
          </label>
          <select
            id="receiverId"
            name="receiverId"
            required
            defaultValue={preselectedReceiverId || ''}
            className="w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all appearance-none"
          >
            <option value="">Select a worker...</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}{w.profession ? ` — ${w.profession}` : ''}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="Thank You Note"
          name="note"
          placeholder="Write your appreciation..."
          rows={4}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm uppercase tracking-wide">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-card text-sm font-bold cursor-pointer hover:bg-neo-yellow transition-colors"
              >
                <input type="checkbox" name="tags" value={tag.name} className="accent-black" />
                #{tag.name}
              </label>
            ))}
          </div>
        </div>

        {state?.error && (
          <p className="text-sm font-bold text-neo-pink">{state.error}</p>
        )}

        <Button type="submit" variant="primary" disabled={pending} fullWidth>
          {pending ? 'Sending...' : 'Send Thank You'}
        </Button>
      </form>
    </Card>
  );
};
