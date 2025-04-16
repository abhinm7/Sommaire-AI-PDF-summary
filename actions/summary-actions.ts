"use server";

import { getDbConnection } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function deleteSummary({ summaryId }: { summaryId: string }) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            throw new Error('User not found');
        }

        const sql = await getDbConnection();

        // delete from db
        const result = await sql`
      DELETE FROM pdf_summaries 
      WHERE id = ${summaryId} AND user_id = ${userId} 
      RETURNING id;
    `;

    if(result.length>0){
        revalidatePath('/dashbard')
        return {success:true}
    }
    return {success:false}

        // revalidatePath
    } catch (error) {
        console.log("Error deleting summary",error);
        
        return {success:false}
     }
}
