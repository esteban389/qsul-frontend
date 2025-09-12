'use server';

import { revalidatePath } from 'next/cache';

async function revalidateProcesses() {
  return revalidatePath('/encuesta/[seccional]', 'page');
}

export default revalidateProcesses;
