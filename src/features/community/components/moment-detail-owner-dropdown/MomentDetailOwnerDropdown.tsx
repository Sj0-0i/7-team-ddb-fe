'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { deleteMoment } from '../../api';

import { Button } from '@/shared/components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components';
import { useToast } from '@/shared/hooks';
import { useConfirmDialogStore } from '@/shared/store';

interface MomentDetailOwnerDropdownProps {
  momentId: number;
}

export function MomentDetailOwnerDropdown({
  momentId,
}: MomentDetailOwnerDropdownProps) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const openDialog = useConfirmDialogStore((s) => s.openDialog);

  const handleEdit = () => {
    router.push(`/moments/${momentId}/edit`);
  };

  const handleDelete = async () => {
    const ok = await openDialog({
      title: '기록 삭제',
      description: '기록을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      confirmButtonClassName: 'bg-destructive text-white',
    });

    if (!ok) return;

    try {
      await deleteMoment(momentId);
      showSuccessToast('기록이 삭제되었습니다.');
      router.replace('/moments');
    } catch (error) {
      console.error(error);
      showErrorToast('기록 삭제에 실패했습니다.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          수정하기
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          삭제하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
