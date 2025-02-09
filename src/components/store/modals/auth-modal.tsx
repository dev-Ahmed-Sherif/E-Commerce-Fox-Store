"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import Modal from "@/components/ui/model";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Login } from "@/actions/auth";

import { LoginSchema } from "@/schemas";

import { useAuthModal } from "@/hooks/use-auth-modal";

export function AuthModal() {
  const storeModal = useAuthModal();

  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      Login(values)
        .then((data) => {
          // console.log(data);
          // toast({
          //   description: "🎉 Login Successfully.",
          // });
          // router.refresh();
          setTimeout(() => {
            router.push("/dashboard");
          }, 700);
        })
        .catch((err) => {
          console.log(err.message, typeof err.message);
          if (err.message.includes("401") || err.message.includes("404")) {
            toast({
              variant: "destructive",
              title: "حدث خطأ !",
              description: "الأسم أو رقم الهاتف أو الباسورد غير صحيح",
              action: (
                <ToastAction altText="Try again">حاول مره اخرى</ToastAction>
              ),
            });
          } else {
            toast({
              variant: "destructive",
              title: "حدث خطأ !",
              description: "حدث خطأ مجهول",
              action: (
                <ToastAction altText="Try again">حاول مره اخرى</ToastAction>
              ),
            });
          }
        });
    });
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new Store to manage Products and Categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
          <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="my-4">
                          <FormLabel>الاسم أو رقم الهاتف المحمول</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="john.doe@example.com"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="my-4">
                          <div className="flex items-center">
                            <FormLabel>كلمة المرور</FormLabel>
                            <Link
                              href="/reset"
                              className="mr-auto inline-block text-sm underline"
                            >
                              {/* Forgot Password ? */}
                              هل نسيت كلمة المرور ؟
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="*********"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="w-full my-4 font-semibold text-lg"
                    >
                      تسجيل الدخول
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء حساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="my-4">
                          <FormLabel>الاسم أو رقم الهاتف المحمول</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="john.doe@example.com"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="my-4">
                          <div className="flex items-center">
                            <FormLabel>كلمة المرور</FormLabel>
                            <Link
                              href="/reset"
                              className="mr-auto inline-block text-sm underline"
                            >
                              {/* Forgot Password ? */}
                              هل نسيت كلمة المرور ؟
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="*********"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="w-full my-4 font-semibold text-lg"
                    >
                      تسجيل الدخول
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
