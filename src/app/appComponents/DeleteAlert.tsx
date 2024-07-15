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
import { useState } from "react"
import { Terminal } from "lucide-react"
import axiosConfig from "../../../axiosConfig"

  export function DeleteAlert({idProduto}: {idProduto: number}) {

    const deleteProduct = async() =>{
        try {
            await axiosConfig.delete('/produto/' + idProduto).then((response) => {
                toast.success("Produto deletado com sucesso")
                setTimeout(() => {
                  window.location.reload();
              }, 3000);
            })
        } catch (error) {
            console.error(error)
            toast.error("Erro ao deletar produto")
        }
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-red-500 text-white" variant="outline">Deletar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita, tem certeza que deseja deletar o produto?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  