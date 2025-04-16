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

// export async function getPdfText({
//     fileUrl,
//     fileName
// }:{
//     fileUrl:string,
//     fileName:string
// }){

// }

export async function generatePdfSummary(uploadResponse: [{
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        }
    }
}]) {
    if (!uploadResponse) {
        return {
            success: false,
            message: "upload failed",
            data: null,
        };
    }
    const {
        serverData: {
            userId,
            file: { url: pdfUrl, name: fileName }
        },
    } = uploadResponse[0];

    if (!pdfUrl) {
        return {
            success: false,
            message: "upload failed",
            data: null
        }
    }

    try {
        const pdfText = await fetchAndExtractText(pdfUrl);
        console.log("text :", pdfText);

        let summary;
        try {
            summary = await generateSummaryFromOpenAI(pdfText);
            console.log("summary :", summary);
        } catch (error: any) {
            console.error("Error generating summary from OpenAI:", error);

            if (error instanceof Error && error.message === 'Rate limit exceeded') {
                try {
                    summary = await generateSummaryFromGemini(pdfText);
                    console.log("summary from gemini :", summary);

                } catch (geminiError) {
                    console.error(
                        'Gemini API failed after OpenAI quote exceeded',
                        geminiError
                    );

                    throw new Error(
                        'Failed to generate summary with available AI providers'
                    );
                }
            }
        }

        if (!summary) {
            return {
                success: false,
                message: 'Failed to generate summary',
                data: null,
            };
        }

        const formattedName = formatFileNameAsTitle(fileName);
        return {
            success: true,
            message: 'Summary generated successfully',
            data: {
                title: fileName,
                summary,
            }
        };
    } catch (error) {
        console.error("Error fetching and extracting text", error);
        return {
            success: false,
            message: "upload failed",
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