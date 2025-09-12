'use server';

import { revalidatePath } from 'next/cache';

async function revalidateCampuses() {
  return revalidatePath('/encuesta', 'page');
}

export default revalidateCampuses;
