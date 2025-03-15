"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdLinkedCamera } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { errorHandler } from "@/app/utils/helper";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  groupProfile: z
    .any()
    .refine((file) => file?.type.startsWith("image/"), {
      message: "Please upload a valid image.",
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "Image size should be less than 5MB.",
    })
    .refine((file) => Boolean(file), {
      message: "Image is required.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateGroupForm() {
  const queryClient = useQueryClient();
  const { data: authData } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      formData.append("groupName", data.groupName);
      formData.append("description", data.description);
      formData.append("groupPic", data.groupProfile);

      const res = await axios.post(`${API}/chats/create-group`, formData, {
        headers: {
          Authorization: `Bearer ${authData?.user.accessToken}`,
        },
      });

      if (res.data.success) {
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGroups"] });
      queryClient.invalidateQueries({ queryKey: ["allChats"] });
    },
  });

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "Mern Stack Developement Group",
      description: "This group is for Mern stack related talks.",
      groupProfile: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("groupProfile", file);
      form.clearErrors("groupProfile");
    }
  };

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    try {
      setLoading(true);
      mutation.mutate(data);
      router.push(`/group`)
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-1 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl mb-6 font-bold text-center">
            Create New Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Group Name Field */}

              {/* Group Image Field - now required */}
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <Input
                    type="file"
                    id="groupImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    className="w-[120px] h-[120px] rounded-full border flex items-center justify-center"
                    onClick={() =>
                      document.getElementById("groupImage")?.click()
                    } // Trigger file input on div click
                  >
                    {form.watch("groupProfile") ? (
                      <img
                        src={URL.createObjectURL(form.watch("groupProfile"))}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <MdLinkedCamera className="text-xl text-gray-500" />
                    )}
                  </div>
                </div>
                {form.formState.errors.groupProfile && (
                  <p className="text-red-500 text-center text-xs">
                    {form.formState.errors.groupProfile?.message?.toString()}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose of this group"
                        rows={3}
                        className="max-h-[250px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} type="submit" className="w-full">
                {
                  loading ? "Creating..." : " Create Group"
                }

              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
