"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  import { toast } from "sonner"
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { Terminal } from "lucide-react"
import axiosConfig from "../../../axiosConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


const FormSchema = z.object({
    nome: z.string().min(1, {
      message: "Nome precisa ter no mínimo 1 caractere",
    }),
    descricao: z.string().min(1, {
        message: "Descrição precisa ter no mínimo 1 caractere",
    }),
    preco: z.coerce.number().min(1, {
        message: "Preço precisa ser maior que 0.00",
    })
  })

  export function AddProduct() {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nome: "",
            descricao: "",
            preco: null
        },
      })
    
      function onSubmit(data: z.infer<typeof FormSchema>) {
        axiosConfig.post('/produto', data).then((response) => {
            console.log(response.data)
            toast.success("Produto adicionado com sucesso")
            setTimeout(() => {
              window.location.reload();
          }, 3000);
        }).catch((error) => {
            console.error(error)
            toast.error("Erro ao adicionar produto")
        })
      }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-green-500 text-white" variant="outline">Adicionar novo produto</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="flex justify-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Deseja adicionar um novo produto?</AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center w-96">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Pomada" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Serve para tratar dores musculares..." {...field}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="preco"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                                <Input className="" type="number" placeholder="R$ 12.50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <AlertDialogFooter className="flex justify-center">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction type="submit" className="bg-green-500">Adicionar Produto</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  