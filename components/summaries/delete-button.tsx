'use client'

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from 'react';
import { deleteSummary } from '@/actions/summary-actions';
import { toast } from 'sonner';

interface DeleteButtonProps {
  summaryId: string;
}

export default function DeleteButton({ summaryId }: DeleteButtonProps) {

  const handleDelete = async () => {
    //Delete Summary
    startTransition(async () => {
      const result = await deleteSummary({ summaryId });
      if (!result.success) {
        toast.error("Failed to delete Summary")
      }
      setopen(false);
    })

  }

  const [open, setopen] = useState(false)
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size="icon"
          className="text-gray-400 !bg-gray-50 border border-gray-200 hover:text-white-600 hover:!bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete summary?This action can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setopen(false)}
            variant="ghost"
            className="
    !bg-gray-50 border 
    border-gray-200 
    hover:text-gray-600 
    hover:!bg-gray-100
  "
          >
            Cancel
          </Button>

          <Button onClick={handleDelete}
            variant="destructive"
            className="
    !bg-gray-900 
    hover:!bg-gray-600
  "
          >
            {isPending?'Deleting...':'Delete'} 
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>

  );
}