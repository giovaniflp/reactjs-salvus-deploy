/* eslint-disable react-hooks/exhaustive-deps */
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axiosConfig from "../../../axiosConfig"

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
    nome: z.string().nullable().optional(),
      descricao: z.string().nullable().optional(),
      preco: z.coerce.number().nullable().optional()
  })

  export function EditProduct({idProduto}: {idProduto: number}) {

    const[nome, setNome] = useState(null)
    const[descricao, setDescricao] = useState(null)
    const[preco, setPreco] = useState(null)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nome: null,
            descricao: null,
            preco: null
        },
      })

    const getProductData = async() =>{
        try {
            await axiosConfig.get('/produto/' + idProduto).then((response) => {
                setNome(response.data.nome)
                setDescricao(response.data.descricao)
                setPreco(response.data.preco)
                console.log(nome)
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        getProductData()
    },[preco != null && descricao != null && nome != null])

      function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        axiosConfig.patch('/produto/' + idProduto, data).then((response) => {
            console.log(response.data)
            toast.success("Produto editado com sucesso")
            setTimeout(() => {
              window.location.reload();
          }, 3000);
        }).catch((error) => {
            console.error(error)
            toast.error("Produto não editado")
        })
      }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-orange-500 text-white" variant="outline">Editar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="flex justify-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Deseja editar o produto?</AlertDialogTitle>
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
                                <Input placeholder={"Atual: " + nome} {...field}/>
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
                                <Textarea placeholder={"Atual: " + descricao} {...field}/>
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
                                <Input type="number" placeholder={"Atual: " + preco} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <AlertDialogFooter className="flex justify-center">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction type="submit" className="bg-orange-500">Editar Produto</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  