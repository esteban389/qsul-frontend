'use client';

import AlertsCenter from '@/components/AlertsCenter';
import useAuth from '@/hooks/useAuth';
import SurveyStats from './SurveyStats';
import { Role } from '@/types/user';
import useOfficeUrl from './useOfficeUrl';
import { Button } from '@/components/ui/button';
import { downloadURI } from '@/lib/utils';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

function HomePage() {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <main className="mx-4 flex h-full flex-col gap-8 lg:mx-auto px-0">
      <h1 className="w-full text-center text-3xl font-bold">
        Bienvenido {user?.name}
      </h1>
      <OfficeQRCode />
      <div className='flex flex-col gap-4 w-full p-0 md:flex-row md:p-4'>
        <SurveyStats />
        <AlertsCenter />
      </div>
    </main>
  );
}

function OfficeQRCode() {
  const { user } = useAuth({ middleware: 'auth' });
  if (user?.role !== Role.CAMPUS_COORDINATOR && user?.role !== Role.PROCESS_LEADER) {
    return null;
  }

  const { data: url } = useOfficeUrl();
  return (
    <div className='flex flex-col gap-4 w-full p-0 md:p-4'>
      <h2 className='text-xl font-bold text-center'>Código QR de la oficina</h2>
      <OfficeQRCodeContent url={url?.url} />
    </div>
  );
}

function OfficeQRCodeContent({ url }: { url: string | undefined }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    const toDataUrl = async () => {
      const result = await QRCode.toDataURL(url);
      setDataUrl(result);
    };
    if (url) {
      toDataUrl();
    }
  }, [url]);

  if (!dataUrl) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <LoaderCircle className="size-12 animate-spin" />
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(url));
    toast.info('Código QR copiado al portapapeles');
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <img src={dataUrl} alt="QR Code" />
      <Button onClick={() => copyToClipboard()}>
        Copiar
      </Button>
      <Button onClick={() => downloadURI(dataUrl, `Código QR de la oficina`)}>
        Descargar
      </Button>
    </div>
  );
}

export default HomePage;
