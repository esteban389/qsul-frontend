'use server';

import { revalidatePath } from 'next/cache';

async function revalidateServices() {
  return revalidatePath('/encuesta/[seccional]/[proceso]/[empleado]', 'page');
}

export default revalidateServices;
