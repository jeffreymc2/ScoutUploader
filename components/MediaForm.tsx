// // app/components/MediaForm.tsx
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { supabaseServer } from "@/lib/supabase/server";
// import { Post } from "@/lib/types/types";

// const mediaFormSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().optional(),
//   featured_image: z.boolean().default(false),
// });

// type MediaFormData = z.infer<typeof mediaFormSchema>;

// interface MediaFormProps {
//   postId: string;
// }

// export default function MediaForm({ postId }: MediaFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<MediaFormData>({
//     resolver: zodResolver(mediaFormSchema),
//   });

//   const onSubmit = async (formData: MediaFormData) => {
//     try {
//       const supabase = supabaseServer();

//       const updateData: Partial<Post> = {
//         title: formData.title,
//         description: formData.description,
//         featured_image: formData.featured_image,
//       };

//       const { data, error } = await supabase
//         .from("posts")
//         .update(updateData)
//         .eq("id", postId)
//         .single();

//       if (error) {
//         throw error;
//       }

//       toast({
//         title: "Post updated",
//         description: "The post has been updated successfully.",
//         variant: "success",
//       });
//     } catch (error) {
//       console.error("Error updating post:", error);
//       toast({
//         title: "Error",
//         description: "An error occurred while updating the post.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="mt-4">
//         <Label htmlFor="title">Title</Label>
//         <Input id="title" {...register("title")} className="mt-1" />
//         {errors.title && <p className="text-red-500">{errors.title.message}</p>}
//       </div>
//       <div className="mt-4">
//         <Label htmlFor="description">Description</Label>
//         <Textarea id="description" {...register("description")} className="mt-1" />
//       </div>
//       <div className="mt-4 flex items-center space-x-2">
//         <Switch id="featured_image" {...register("featured_image")} />
//         <Label htmlFor="featured_image">Featured Image</Label>
//       </div>
//       <div className="mt-4">
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </form>
//   );
// }