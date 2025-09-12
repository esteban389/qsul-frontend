import { Audit } from '@/types/audit';
import { TableCell } from '@/components/ui/table';
import { Row, flexRender } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/modal';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { mapAuditableTypeToText } from '@/lib/mappings';
import useIsMobile from '@/hooks/use-mobile';

const AuditRow = ({ row }: { row: Row<Audit> }) => {
  const isMobile = useIsMobile();
  return (
    <motion.tr
      layoutId={`row-${row.original.id}`}
      key={`row-${row.original.id}`}
      className={`cursor-pointer bg-background hover:bg-muted ${
        row.getIsSelected() ? 'selected' : ''
      }`}>
      <Credenza>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>
            <CredenzaTrigger>
              <motion.div>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </motion.div>
            </CredenzaTrigger>
          </TableCell>
        ))}
        <CredenzaContent className="max-h-full w-full max-w-full p-8 md:size-fit">
          <CredenzaTitle>Comparar valores</CredenzaTitle>
          <CredenzaDescription>
            Comparar valores antes y después del evento{' '}
            <span className="font-bold">
              &ldquo;{row.original.event}&ldquo;
            </span>{' '}
            del recurso de tipo{' '}
            <span> {mapAuditableTypeToText(row.original.auditable_type)}</span>
          </CredenzaDescription>
          {isMobile ? (
            <ReactDiffViewer
              oldValue={row.original.old_values}
              newValue={row.original.new_values}
              compareMethod={DiffMethod.LINES}
              splitView={false}
            />
          ) : (
            <ReactDiffViewer
              leftTitle="Valor anterior"
              rightTitle="Valor nuevos"
              oldValue={row.original.old_values}
              newValue={row.original.new_values}
              compareMethod={DiffMethod.LINES}
              splitView
            />
          )}
        </CredenzaContent>
      </Credenza>
    </motion.tr>
  );
};

export default AuditRow;
