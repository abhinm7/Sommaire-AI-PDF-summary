'use server'

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractText } from "@/lib/langchain";
import generateSummaryFromOpenAI from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface pdfSummaryType {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}

export async function   generatePdfText({
    fileUrl,
}:{
    fileUrl:string,
}){
    if (!fileUrl) {
        return {
            success: false,
            message: "upload failed",
            data: null,
        };
    }

    try {
        const pdfText = await fetchAndExtractText(fileUrl);
        console.log("text :", pdfText);

        let summary;

        if (!pdfText) {
            return {
                success: false,
                message: 'Failed to fetch and extract PDF text',
                data: null,
            };
        }

        return {
            success: true,
            message: 'PDF Text generated successfully',
            data: {
                pdfText
            }
        };
    } catch (error) {
        console.error("Error fetch and extract PDF", error);
        return {
            success: false,
            message: "upload failed",
            data: null
        };
    }
}

export async function generatePdfSummary({ pdfText, fileName }: { pdfText: string,fileName:string }) {


    try {

        let summary;
        try {
            summary = await generateSummaryFromGemini(pdfText);
            console.log("summary from gemini :", summary);

        } catch (geminiError) {
            console.error(
                'Gemini API failed after OpenAI quote exceeded',
                geminiError
            );
        }

        // try {
        //     summary = await generateSummaryFromOpenAI(pdfText);
        //     console.log("summary :", summary);

            

        // } catch (error: any) {
        //     console.error("Error generating summary from OpenAI:", error);
        // }

        if (!summary) {
            return {
                success: false,
                message: 'Failed to generate summary',
                data: null,
            };
        }

        return {
            success: true,
            message: 'Summary generated successfully',
            data: {
                title: fileName,
                summary,
            }
        };

    } catch (error) {
        console.error("Failed to Generate", error);
        return {
            success: false,
            message: "file upload failed",
            data: null
        };
    }
}

async function savePdfSummary({ userId, fileUrl, summary, title, fileName }: pdfSummaryType) {
    //sql inserting pdf summary
    try {
        const sql = await getDbConnection();
        const [savedSummary] = await sql`
          INSERT INTO pdf_summaries (
            user_id,
            original_file_url,
            summary_text,
            title,
            file_name
          ) VALUES (
            ${userId},
            ${fileUrl},
            ${summary},
            ${title},
            ${fileName}
          ) RETURNING id, summary_text`;
        return savedSummary;
    } catch (error) {
        console.error('Error saving PDF summary', error);
        throw error;
    }
}

export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName
}: pdfSummaryType) {
    // user has logged in and has a user id
    //save pdf summary  
    //save pdf sumamary function
    let savedSummary: any;
    try {
        const { userId } = await auth();
        if (!userId) {
            return {
                return: false,
                message: "User not found",
            }
        }
        savedSummary = await savePdfSummary(
            {
                userId,
                fileUrl,
                summary,
                title,
                fileName
            }
        );
        if (!savedSummary) {
            return {
                return: false,
                message: "Failed to save pdf summary",
            }
        }


    } catch (error) {
        return {
            return: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        }
    }


    //revalidate
    revalidatePath(`/summary/${savedSummary.id}`);


    return {
        success: true,
        message: "Pdf summary saved successfully",
        data: {
            id: savedSummary.id
        }
    }

}