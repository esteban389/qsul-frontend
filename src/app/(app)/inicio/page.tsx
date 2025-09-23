'use client';

import AlertsCenter from '@/components/AlertsCenter';
import useAuth from '@/hooks/useAuth';
import SurveyStats from './SurveyStats';
import { Role } from '@/types/user';
import useOfficeUrl from './useOfficeUrl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadURI } from '@/lib/utils';
import { LoaderCircle, Copy, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';

function HomePage() {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <main className="mx-4 flex h-full flex-col gap-8 lg:mx-auto px-0">
      <h1 className="w-full text-center text-3xl font-bold">
        Bienvenido {user?.name}
      </h1>
      <div className='flex flex-col gap-4 w-full p-0 md:p-4'>
        <div className='flex flex-col gap-4 w-full lg:flex-row'>
          <SurveyStats />
          <OfficeQRCode />
        </div>
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
    <Card className="w-full lg:w-80 xl:w-96">
      <CardHeader>
        <CardTitle>Código QR de la oficina</CardTitle>
        <CardDescription>
          Comparte este código QR para acceder a la encuesta de tu oficina
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OfficeQRCodeContent url={url?.url} />
      </CardContent>
    </Card>
  );
}

function OfficeQRCodeContent({ url }: { url: string | undefined }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    const toDataUrl = async () => {
      const result = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setDataUrl(result);
    };
    if (url) {
      toDataUrl();
    }
  }, [url]);

  if (!dataUrl) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(url));
    toast.info('URL copiada al portapapeles');
  };

  const downloadQR = () => {
    downloadURI(dataUrl, 'codigo-qr-oficina.png');
    toast.success('Código QR descargado');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center p-4 bg-white rounded-lg border">
        <img src={dataUrl} alt="Código QR de la oficina" className="w-48 h-48" />
      </div>
      <div className="flex flex-col w-full gap-2 sm:flex-row">
        <Button onClick={copyToClipboard} variant="outline" className="flex-1">
          <Copy className="mr-2 h-4 w-4" />
          Copiar URL
        </Button>
        <Button onClick={downloadQR} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
