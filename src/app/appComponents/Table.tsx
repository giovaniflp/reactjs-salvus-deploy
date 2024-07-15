"use client"

import Image from "next/image"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import axiosConfig from "../../../axiosConfig"
import { useEffect, useState } from "react"
import { format, set } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz'
import { compareAsc, compareDesc } from 'date-fns';
import { Button } from "@/components/ui/button";
import { DeleteAlert } from "./DeleteAlert";
import { EditProduct } from "./EditProduct";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { toast } from "sonner";
  
export default function TableComponent(){

    const[produtosList, setProdutosList] = useState<{ id: number, nome: string, descricao: string, preco: number, data_criacao: Date }[]>([])
    const[page, setPage] = useState(1)
    const[filterNameState, setFilterNameState] = useState(false)
    const[filterPrecoState, setFilterPrecoState] = useState(false)
    const[filterDataState, setFilterDataState] = useState(false)
    const[filterIdState, setFilterIdState] = useState(false)

    const previousPage = () => {
        if (page == 1) {
            toast.error("Não existem mais páginas atrás.")
            setPage(1)
        } else{
            const newPage = page - 1
            setPage(newPage)
            axiosConfig.get(`/produto?page=${newPage}`).then((response) => {
                setProdutosList(response.data)
                console.log(page)
            })
        }
    }

    const nextPage = async() => {
        const newPage = page + 1
        setPage(newPage)
        await axiosConfig.get(`/produto?page=${newPage}`).then((response) => {
            if(response.data.length > 0){
                setProdutosList(response.data)
                console.log(page)
            } else {
                setPage(newPage - 1)
                toast.error("Não existem mais páginas adiante.")
            }
        })
    }

    const formatarData = (data: Date) => {
        return formatInTimeZone(data, 'Pacific/Easter', "dd/MM/yyyy 'às' HH:mm")
    }

    const getProdutos = async () => {
        try {
            const response = await axiosConfig.get(`/produto?page=${page}`);
            
            if (response.data.length === 0) {
                const prevResponse = await axiosConfig.get(`/produto?page=${page - 1}`);
                setProdutosList(prevResponse.data);
            } else {
                setProdutosList(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const filterName = () => {
        setFilterNameState(!filterNameState)
        if(filterNameState){
            const produtosfiltradosDesc =  [...produtosList].sort((a, b) => a.nome.localeCompare(b.nome))
            setProdutosList(produtosfiltradosDesc)
        } else {
            const produtosfiltradosAsc =  [...produtosList].sort((a, b) => b.nome.localeCompare(a.nome))
            setProdutosList(produtosfiltradosAsc)
        }
    }

    const filterPrice = () => {
        setFilterPrecoState(!filterPrecoState)
        if(filterPrecoState){
            const produtosfiltradosDesc =  [...produtosList].sort((a, b) => a.preco - b.preco)
            setProdutosList(produtosfiltradosDesc)
        } else {
            const produtosfiltradosAsc =  [...produtosList].sort((a, b) => b.preco - a.preco)
            setProdutosList(produtosfiltradosAsc)
    }
    }

    const filterDate = () => {
        setFilterDataState(!filterDataState)
        if(filterDataState){
            const produtosfiltradosDesc =  [...produtosList].sort((a, b) => compareAsc(a.data_criacao, b.data_criacao))
            setProdutosList(produtosfiltradosDesc)
        } else {
            const produtosfiltradosAsc =  [...produtosList].sort((a, b) => compareDesc(a.data_criacao, b.data_criacao))
            setProdutosList(produtosfiltradosAsc)
        }
    }

    const filterId = () => {
        setFilterIdState(!filterIdState)
        if(filterIdState){
            const produtosfiltradosDesc =  [...produtosList].sort((a, b) => a.id - b.id)
            setProdutosList(produtosfiltradosDesc)
        } else {
            const produtosfiltradosAsc =  [...produtosList].sort((a, b) => b.id - a.id)
            setProdutosList(produtosfiltradosAsc)
        }
    }
    
    useEffect(()=>{
        getProdutos()
    },[])

    return (
        <div>
        <Table>
  <TableCaption>Listagem e filtragem de seus produtos.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead onClick={filterId} className="w-10 cursor-pointer">
        <div className="flex justify-center items-center gap-2">
            <h2>ID</h2>
            <Image alt="" src={"/icons/unfold.svg"} width={20} height={20}></Image>
        </div>
      </TableHead>
        <TableHead onClick={filterName} className="cursor-pointer flex justify-center items-center gap-2">
            <h2>Nome</h2>
            <Image alt="" src={"/icons/unfold.svg"} width={20} height={20}></Image>
        </TableHead>
      <TableHead>Descrição</TableHead>
      <TableHead onClick={filterPrice} className="text-right cursor-pointer">
            <div className="flex justify-end items-center gap-2">
                <h2>Preço</h2>
                <Image alt="" src={"/icons/unfold.svg"} width={20} height={20}></Image>
            </div>
      </TableHead>
      <TableHead onClick={filterDate} className="cursor-pointer">
            <div className="flex justify-center items-center gap-2">
                <h2>Data de Criação</h2>
                <Image alt="" src={"/icons/unfold.svg"} width={20} height={20}></Image>
            </div>
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
        {produtosList.map((produto) => (
            <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell className="w-32">{produto.nome}</TableCell>
                <TableCell>{produto.descricao}</TableCell>
                <TableCell className="text-right w-40">R$ {produto.preco}</TableCell>
                <TableCell className="w-56">{formatarData(produto.data_criacao)}</TableCell>
                <TableCell className="w-40">
                    <div className="flex gap-4">
                        <EditProduct idProduto={produto.id}></EditProduct>
                        <DeleteAlert idProduto={produto.id}></DeleteAlert>
                    </div>
                </TableCell>
            </TableRow>
        ))}
  </TableBody>
</Table>
<Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={previousPage} className="cursor-pointer"/>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={nextPage} className="cursor-pointer"/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
        </div>
    )
}



