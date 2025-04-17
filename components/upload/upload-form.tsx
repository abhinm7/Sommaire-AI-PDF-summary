'use client'

import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "sonner";
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";

const formSchema = z.object({
  file: z.instanceof(File, { message: "File is invalid" }).refine((file) => file.size <= 24 * 1024 * 1024, { message: "File size must be less than 24MB" }).refine((file) => file.type === "application/pdf", { message: "File must be a PDF" })
})

export default function UploadForm() {

  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
      toast.success("File upload success")
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast.error("File upload failed")
    },
    onUploadBegin: (data) => {
      console.log("upload has begun for");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      console.log("Submitted :", file.type);
      toast("File submitted")

      // validating the fields
      const validatedFields = formSchema.safeParse({ file });

      // schema with zod
      if (!validatedFields.success) {
        toast.error("Something went wrong")
        setIsLoading(false);
        return;
      }




      const uploadResponse = await startUpload([file]);
      if (!uploadResponse) {
        toast.error("Something went wrong,please use a different file")
        setIsLoading(false);
        return;
      }

      toast("uploading your PDF ...")
      // upload the file to uploadthing

      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

      const result = await generatePdfSummary({
        fileUrl:uploadResponse[0].serverData.fileUrl,
        fileName:file.name,
      });

      console.log("summary :", result);

      const { data = null, message = null } = result || {};

      if (data) {
        let storeResult:any
        toast("Data is Saving ...")
        
        if(data.summary){
         storeResult = await storePdfSummaryAction({
            fileUrl: uploadFileUrl,
            summary: data.summary,
            title: data.title,
            fileName: file.name
          })
          toast.success("Summary Genarated! ✨")
          formRef.current?.reset();
          
          
          //redirect to the [id] summary page 
          //saving summary to the database
          router.push(`/summaries/${storeResult.data.id}`);
          
        }


        // parse the pdf using lang chain
        // summarize the pdf using AI
        // save the summary to the database
        // redirect to the [id] summary page

      }
    } catch (error) {

      setIsLoading(false);

      console.log("error", error);

      formRef.current?.reset();
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />

      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton/>
        </>
      )}
    </div>
   );

}
