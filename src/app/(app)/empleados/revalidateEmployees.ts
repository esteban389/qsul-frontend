'use server';

import { revalidatePath } from 'next/cache';

async function revalidateEmployees() {
  return revalidatePath('/encuesta/[seccional]/[proceso]', 'page');
}

export default revalidateEmployees;
