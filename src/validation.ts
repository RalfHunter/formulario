import z from 'zod';

const nomeRegex = /^([A-Z][a-zçáéíóúâêôãõü]+)(\s[A-Z][a-zçáéíóúâêôãõü]+)*$/

const formulario = z.object({
    name:z.string().min(1, {message: "O campo nome não pode ser vazio."}).refine((val) => nomeRegex.test(val), {message:"Nome deve ter a primeira letra maiuscula, não pode conter numeros nem caracteres especiais ou seguido de 2 espaços."}),
    email:z.string().email({message:"E-mail inválido!"}),
    sexo:z.enum(["masculino", "feminino"], {message: "Campo sexo obrigatório."}),
    curso:z.enum(["html_css", "python", "javascript", "docker", "virtual_box", "mongodb", "typescript"], {message:"Escolha um curso."}),
    obs:z.string().max(500, {message: "Obsevações não pode ter mais de 500 caracteres!"}),
    termos:z.literal("on", {message:"Clicke em aceitar para continuar."})
})
export default formulario